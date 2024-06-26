/**
 * Interface made to mimic the SpiMessage class from spi-dev.
 * 
 * This is so classes can rely on this interface instead of the
 * actual class, because the actual class requires a working SPI
 * device (GPIO pins) to function.
 */
export default interface ISpiMessage {
    byteLength: number,
    sendBuffer?: Buffer,
    receiveBuffer?: Buffer,
    speedHz?: number,
    microSecondDelay?: number,
    bitsPerWord?: number,
    chipSelectChange?: boolean,
}