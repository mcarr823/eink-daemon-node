import UsbRegisterCommand from "@/classes/UsbRegisterCommand";
import AbstractUsbDriver from "./AbstractUsbDriver";
import { BitsPerPixel } from "@/enums/BitsPerPixel";
import { Uint8, bytesToIntArray, intArrayToBytes, shortToBytes } from "@/classes/IntConverter";
import Image from "@/classes/Image";
import IPanelQueryResult from "@/interfaces/IPanelQueryResult";
import UsbDeviceBuilder from "@/classes/UsbDeviceBuilder";

export default async function IT8951Usb(): Promise<USB_IT8951> {
    const { endpoint_in, endpoint_out, device } = await UsbDeviceBuilder({
        vendorId: 0x048d,
        productId: 0x8951,
        device_interface_number: 0,
        endpoint_in_number: 0,
        endpoint_out_number: 1
    })
    return new USB_IT8951(endpoint_in, endpoint_out, device)
}

class USB_IT8951 extends AbstractUsbDriver {

    // Parent properties
    bpp: BitsPerPixel = BitsPerPixel.BPP1;
    base_address: number = 0;
    width: number = 0;
    height: number = 0;

    // Note that flipWord is set to false.
    // In USB mode, the IT8951 driver doesn't require words
    // to be flipped.
    // But in GPIO mode, it does.
    flipWord: boolean = false;

    // Class properties

    // Maximum transfer size is 60k bytes for IT8951 USB
    // 20 bytes are used for the headers of an area load request,
    // so subtract that from 60k to give the max data chunk size
    MAX_TRANSFER = (60 * 1024) - 20

    // Register values and functions
    REG_DISPLAY_BASE = 0x1000
    REG_LUTAFSR = this.REG_DISPLAY_BASE + 0x224 // LUT Status Reg (status of All LUT Engines)
    REG_UP1SR = this.REG_DISPLAY_BASE + 0x138  // Update Parameter1 Setting Reg
    REG_BGVR = this.REG_DISPLAY_BASE + 0x250 // Bitmap (1bpp) image color table
    REG_WIDTH = this.REG_DISPLAY_BASE + 0x24C

    REG_SYSTEM_BASE = 0
    REG_I80CPCR = this.REG_SYSTEM_BASE + 0x04

    // Might not be needed
    REG_ADJUST = 0x18000000

    // Maximum height for a single image chunk.
    // IT8951 USB data transfers are limited in how much
    // data can be sent in a single command.
    // So we split images into chunks of `max_chunk_height`
    // height if they're too big.
    max_chunk_height: number = 0

    // Used for calculating the positioning of direct register writes
    // in relation to the bpp mode
    pitch: number = 0

    // Most recently used display mode.
    // The display mode will potentially change between commands,
    // but most of the time we'll re-use the previous display mode.
    last_display_mode: DisplayMode = DisplayMode.INIT

    // The IT8951 panels support either 6 or 8 different display modes,
    // depending on which model of panel it is.
    display_modes_supported: number = 0

    read_register(address: number, length: number): Promise<Buffer> {
        const lengthBytes = shortToBytes(length, true)
        const cmd = UsbRegisterCommand({
            address,
            command: RegisterCommand.READ,
            value: lengthBytes
        })
        return this.read_command(cmd, length, false)
    }

    write_register(address: number, data: Buffer): Promise<void> {
        const lengthBytes = shortToBytes(data.byteLength, true)
        const cmd = UsbRegisterCommand({
            address,
            command: RegisterCommand.WRITE,
            value: lengthBytes
        })
        return this.write_command(cmd, data, Buffer.alloc(0), false)
    }

    write_register_fast(address: number, data: Buffer): Promise<void> {
        const lengthBytes = shortToBytes(data.byteLength, true)
        const cmd = UsbRegisterCommand({
            address,
            command: RegisterCommand.WRITE_FAST,
            value: lengthBytes
        })
        return this.write_command(cmd, data, Buffer.alloc(0), false)
    }

