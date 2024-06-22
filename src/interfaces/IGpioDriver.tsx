import IDriver from "./IDriver";

/**
 * Interface from which any GPIO-connected panel driver
 * implementations should inherit.
 */
export default interface IGpioDriver extends IDriver {
    
    // Wait until the BUSY pin is low.
    // ie. Wait until the pins are idle (no commands in progress)
    // before proceeding.
    // Not to be confused with the IDriver function: waitUntilPanelReady
    // A panel can be ready when the pins are not, and vice versa.
    waitUntilGpioPinReady(): void

}