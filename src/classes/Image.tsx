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
        this.img.data
        return Buffer.from(this.img.data)
    }

    /**
     * Converts the image to grayscale, then returns the
     * resulting bitmap as a Buffer object.
     * 
     * @returns Buffer of the image's byte data in 8bpp
     */
    asBufferGrayscale(): Buffer {
        
        const width = this.img.width
        const height = this.img.height
        const output = Buffer.alloc(width * height)

        // Loop through each pixel and convert it from color (32bpp)
        // to grayscale (8bpp)
        for (var y = 0; y < height; y += 1){
            for (var x = 0; x < width; x += 1){
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