    async init(): Promise<void> {

        const sysInfo = await this.get_system_info()
        this.base_address = sysInfo.image_buffer_base;
        this.width = sysInfo.width;
        this.height = sysInfo.height;
        this.display_modes_supported = sysInfo.mode
        
    }

    async waitUntilPanelReady(): Promise<void> {
        do{
            const stateBytes = await this.read_register(this.REG_LUTAFSR, 2)
            const stateInt = stateBytes.readInt16BE()
            if (stateInt == 0)
                break
            await this.delay_ms(100)
        }while(true)
    }

    async draw(
        x: number,
        y: number,
        image: Image,
        displayModeOverride: number = this.last_display_mode,
        refreshAfter: boolean = true
    ): Promise<void> {

        const h = image.img.height
        const w = image.img.width

        // Iterate over the image by cutting it up into chunks.
        // Chunk sizes are determined by the max allowed chunk height.
        // This is necessary due to limitations on how much data
        // can be sent via USB commands in one go.
        for (var y_offset = 0; y_offset < h; y_offset += this.max_chunk_height){

            // Get a chunk of max_chunk_height in height.
            // Or, if there aren't that many pixels left, just grab
            // whatever remains of the image.
            const remaining = h - y_offset
            const chunk_height = Math.min(this.max_chunk_height, remaining)

            // We're chunking the image vertically, so x_offset will
            // always be 0
            const x_offset = 0

            // Crop the image.
            // These values are relative to the IMAGE x/y coordinates,
            // not the PANEL coordinates.
            const cropped = image.asBufferGrayscale({
                x: x_offset,
                y: y_offset,
                width: w,
                height: chunk_height
            })

            // Pack the bytes
            const packed = this.pack_image(cropped)

            // Load the cropped image to the panel.
            // These values are relative to the PANEL x/y coordinates.
            const x2_start = x + x_offset
            const y2_start = y + y_offset
            await this.load_image_area(
                x2_start,
                y2_start,
                w,
                chunk_height,
                packed
            )
        }

        if (refreshAfter){
            // Finally, after all the image chunks have been loaded, refresh the panel
            await this.display_area(x, y, w, h, displayModeOverride)
        }
        
    }

    clear(): Promise<void> {
        const image = new Image(this.width, this.height)
        image.fill("#FFF")
        return this.draw(0, 0, image, DisplayMode.INIT)
    }

    async query(): Promise<IPanelQueryResult> {
        throw new Error("Not yet implemented")
    }




    /**
     * Query the IT8951 board for its panel information.
     * 
     * IT8951 panels come in different sizes and resolutions,
     * and some support different display modes.
     * 
     * So it's important that we query the panel for this
     * information before doing anything else.
     */
    async get_system_info(): Promise<ISystemInfo> {

        // How many bytes to read
        const length = 29 * 4

        // Command to run
        const cmd = Command.GET_SYS

        // Read the panel information into a buffer
        const byte_list = await this.read_command(cmd, length, false)

        // Convert the byte buffer into a list of ints (4-byte chunks)
        const ints = bytesToIntArray(byte_list, true)

        const standard_cmd_no = ints[0]
        const extended_cmd_no = ints[1]
        const signature = ints[2]
        const version = ints[3]
        const width = ints[4]
        const height = ints[5]
        const update_buf_base = ints[6]
        const image_buffer_base = ints[7]
        const temperature_no = ints[8]
        const mode = ints[9]

        // We don't need these
        // const frame_count = ints[10:18]
        // const num_img_buf = ints[18]
        // const reserved = ints[19:28]

        // If you want this value, read 30 bytes instead
        // of 29 with the initial `length` variable
        //const command_table_ptr = ints[29]

        return {
            standard_cmd_no,
            extended_cmd_no,
            signature,
            version,
            width,
            height,
            update_buf_base,
            image_buffer_base,
            temperature_no,
            mode
        }
    }

