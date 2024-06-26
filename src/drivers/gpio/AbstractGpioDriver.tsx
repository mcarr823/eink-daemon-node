import IGpioDriver from "@/interfaces/IGpioDriver";
import AbstractDriver from "../AbstractDriver";
import { BitsPerPixel } from "@/enums/BitsPerPixel";
import Image from "@/classes/Image";
import IPanelQueryResult from "@/interfaces/IPanelQueryResult";
import ISpiDevice from "@/interfaces/ISpiDevice";
import ISpiMessage from "@/interfaces/ISpiMessage";
import IGpioPin from "@/interfaces/IGpioPin";
import GpioPinBuilder from "@/classes/GpioPinBuilder";

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
    abstract query(): Promise<IPanelQueryResult>;

    // Abstract properties for this class
    abstract useDcPin: boolean

    // Properties for this class
    pins = new Map<number, IGpioPin>()
    spi: ISpiDevice

    // Common pin numbers
    // These might need to change for some panels
    RST_PIN: number = 17
    DC_PIN: number = 25
    CS_PIN: number = 8
    BUSY_PIN: number = 24

    constructor(
        spi: ISpiDevice
    ){
        super()
        this.spi = spi
    }

    init(): Promise<void> {

        const restPin = GpioPinBuilder(this.RST_PIN, false)
        this.pins.set(this.RST_PIN, restPin)

        if (this.useDcPin){
            const dcPin = GpioPinBuilder(this.DC_PIN, false)
            this.pins.set(this.DC_PIN, dcPin)
        }

        const csPin = GpioPinBuilder(this.CS_PIN, false)
        this.pins.set(this.CS_PIN, csPin)

        const busyPin = GpioPinBuilder(this.BUSY_PIN, true)
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
        message: ISpiMessage[]
    ): Promise<ISpiMessage[]>{

        const { error, msg } = await new Promise((cb: (args: { error: Error | null | undefined, msg: ISpiMessage[] }) => void) => {
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