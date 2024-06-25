import Image from "@/classes/Image";
import { BitsPerPixel } from "@/enums/BitsPerPixel";
import IPanelQueryResult from "./IPanelQueryResult";

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
    init(): Promise<void>;

    // Wait until the panel is ready for input
    waitUntilPanelReady(): Promise<void>;

    // Draw an image on the panel
    draw(x: number, y: number, image: Image, displayModeOverride: number, refreshAfter: boolean): Promise<void>;

    // Clear the panel
    clear(): Promise<void>;

    /**
     * Writes a buffer filled with bytes to a socket.
     * 
     * @param data Bytes to write to the socket
     * @returns Number of bytes written to the socket
     * @throws Error if write fails
     */
    write(
        data: Buffer
    ): Promise<number>

    /**
     * Reads a set number of bytes from the socket.
     * 
     * @param length Number of bytes to read from the socket
     * @returns Buffer of byte data if successfully read
     * @throws Error if read fails
     */
    read(
        length: number
    ): Promise<Buffer>

    /**
     * Closes the socket connection
     */
    close(): Promise<void>

    query(): Promise<IPanelQueryResult>
    
}