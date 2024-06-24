import IGpioDriver from "@/interfaces/IGpioDriver";
import AbstractDriver from "../AbstractDriver";
import { BitsPerPixel } from "@/enums/BitsPerPixel";
import Image from "@/classes/Image";
import { Gpio } from "pigpio";
import { SpiDevice, SpiMessage, openSync } from "spi-device";

/**
 * Connects asynchronously to a given USB device.
 * 
 * @param spi_bus_no BUS on which SPI is running
 * @param spi_dev_no Device on which SPI is running
 * @returns Promise with the SPI device
 */
export default async function GpioDriver({
    spi_bus_no = 0,
    spi_dev_no = 0
} : {
    spi_bus_no: number;
    spi_dev_no: number;
}){

    // SpiDev init must come first, otherwise CS_PIN read conflicts
    // will sometimes occur during startup.
    const spi = openSync(spi_bus_no, spi_dev_no, {
        maxSpeedHz: 2000000, // 2MHz
        noChipSelect: true
    })

    return spi

}

export abstract class AbstractGpioDriver extends AbstractDriver implements IGpioDriver{

    // Properties from IGpioDriver
    abstract bpp: BitsPerPixel;
    abstract base_address: number;
    abstract width: number;
    abstract height: number;

    // Functions from IGpioDriver
    abstract waitUntilGpioPinReady(): Promise<void>
    abstract read_register(address: number, length: number): Promise<Buffer>;
    abstract write_register(address: number, data: Buffer): Promise<void>;
    abstract write_register_fast(address: number, data: Buffer): Promise<void>;
    abstract waitUntilPanelReady(): Promise<void>;
    abstract draw(x: number, y: number, image: Image, displayModeOverride: number, refreshAfter: boolean): Promise<void>;
    abstract clear(): Promise<void>;

    // Abstract properties for this class
    abstract useDcPin: boolean

    // Properties for this class
    pins = new Map<number, Gpio>()
    spi: SpiDevice

    // Common pin numbers
    // These might need to change for some panels
    RST_PIN: number = 17
    DC_PIN: number = 25
    CS_PIN: number = 8
    BUSY_PIN: number = 24

    constructor(
        spi: SpiDevice
    ){
        super()
        this.spi = spi
    }

    init(): Promise<void> {

        const restPin = new Gpio(this.RST_PIN, {mode: Gpio.OUTPUT})
        this.pins.set(this.RST_PIN, restPin)

        if (this.useDcPin){
            const dcPin = new Gpio(this.DC_PIN, {mode: Gpio.OUTPUT})
            this.pins.set(this.DC_PIN, dcPin)
        }

        const csPin = new Gpio(this.CS_PIN, {mode: Gpio.OUTPUT})
        this.pins.set(this.CS_PIN, csPin)

        const busyPin = new Gpio(this.BUSY_PIN, {mode: Gpio.INPUT})
        this.pins.set(this.BUSY_PIN, busyPin)

        return new Promise((cb: () => void) => {
            cb()
        })

    }

    async write(
        data: Buffer
    ): Promise<number> {
        
        const message = [{
            sendBuffer: data,
            byteLength: data.byteLength
        }]

        const msg = await this.transfer(message)

        return msg[0].byteLength
        
    }

    async read(
        length: number
    ): Promise<Buffer> {
        
        const message = [{
            sendBuffer: Buffer.alloc(length),
            byteLength: length
        }]

        const msg = await this.transfer(message)

        const buf = msg[0].receiveBuffer

        if (!buf)
            throw Error("SPI read failed")

        return buf

    }

    /**
     * Transfer data to or from a SPI device.
     * 
     * @param message Packet of data describing the transaction which is to occur
     * @returns Promise containing the response from the SPI transaction
     */
    private async transfer(
        message: SpiMessage
    ): Promise<SpiMessage>{

        const { error, msg } = await new Promise((cb: (args: { error: Error | null | undefined, msg: SpiMessage }) => void) => {
            this.spi.transfer(message, (error, msg) => {
                cb({ error, msg })
            })
        })

        if (error)
            throw error

        return msg

    }

    close(): Promise<void> {

        return new Promise((cb: () => void) => {
            this.spi.close((error: Error | null | undefined) => {
                cb()
            })
        })

    }
    
    
}