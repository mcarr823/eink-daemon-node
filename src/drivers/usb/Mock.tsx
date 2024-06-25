import Image from "@/classes/Image";
import { BitsPerPixel } from "@/enums/BitsPerPixel";
import IPanelQueryResult from "@/interfaces/IPanelQueryResult";
import { AbstractUsbDriver } from "./AbstractUsbDriver";
import { InEndpoint, OutEndpoint, Device, EndpointDescriptor } from "usb";

export default async function MockUsb(
    bpp: BitsPerPixel = BitsPerPixel.BPP1,
    base_address: number = 0,
    width: number = 0,
    height: number = 0,
    useDcPin: boolean = false
): Promise<USB_Mock> {
    return new USB_Mock(
        bpp,
        base_address,
        width,
        height,
        useDcPin
    )
}

/**
 * Mock USB driver.
 * 
 * This driver doesn't do anything except implement the abstract
 * USB driver methods.
 * 
 * It is intended to be used for unit testing purposes, since actual
 * drivers require the appropriate external hardware and thus can't
 * be tested automatically.
 */
export class USB_Mock extends AbstractUsbDriver{

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
        const device = new Device()
        const desc: EndpointDescriptor = {
            bLength: 0,
            bDescriptorType: 0,
            bEndpointAddress: 0,
            bmAttributes: 0,
            wMaxPacketSize: 0,
            bInterval: 0,
            bRefresh: 0,
            bSynchAddress: 0,
            extra: Buffer.alloc(0)
        }
        const input = new InEndpoint(device, desc)
        const output = new OutEndpoint(device, desc)
        super(input, output, device)
        this.bpp = bpp
        this.base_address = base_address
        this.width = width
        this.height = height
        this.useDcPin = useDcPin
    }

    async init(): Promise<void> {
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
        return {}
    }

}