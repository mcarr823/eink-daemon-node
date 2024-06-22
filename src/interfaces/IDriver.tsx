import { BitsPerPixel } from "@/enums/BitsPerPixel";

/**
 * Interface from which any driver implementation should inherit.
 * 
 * This is a generic interface to cover all drivers regardless of
 * their connection type.
 */
export default interface IDriver{

    // Current BPP mode of the panel
    bpp: BitsPerPixel

    // Panel size in pixels
    width: number;
    height: number;

    // Initialize the panel
    init(): void;

    // Wait until the panel is ready for input
    waitUntilPanelReady(): void;

    // Draw an image on the panel
    draw(x: number, y: number, image: Buffer): void;

    // Clear the panel
    clear(): void;
    
}