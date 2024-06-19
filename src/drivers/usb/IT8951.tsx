import UsbRegisterCommand from "@/classes/UsbRegisterCommand";
import AbstractUsbDriver from "./AbstractUsbDriver";
import { IT8951UsbRegisterCommands } from "@/enums/IT8951UsbRegisterCommands";

export default class USB_IT8951 extends AbstractUsbDriver {

    vendorId: string = "048d";
    productId: string = "8951";

    read_register(address: number, length: number): Buffer {
        const cmd = UsbRegisterCommand({
            address,
            command: IT8951UsbRegisterCommands.READ,
            length
        })
        return this.read_command(cmd, length, false)
    }

    write_register(address: number, data: Buffer): void {
        const length = data.byteLength
        const cmd = UsbRegisterCommand({
            address,
            command: IT8951UsbRegisterCommands.WRITE,
            length
        })
        return this.write_command(cmd, data, new Uint8Array(0), false)
    }
    
}