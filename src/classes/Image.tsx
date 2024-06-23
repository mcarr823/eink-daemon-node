import { Bitmap, make } from "pureimage";

/**
 * Image based on the pureimage library
 * https://www.npmjs.com/package/pureimage
 * 
 * This should probably be replaced with canvas
 * https://www.npmjs.com/package/canvas
 * at some point in the future for performance reasons
 * depending on how this tool ends up being used.
 * 
 * But for now, pureimage is entirely written in JS,
 * making it more portable, not OS-dependent, and thus
 * more suitable for testing.
 */
export default class Image{

    img: Bitmap;

    constructor(
        width: number,
        height: number
    ){

        // Create the image
        this.img = make(width, height)

    }

    /**
     * Fill the image with one specific color.
     * 
     * @param color Hex value, eg. #000 for black
     */
    fill(color: string){

        // Make it pure white
        const ctx = this.img.getContext("2d")
        ctx.fillStyle = color
        ctx.fillRect(0, 0, this.img.width, this.img.height)

    }

    /**
     * Returns the underlying bitmap as a Buffer object.
     * 
     * @returns Buffer of the image's byte data in 32bpp
     */
    asBufferColor(): Buffer {
        return Buffer.from(this.img.data)
    }

    /**
     * Converts the image to grayscale, then returns the
     * resulting bitmap as a Buffer object.
     * 
     * @returns Buffer of the image's byte data in 8bpp
     */
    asBufferGrayscale(args? : {
        x: number;
        y: number;
        width: number;
        height: number;
    }): Buffer {

        const start_x = args?.x ?? 0
        const start_y = args?.y ?? 0
        const width = args?.width ?? this.img.width
        const height = args?.height ?? this.img.height
        
        const output = Buffer.alloc(width * height)
        const end_x = start_x + width
        const end_y = start_y + height

        // Loop through each pixel and convert it from color (32bpp)
        // to grayscale (8bpp)
        for (var y = start_y; y < end_y; y += 1){
            for (var x = start_x; x < end_x; x += 1){
                const rgba = this.img.getPixelRGBA_separate(x, y)
                const red = rgba[0] * 0.299
                const green = rgba[1] * 0.587
                const blue = rgba[2] * 0.114
                const alpha = rgba[3] / 255.0
                const index = y * height + x
                output[index] = alpha * (red + green + blue)
            }
        }
        
        return output

    }
    
}