    load_image_area(
        x: number,
        y: number,
        w: number,
        h: number,
        buffer: Buffer
    ): Promise<void> {

        if (buffer.byteLength > this.MAX_TRANSFER)
            throw Error(`Buffer is too big. ${buffer.byteLength} > ${this.MAX_TRANSFER}`)
        
        const address = this.base_address

        if (w == this.width){

            const adjusted_address = address - this.REG_ADJUST + Math.floor(this.pitch * y)
            return this.write_register_fast(adjusted_address, buffer)

        }else if (this.bpp == 1){

            // The LD_IMAGE_AREA_CMD command only support 8bpp images
            throw Error("1bpp mode only supports full-width images")

        }else{

            const area = intArrayToBytes([address, x, y, w, h], true)
            const command = Command.LD_IMAGE_AREA
            return this.write_command(command, area, buffer, false)

        }

    }

    display_area(
        x: number,
        y: number,
        w: number,
        h: number,
        display_mode: DisplayMode
    ): Promise<void> {

        // If not defined, use the default display mode determined by the bpp
        if (display_mode == DisplayMode.UNDEFINED)
            display_mode = this.last_display_mode
            
        const wait_ready = 1
        const address = this.base_address
        const display_area = intArrayToBytes([address, display_mode, x, y, w, h, wait_ready], true)
        const extra = Buffer.alloc(0)
        return this.write_command(Command.DPY_AREA, display_area, extra, false)

    }

    async set_bpp(
        bpp: BitsPerPixel
    ): Promise<void> {

        if (bpp != 1 && bpp != 8)
            throw Error("The USB driver only supports 1bpp or 8bp")

        this.bpp = bpp

        // Start by calculating the panel width in double-words for 1bpp mode.
        // 
        // In other words, this is the number of 4-byte aligned chunks of data
        // we would need to display a single row of pixels in 1bpp mode.
        // In 1bpp mode, a single byte represents 8 pixels.
        // So a 4-byte chunk is 32 pixels.
        // 
        // To enforce 4-byte alignment, we then round the value with +31 and //32
        // because not all panels are 32px*n wide.
        // eg. an 1872 width panel would be rounded to 1888 (32px * 59).
        // That would give us panel_width_bytes_1bpp a value of 59.
        const panel_width_bytes_1bpp = (this.width + 31) // 32

        // Next, calculate the memory pitch.
        // The pitch is the number of bytes needed to fill 1 row of the panel.
        // 
        // For 1bpp mode, this is panel_width_bytes_1bpp * 4.
        // That's because panel_width_bytes_1bpp is already the number of bytes
        // needed represented as 4-byte chunks.
        // So to get the number of bytes, we just multiple that number by 4.
        // 
        // For 8bpp mode, the number of bytes needed is simply the width of the
        // panel, since in 8bpp mode 1 byte = 1 pixel.
        const mem_pitch_1bpp = panel_width_bytes_1bpp * 4
        const mem_pitch_8bpp = this.width
        if (bpp == 1)
            this.pitch = mem_pitch_1bpp
        else
            this.pitch = mem_pitch_8bpp


        // Set the bpp and pitch registers.
        // This tells the panel whether we're in 1bpp or 8bpp mode.
        // It also puts the panel in pitch mode, if needed.
        const bpp_and_pitch_mode = await this.read_register(this.REG_UP1SR, 4)
        if (bpp == 1)
            bpp_and_pitch_mode[2] |= 0x06
        else
            bpp_and_pitch_mode[2] &= 0xf9
        await this.write_register(this.REG_UP1SR, bpp_and_pitch_mode)

        // 1bpp color table
        // Not necessary for 8bpp, but it doesn't hurt to leave it in
        const gray = 0xf0
        const black = 0x00
        await this.write_register(this.REG_BGVR, Buffer.from([gray, black]))

        // Set the device width in bytes as if we were in 1bpp mode.
        // Again, probably not necessary for 8bpp mode, but it doesn't hurt.
        const width_as_bytes = shortToBytes(panel_width_bytes_1bpp, false)
        await this.write_register(this.REG_WIDTH, width_as_bytes)

        // Set the display mode to either A2 or DU.
        // This should probably be set elsewhere and be changes on a per-draw
        // basis instead.
        if (bpp == 1)
            if (this.display_modes_supported == 6)
                this.last_display_mode = DisplayMode.A2_M641
            else
                this.last_display_mode = DisplayMode.A2_M841
        else
            this.last_display_mode = DisplayMode.DU4

        // Calculate the maximum height which a single image write could be
        // with the compressed byte data still being smaller than MAX_TRANSFER.
        // 
        // For example, let's say the panel is 1872px wide.
        // In 1bpp mode this is rounded to 1888px (4-byte aligned).
        // This gives a 1bpp pitch of 236 and an 8bpp pitch of 1872.
        // MAX_TRANSFER is 61,420
        // 
        // Image writes for the USB driver need to be full-width.
        // The pitch tells us the number of bytes in a full-width row.
        // So the number of bytes transferred will be a multiple of the pitch.
        // 
        // In 8bpp mode:
        // 61420 / 1872 = 32.80982905982906
        // Rounded down, that's 32px.
        // So in 8bpp mode, an image chunk can be a maximum of 1872x32 pixels and
        // still be under the MAX_TRANSFER limit.
        // 1872 x 32 = 59,904px
        // 1px = 1byte in 8bpp mode, so 59,904px = 59,904 bytes.
        // 
        // In 1bpp mode:
        // 61420 / 236 = 260.2542372881356
        // Rounded down, that's 260px.
        // So in 1bpp mode, an image chunk can be a maximum of 1888x260 pixels and
        // still be under the MAX_TRANSFER limit.
        // 260 * 1888 = 490,880px
        // 1px = 8 bytes in 1bpp mode, so
        // 490,880px / 8 = 61,360 bytes
        //  
        this.max_chunk_height = Math.floor(this.MAX_TRANSFER / this.pitch)
        // this.max_chunk_height = int(self.MAX_TRANSFER / (this.pitch * 8 / bpp))

    }

