import BytePacker from "@/classes/BytePacker"
import Image from "@/classes/Image";
import { BitsPerPixel } from "@/enums/BitsPerPixel";
import IDriver from "@/interfaces/IDriver"

/**
 * Abstract class which any driver types should extent.
 * 
 * eg. a USB panel driver would extend AbstractUsbDriver,
 * which would extend this class.
 * 
 * This class provides functions which are universally useful
 * for all drivers.
 */
export default abstract class AbstractDriver implements IDriver{

    // Properties from IDriver
    abstract bpp: BitsPerPixel
    abstract width: number;
    abstract height: number;

    // Functions from IDriver
    abstract init(): Promise<void>;
    abstract waitUntilPanelReady(): Promise<void>;
    abstract draw(x: number, y: number, image: Image, displayModeOverride: number, refreshAfter: boolean): Promise<void>;
    abstract clear(): Promise<void>;

    // Whether this board/driver needs to flip words when packing
    flipWord: boolean = false;

    /**
     * Packs a grayscale (8bpp) image buffer to be sent to a panel.
     * 
     * See the BytePacker class for more details on what this means
     * and why it is done.
     * 
     * @param buffer Image converted to a grayscale buffer.
     * This function assumes that you've called asGrayscaleBuffer
     * on an image object.
     * 
     * @returns Packed buffer
     */
    pack_image(
        buffer: Buffer
    ){

        const packer = new BytePacker()
        return packer.pack(this.bpp, buffer, this.flipWord)

    }

    // Wait `millis` milliseconds before continuing
    delay_ms(millis: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, millis));
    }

}