import UsbCommandBlockWrapper from "@/classes/UsbCommandBlockWrapper";
import { Uint8 } from "@/classes/IntConverter";
import UsbCommandStatusWrapper from "@/classes/UsbCommandStatusWrapper";
import IUsbDriver from "@/interfaces/IUsbDriver";
import { BitsPerPixel } from "@/enums/BitsPerPixel";
import Image from "@/classes/Image";
import AbstractDriver from "../AbstractDriver";
import { usb, findByIds, InEndpoint, OutEndpoint, Endpoint, LibUSBException } from 'usb';

/**
 * Connects asynchronously to a given USB device.
 * 
 * The vendor and product IDs are what identify a specific
 * USB device.
 * You can find these by using the `lsusb` program.
 * Expected output of that program is something like:
 * Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
 * Where `1d6b` is the vendor ID and `0002` is the product ID.
 * 
 * @param vendorId Number representing vendor identifier
 * @param productId Number representing product identifier
 * @param device_interface_number Which USB interface to access
 * @param endpoint_in_number Which endpoint of the USB interface provides input
 * @param endpoint_out_number Which endpoint of the USB interface provides output
 * @returns Promise with the open input and output endpoints
 */
export default async function UsbDriver({
    vendorId,
    productId,
    device_interface_number,
    endpoint_in_number,
    endpoint_out_number
} : {
    vendorId: number;
    productId: number;
    device_interface_number: number;
    endpoint_in_number: number;
    endpoint_out_number: number;
}): Promise<{
    endpoint_in: InEndpoint;
    endpoint_out: OutEndpoint;
}>{
    
    const device = findByIds(vendorId, productId)
    if (!device){
        throw Error("Failed to find device")
    }

    device.open(true)

    const error = await new Promise((cb: (error: LibUSBException | undefined) => void) => device.reset(cb))
    if (error){
        throw error
    }

    if (device.__isKernelDriverActive(device_interface_number)){
        device.__detachKernelDriver(device_interface_number)
    }

    const intf = device.interface(device_interface_number)
    const inEndpoint = intf.endpoint(endpoint_in_number)
    const outEndpoint = intf.endpoint(endpoint_out_number)

    if (!inEndpoint || !outEndpoint){
        throw Error("Failed to setup endpoints")
    }else if (inEndpoint !instanceof InEndpoint){
        throw Error("Failed to setup input endpoint")
    }else if (outEndpoint !instanceof OutEndpoint){
        throw Error("Failed to setup output endpoint")
    }

    const endpoint_in = inEndpoint as InEndpoint
    const endpoint_out = outEndpoint as OutEndpoint

    return {
        endpoint_in,
        endpoint_out
    }

}

export abstract class AbstractUsbDriver extends AbstractDriver implements IUsbDriver{

    // Properties from IUsbDriver
    abstract bpp: BitsPerPixel;
    abstract base_address: number;
    abstract width: number;
    abstract height: number;

    // Functions from IUsbDriver
    abstract read_register(address: number, length: number): Buffer;
    abstract write_register(address: number, data: Buffer): void;
    abstract write_register_fast(address: number, data: Buffer): void;
    abstract init(): void;
    abstract waitUntilPanelReady(): void;
    abstract draw(x: number, y: number, image: Image, displayModeOverride: number): void;
    abstract clear(): void;

    // Usb driver properties
    tag_num: number = 0;
    endpoint_in: InEndpoint
    endpoint_out: OutEndpoint

    constructor(
        endpoint_in: InEndpoint,
        endpoint_out: OutEndpoint
    ){
        super()
        this.endpoint_in = endpoint_in
        this.endpoint_out = endpoint_out
    }

    /**
     * Each request should have an identifier.
     * This function increments the sequential ID and returns it.
     * 
     * @returns Tag number
     */
    get_tag(){
        this.tag_num += 1
        return this.tag_num
    }

    /**
     * Constructs a CBW (command block wrapper) to transmit
     * some data over the USB connection.
     * 
     * @param command_data List of 16 bytes
     * @param data_transfer_length Length of request data
     * @param incoming True if we're requesting data, otherwise False
     * @param bigEndian True if the data is in big endian mode
     * @returns CBW object
     */
    get_command_block_wrapper(
        command_data: Buffer,
        data_transfer_length: number,
        incoming: boolean,
        bigEndian: boolean
    ){
        const flags = Uint8(incoming ? 128 : 0)
        const tag = this.get_tag()
        const signature = Buffer.from(new Uint8Array([85, 83, 66, 67]))
        return UsbCommandBlockWrapper({
            signature,
            tag,
            data_transfer_length,
            flags,
            logical_unit_number: Uint8(0),
            command_length: Uint8(16),
            command_data,
            bigEndian
        })
    }

    read_command(
        command: Buffer,
        length: number,
        bigEndian: boolean
    ){
        
        // issue CBW block
        const cbw_data = this.get_command_block_wrapper(command, length, true, bigEndian)
        const written = this.write(cbw_data)

        // print("Command "+str(command))
        // print("Length "+str(length))
        // print("CBW: "+str(cbw_data))
        // print("Written "+str(written))

        // now read the data
        const buf = this.read(length)
        // print("Received "+str(buf))

        // issue CBS block
        this.send_status_block_wrapper()

        // transform data into required data
        return buf
    }

    write_command(
        command: Buffer,
        value_data: Buffer,
        extra_data: Buffer,
        bigEndian: boolean = false
    ){

        // combine this with any additional data
        const bulk_data = Buffer.concat([value_data, extra_data])

        // issue CBW block
        const cbw_data = this.get_command_block_wrapper(command, bulk_data.length, false, bigEndian)
        this.write(cbw_data)

        // now write the data for the value
        this.write(bulk_data)

        // issue CBS block
        this.send_status_block_wrapper()
    }

    send_status_block_wrapper(): UsbCommandStatusWrapper {

        // A CSW is exactly 13 bytes
        const length = 13

        // Read the CSW byte data from the socket
        const csb_data = this.read(length)

        return new UsbCommandStatusWrapper(csb_data, true)

    }

    /**
     * Reads a set number of bytes from the socket.
     * 
     * @param length Number of bytes to read from the socket
     * @returns Buffer of byte data if successfully read
     * @throws Error if USB read fails
     */
    async read(
        length: number
    ): Promise<Buffer> {

        const { error, data } = await new Promise((cb: (args: { error: LibUSBException | undefined, data?: Buffer }) => void) => {
            this.endpoint_in.transfer(length, (error, data) => {
                cb({ error, data })
            })
        })

        if (data)
            return data
        else if (error)
            throw error
        else
            throw Error("Failed to read data from USB")

    }

    /**
     * Writes a buffer filled with bytes to a socket.
     * 
     * @param data Bytes to write to the socket
     * @returns Number of bytes written to the socket
     * @throws Error if write fails
     */
    async write(
        data: Buffer
    ): Promise<number> {

        const { error, bytesWritten } = await new Promise((cb: (args: { error: LibUSBException | undefined, bytesWritten: number }) => void) => {
            this.endpoint_out.transfer(data, (error, bytesWritten) => {
                cb({ error, bytesWritten })
            })
        })

        if (error)
            throw error
        else
            return bytesWritten
        
    }


}