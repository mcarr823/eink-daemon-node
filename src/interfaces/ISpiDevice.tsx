import ISpiMessage from "./ISpiMessage";

/**
 * Interface made to mimic the SpiDevice class from spi-dev.
 * 
 * This is so classes can rely on this interface instead of the
 * actual class, because the actual class requires a working SPI
 * device (GPIO pins) to function.
 */
export default interface ISpiDevice{

    transfer(message: ISpiMessage[], callback: (error: Error | null | undefined, msg: ISpiMessage[]) => void): void

    close(callback: (error: Error | null | undefined) => void): void
    
}