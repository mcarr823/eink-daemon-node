import PImage, { Bitmap } from "pureimage";

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
        this.img = PImage.make(width, height)

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
     * @returns Buffer of the image's byte data
     */
    asBuffer(): Buffer {
        return Buffer.from(this.img.data)
    }
    
}