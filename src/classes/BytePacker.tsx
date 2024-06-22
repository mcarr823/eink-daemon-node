import { BitsPerPixel } from "@/enums/BitsPerPixel";
import { Uint8 } from "./IntConverter";

/**
 * Class for packing raw image bytes into a compressed stream.
 * 
 * This allows us to compress an image as much as possible
 * before sending the data to the e-ink panel, which is often
 * a speed bottleneck.
 * 
 * This works by removing unsupported colors from the image
 * (eg. converting a color image to grayscale) and then
 * packing the reduced color image.
 * 
 * This comes down to the utilization of a small bpp.
 * bpp stands for "bits per pixel", and refers to how
 * many bits of data you would need to represent a single
 * pixel on a screen.
 * 
 * Images on a computer monitor are often saved and displayed
 * as 16bpp, 24bpp, or 32bpp.
 * 8bpp = 256 colors
 * 16bpp = 65,536 colors
 * 24bpp = 16,777,216 colors
 * 32bpp = 16,777,216 colors + transparency
 * 
 * e-ink panels, on the other hand, are either low-color,
 * grayscale, or black and white.
 * They can't display many colors, so we use lower bpp
 * values, such as 1bpp, 2bpp, 4bpp, or 8bpp.
 * 1bpp = 2 colors
 * 2bpp = 4 colors
 * 4bpp = 16 colors
 * 8bpp = 256 colors
 * 
 * Because of this, we can compress an image greatly before
 * transferring it to an e-ink screen.
 * 
 * eg. If a 8x8 (64px) image is saved in 32bpp format, the image
 * would be 2048 bits (64 x 32bpp), or 256 bytes.
 * Converting it to 8bpp would reduce the size to 64 bytes.
 * If the image was black and white, it could be packed as 1bpp
 * to further reduce the size to 8 bytes.
 */
export default class BytePacker{

    packed_buffer: Buffer;

    constructor(){
        this.packed_buffer = Buffer.alloc(0)
    }

    /**
     * @param bpp Number of bytes per pixel
     * @param frame_buffer Input stream (image file) to pack
     * @param flipWord If true, write each word (2 bytes) in reverse
     * order. So instead of writing 010100, we would write 101000
     */
    pack(
        bpp: BitsPerPixel,
        frame_buffer: Buffer,
        flipWord: boolean
    ){

        // Step is the number of bytes we need to read to create a word.
        // A word is 2 bytes (16 bits) in size.
        // However, the input data we use to create the word will vary
        // in length depending on the bpp.
        // eg. If bpp is 1, that means we only grab 1 bit from each
        // input byte. So we would need 16 bytes to get the needed
        // 16 bits.
        // Whereas if bpp is 4, then we grab 4 bits from each byte.
        // So we'd only need to read 4 bytes to get 16 bits.
        const step = 16 / bpp

        // A halfstep is how many input bytes we need to read from
        // frame_buffer in order to pack a single output byte
        // into packed_buffer.
        const halfstep = step / 2

        // Set the size of packed_buffer to be the length of the
        // frame buffer (total input bytes) divided by a halfstep
        // (input bytes needed per packed byte).
        const len = frame_buffer.byteLength / halfstep
        this.packed_buffer = Buffer.alloc(len)
        // console.log("Buffer len: "+len)

        // Select the packing function based on which bpp
        // mode we're using.
        const packfn: (bytes: Buffer) => Buffer =
            (bpp == 1) ?
                this.pack_1bpp :
            (bpp == 2) ?
                this.pack_2bpp :
            (bpp == 4) ?
                this.pack_4bpp :
                this.pack_8bpp

        // Step through the frame buffer and pack its bytes
        // into packed_buffer.
        var index = 0
        for (var i = 0; i < frame_buffer.length; i += step){
            const bytes1 = frame_buffer.subarray(i, i+halfstep)
            const bytes2 = frame_buffer.subarray(i+halfstep, i+step)
            const pack1 = packfn(bytes1)
            const pack2 = packfn(bytes2)
            if (flipWord){
                this.packed_buffer.set(pack2, index)
                this.packed_buffer.set(pack1, index+1)
            }else{
                this.packed_buffer.set(pack1, index)
                this.packed_buffer.set(pack2, index+1)
            }
            index += 2
        }

        return this.packed_buffer

    }

    /**
     * @param bytes Bytes to pack
     */
    pack_1bpp(
        bytes: Buffer
    ): Buffer{
        // Note that these bitwise operators are
        // used intentionally for speed.
        // It's ugly code, but it's fast, which is
        // important for byte packing.
        return Uint8(
            (bytes[0] ? 1 : 0) |
            (bytes[1] ? 2 : 0) |
            (bytes[2] ? 4 : 0) |
            (bytes[3] ? 8 : 0) |
            (bytes[4] ? 16 : 0) |
            (bytes[5] ? 32 : 0) |
            (bytes[6] ? 64 : 0) |
            (bytes[7] ? 128 : 0)
        )
    }

    /**
     * @param bytes Bytes to pack
     */
    pack_2bpp(
        bytes: Buffer
    ): Buffer{
        return Uint8(
            (bytes[0] ? 3 : 0) |
            (bytes[1] ? 12 : 0) |
            (bytes[2] ? 48 : 0) |
            (bytes[3] ? 192 : 0)
        )
    }
    
    /**
     * @param bytes Bytes to pack
     */
    pack_4bpp(
        bytes: Buffer
    ): Buffer{
        return Uint8(
            (bytes[0] ? 15 : 0) |
            (bytes[1] ? 240 : 0)
        )
    }
    
    /**
     * @param i Index
     * @param bytes Bytes to pack
     */
    pack_8bpp(
        bytes: Buffer
    ): Buffer{
        return Uint8(
            bytes[0] ? 255 : 0
        )
    }

}