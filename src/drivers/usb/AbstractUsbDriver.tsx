import UsbCommandBlockWrapper from "@/classes/UsbCommandBlockWrapper";
import { Uint8 } from "@/classes/IntConverter";
import UsbCommandStatusWrapper from "@/classes/UsbCommandStatusWrapper";
import IUsbDriver from "@/interfaces/IUsbDriver";
import { BitsPerPixel } from "@/enums/BitsPerPixel";
import Image from "@/classes/Image";
import AbstractDriver from "../AbstractDriver";
import { usb, findByIds, InEndpoint, OutEndpoint, Endpoint, LibUSBException } from 'usb';
import IPanelQueryResult from "@/interfaces/IPanelQueryResult";
import IInEndpoint from "@/interfaces/IInEndpoint";
import IOutEndpoint from "@/interfaces/IOutEndpoint";
import IUsbDevice from "@/interfaces/IUsbDevice";

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
    device: usb.Device;
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
        endpoint_out,
        device
    }

}

export abstract class AbstractUsbDriver extends AbstractDriver implements IUsbDriver{

    // Properties from IUsbDriver
    abstract bpp: BitsPerPixel;
    abstract base_address: number;
    abstract width: number;
    abstract height: number;

    // Functions from IUsbDriver
    abstract read_register(address: number, length: number): Promise<Buffer>;
    abstract write_register(address: number, data: Buffer): Promise<void>;
    abstract write_register_fast(address: number, data: Buffer): Promise<void>;
    abstract init(): Promise<void>;
    abstract waitUntilPanelReady(): Promise<void>;
    abstract draw(x: number, y: number, image: Image, displayModeOverride: number, refreshAfter: boolean): Promise<void>;
    abstract clear(): Promise<void>;
    abstract query(): Promise<IPanelQueryResult>;

    // Usb driver properties
    tag_num: number = 0;
    endpoint_in: IInEndpoint
    endpoint_out: IOutEndpoint
    device: IUsbDevice

    constructor(
        endpoint_in: IInEndpoint,
        endpoint_out: IOutEndpoint,
        device: IUsbDevice
    ){
        super()
        this.endpoint_in = endpoint_in
        this.endpoint_out = endpoint_out
        this.device = device
    }

    /**
     * Each request should have an identifier.
     * This function increments the sequential ID and returns it.
     * 
     * @returns Tag number
     */
    get_tag(): number {
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

    async read_command(
        command: Buffer,
        length: number,
        bigEndian: boolean
    ): Promise<Buffer> {
        
        // issue CBW block
        const cbw_data = this.get_command_block_wrapper(command, length, true, bigEndian)
        const written = await this.write(cbw_data)

        // print("Command "+str(command))
        // print("Length "+str(length))
        // print("CBW: "+str(cbw_data))
        // print("Written "+str(written))

        // now read the data
        const buf = await this.read(length)
        // print("Received "+str(buf))

        // issue CBS block
        await this.send_status_block_wrapper()

        // transform data into required data
        return buf
    }

    async write_command(
        command: Buffer,
        value_data: Buffer,
        extra_data: Buffer,
        bigEndian: boolean = false
    ): Promise<void> {

        // combine this with any additional data
        const bulk_data = Buffer.concat([value_data, extra_data])

        // issue CBW block
        const cbw_data = this.get_command_block_wrapper(command, bulk_data.length, false, bigEndian)
        await this.write(cbw_data)

        // now write the data for the value
        await this.write(bulk_data)

        // issue CBS block
        await this.send_status_block_wrapper()
    }

    async send_status_block_wrapper(): Promise<UsbCommandStatusWrapper> {

        // A CSW is exactly 13 bytes
        const length = 13

        // Read the CSW byte data from the socket
        const csb_data = await this.read(length)

        return new UsbCommandStatusWrapper(csb_data, true)

    }

    async read(
        length: number
    ): Promise<Buffer> {

        const { error, data } = await new Promise((cb: (args: { error: Error | undefined, data?: Buffer }) => void) => {
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

    async write(
        data: Buffer
    ): Promise<number> {

        const { error, bytesWritten } = await new Promise((cb: (args: { error: Error | undefined, bytesWritten: number }) => void) => {
            this.endpoint_out.transfer(data, (error, bytesWritten) => {
                cb({ error, bytesWritten })
            })
        })

        if (error)
            throw error
        else
            return bytesWritten
        
    }

    close(): Promise<void> {

        return new Promise((cb: () => void) => {
            this.device.close()
            cb()
        })
    }


}