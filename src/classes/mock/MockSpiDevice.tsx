import ISpiDevice from "@/interfaces/ISpiDevice";
import ISpiMessage from "@/interfaces/ISpiMessage";

/**
 * Mock SPI device.
 * 
 * This presents a fake SPI device for testing purposes,
 * since only certain devices (eg. the raspberry pi)
 * actually have GPIO pins, which SPI devices use.
 */
export default class MockSpiDevice implements ISpiDevice{
    
    transfer(message: ISpiMessage[], callback: (error: Error | null | undefined, msg: ISpiMessage[]) => void): void {
        callback(null, message)
    }

    close(callback: (error: Error | null | undefined) => void): void {
        callback(null)
    }

}