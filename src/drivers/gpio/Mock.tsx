import Image from "@/classes/Image";
import { BitsPerPixel } from "@/enums/BitsPerPixel";
import IPanelQueryResult from "@/interfaces/IPanelQueryResult";
import { AbstractGpioDriver } from "./AbstractGpioDriver";
import MockSpiDevice from "@/classes/mock/MockSpiDevice";

export default async function MockGpio(
    bpp: BitsPerPixel = BitsPerPixel.BPP1,
    base_address: number = 0,
    width: number = 0,
    height: number = 0,
    useDcPin: boolean = false
){
    return new GPIO_Mock(
        bpp,
        base_address,
        width,
        height,
        useDcPin
    )
}

/**
 * Mock GPIO driver.
 * 
 * This driver doesn't do anything except implement the abstract
 * GPIO driver methods.
 * 
 * It is intended to be used for unit testing purposes, since actual
 * drivers require the appropriate external hardware and thus can't
 * be tested automatically.
 */
export class GPIO_Mock extends AbstractGpioDriver{

    bpp: BitsPerPixel;
    base_address: number;
    width: number;
    height: number;
    useDcPin: boolean;

    constructor(
        bpp: BitsPerPixel,
        base_address: number,
        width: number,
        height: number,
        useDcPin: boolean
    ){
        super(new MockSpiDevice())
        this.bpp = bpp
        this.base_address = base_address
        this.width = width
        this.height = height
        this.useDcPin = useDcPin
    }

    async waitUntilGpioPinReady(): Promise<void> {
        return this.delay_ms(100)
    }
    
    async read_register(address: number, length: number): Promise<Buffer> {
        return Buffer.alloc(length)
    }
    
    async write_register(address: number, data: Buffer): Promise<void> {
        return this.delay_ms(100)
    }
    
    async write_register_fast(address: number, data: Buffer): Promise<void> {
        return this.delay_ms(100)
    }
    
    async waitUntilPanelReady(): Promise<void> {
        return this.delay_ms(100)
    }
    
    async draw(x: number, y: number, image: Image, displayModeOverride: number, refreshAfter: boolean): Promise<void> {
        return this.delay_ms(100)
    }
    
    async clear(): Promise<void> {
        return this.delay_ms(100)
    }
    
    async query(): Promise<IPanelQueryResult> {
        return {
            vcom: 2000
        }
    }

}