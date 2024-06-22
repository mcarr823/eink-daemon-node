import UsbCommandBlockWrapper from "@/classes/UsbCommandBlockWrapper";
import { Uint8 } from "@/classes/IntConverter";
import UsbCommandStatusWrapper from "@/classes/UsbCommandStatusWrapper";
import IUsbDriver from "@/interfaces/IUsbDriver";
import { BitsPerPixel } from "@/enums/BitsPerPixel";

export default abstract class AbstractUsbDriver implements IUsbDriver{

    // Properties from IUsbDriver
    abstract vendorId: string;
    abstract productId: string;
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
    abstract draw(x: number, y: number, image: Buffer, displayModeOverride: number): void;
    abstract clear(): void;

    // Usb driver properties
    tag_num: number = 0;

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
        extra_data: Buffer = Buffer.alloc(0),
        bigEndian: boolean = false
    ){

        // combine this with any additional data
        Buffer.concat
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

    // Wait `millis` milliseconds before continuing
    async delay_ms(millis: number) {
        await new Promise(resolve => setTimeout(resolve, millis));
    }

    /**
     * Reads a set number of bytes from the socket.
     * 
     * @param length Number of bytes to read from the socket
     * @return Buffer containing `length` bytes
     */
    read(length: number): Buffer {
        // TODO
        throw Error("Not yet implemented")
    }

    /**
     * Writes a buffer filled with bytes to a socket.
     * 
     * @param byte_list Bytes to write to the socket
     * @return Number of bytes successfully written to the socket
     */
    write(byte_list: Buffer): number {
        // TODO
        throw Error("Not yet implemented")
    }


}