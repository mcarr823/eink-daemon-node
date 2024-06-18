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

    packed_buffer: Array<number>;

    constructor(){
        this.packed_buffer = []
    }

    /**
     * @param bpp Number of bytes per pixel
     * @param frame_buffer Input stream (image file) to pack
     * @param flipWord If true, write each word (2 bytes) in reverse
     * order. So instead of writing 010100, we would write 101000
     */
    pack(
        bpp: number,
        frame_buffer: Array<number>,
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
        const len = frame_buffer.length / halfstep
        this.packed_buffer = Array<number>(frame_buffer.length / halfstep)
        console.log("Buffer len: "+len)

        // Select the packing function based on which bpp
        // mode we're using.
        const packfn: (
            i: number,
            bytes: Array<number>
        ) => void =
            (bpp == 1) ?
                this.pack_1bpp :
            (bpp == 2) ?
                this.pack_2bpp :
            (bpp == 4) ?
                this.pack_4bpp :
                this.pack_8bpp

        // Step through the frame buffer and pack its bytes
        // into packed_buffer.
        for (var i = 0; i < frame_buffer.length; i += step){
            const byte1 = frame_buffer.slice(i, i+halfstep)
            const byte2 = frame_buffer.slice(i+halfstep, i+step)
            const bytes = flipWord ? [...byte2, ...byte1] : [...byte1, ...byte2]
            packfn(i / halfstep, bytes)
        }

        return this.packed_buffer

    }

    /**
     * @param i Index
     * @param bytes Bytes to pack
     */
    pack_1bpp(
        i: number,
        bytes: Array<number>
    ){
        // Note that these bitwise operators are
        // used intentionally for speed.
        // It's ugly code, but it's fast, which is
        // important for byte packing.
        this.packed_buffer[i] =
            (bytes[8] ? 1 : 0) |
            (bytes[9] ? 2 : 0) |
            (bytes[10] ? 4 : 0) |
            (bytes[11] ? 8 : 0) |
            (bytes[12] ? 16 : 0) |
            (bytes[13] ? 32 : 0) |
            (bytes[14] ? 64 : 0) |
            (bytes[15] ? 128 : 0)
        this.packed_buffer[i+1] =
            (bytes[0] ? 1 : 0) |
            (bytes[1] ? 2 : 0) |
            (bytes[2] ? 4 : 0) |
            (bytes[3] ? 8 : 0) |
            (bytes[4] ? 16 : 0) |
            (bytes[5] ? 32 : 0) |
            (bytes[6] ? 64 : 0) |
            (bytes[7] ? 128 : 0)
    }

    /**
     * @param i Index
     * @param bytes Bytes to pack
     */
    pack_2bpp(
        i: number,
        bytes: Array<number>
    ){
        this.packed_buffer[i] =
            (bytes[4] ? 3 : 0) |
            (bytes[5] ? 12 : 0) |
            (bytes[6] ? 48 : 0) |
            (bytes[7] ? 192 : 0)
        this.packed_buffer[i+1] =
            (bytes[0] ? 3 : 0) |
            (bytes[1] ? 12 : 0) |
            (bytes[2] ? 48 : 0) |
            (bytes[3] ? 192 : 0)
    }
    
    /**
     * @param i Index
     * @param bytes Bytes to pack
     */
    pack_4bpp(
        i: number,
        bytes: Array<number>
    ){
        this.packed_buffer[i] =
            (bytes[2] ? 15 : 0) |
            (bytes[3] ? 240 :0)
        this.packed_buffer[i+1] = 
            (bytes[0] ? 15 : 0) |
            (bytes[1] ? 240 : 0)
    }
    
    /**
     * @param i Index
     * @param bytes Bytes to pack
     */
    pack_8bpp(
        i: number,
        bytes: Array<number>
    ){
        this.packed_buffer[i] =
            (bytes[1] ? 255 : 0)
        this.packed_buffer[i+1] = 
            (bytes[0] ? 255 : 0)
    }

}