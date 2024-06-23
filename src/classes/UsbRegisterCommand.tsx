import { Uint8, intToBytes } from "./IntConverter";

/**
 * Creates a command to be sent to a panel's memory register
 * over a USB connection.
 * 
 * @param address Memory address (register) at which to start writing
 * @param command The type of command to perform
 * @param value Value to write to the register. 9 bytes max
 * @returns Buffer with length of 16 bytes
 */
export default function UsbRegisterCommand({
    address,
    command,
    value
} : IUsbRegisterCommandArgs): Buffer {

    const header = Uint8(254)
    const padding = Uint8(0)
    const addrBytes = intToBytes(address, true)
    const cmdBytes = Uint8(command)

    // Pad the value to 9 bytes
    const valueBytes = Buffer.alloc(9)
    value.copy(valueBytes)

    return Buffer.concat([
        header,
        padding,
        addrBytes,
        cmdBytes,
        valueBytes
    ])

}

interface IUsbRegisterCommandArgs{
    address: number;
    command: number;
    value: Buffer;
}