    /**
     * @param vcom VCOM value. Must be an int. eg. 2000 (-0.2V)
     * @returns Number of bytes written. Should always be 16
     */
    set_vcom(
        vcom: number
    ): Promise<number> {

        // Address is 0, since we're not writing an image
        const address = 0

        // Set vcom flag to 1 and power flag to 0 to signify that
        // we're updating the vcom value, not the power value.
        const vcomFlag = Uint8(1)
        const powerFlag = Uint8(0)

        // Power value of 0, since we're not changing that
        const power = Uint8(0)

        // Bundle those all together into a byte buffer
        const value = Buffer.concat([
            shortToBytes(vcom, true),
            vcomFlag,
            powerFlag,
            power
        ])

        // Build the register command
        const cmd = UsbRegisterCommand({
            address,
            command: RegisterCommand.SET_VCOM,
            value
        })

        // And finally, write the command to the driver board
        return this.write(cmd)

    }
    
}

interface ISystemInfo{
    standard_cmd_no: number;
    extended_cmd_no: number;
    
    // Always 8951 (943273265)
    signature: number;
    
    // Command table version
    version: number;
    
    // Panel width
    width: number;

    // Panel height
    height: number;
    
    // Update buffer address
    update_buf_base: number;

    // Image register address
    image_buffer_base: number;

    // Panel temperature
    temperature_no: number;

    // Display mode
    mode: number;
}

enum DisplayMode{
    UNDEFINED = -1,
    INIT = 0,
    DU4 = 1,
    A2_M641 = 4,
    A2_M841 = 6
}

enum RegisterCommand{
    READ = 129,
    WRITE = 130,
    SET_VCOM = 163,
    WRITE_FAST = 165
}

const Command = {

    INQUIRY_CMD: Buffer.from([18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),

    // 254 = 0xFE = "Customer Command"
    GET_SYS: Buffer.from([254, 0, 56, 57, 53, 49, 128, 0, 1, 0, 2, 0, 0, 0, 0, 0]),
    LD_IMAGE_AREA: Buffer.from([254, 0, 0, 0, 0, 0, 162, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    DPY_AREA: Buffer.from([254, 0, 0, 0, 0, 0, 148, 0, 0, 0, 0, 0, 0, 0, 0, 0])

} as const;