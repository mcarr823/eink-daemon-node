/**
 * Interface from which any driver implementation should inherit.
 * 
 * This is a generic interface to cover all drivers regardless of
 * their connection type.
 */
export default interface IDriver{

    // Initialize the panel
    init(): void;

    // Wait until the panel is ready for input
    waitUntilReady(): void;

    // Draw an image on the panel
    draw(x: number, y: number, image: Buffer): void;

    // Clear the panel
    clear(): void;
    
}