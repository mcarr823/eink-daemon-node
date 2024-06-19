import { Uint8, intToBytes, shortToBytes } from "./IntConverter";

/**
 * Creates a command to be sent to a panel's memory register
 * over a USB connection.
 * 
 * @param address Memory address (register) at which to start writing
 * @param command The type of command to perform
 * @param length Length of the data to send
 * @returns Buffer with length of 16 bytes
 */
export default function UsbRegisterCommand({
    address,
    command,
    length
} : IUsbRegisterCommandArgs): Buffer {

    const header = Uint8(254)
    const padding1 = Uint8(0)
    const padding2 = new Uint8Array([0,0,0,0,0,0,0])
    const addrBytes = intToBytes(address, true)
    const cmdBytes = Uint8(command)
    const lengthBytes = shortToBytes(length, true)

    return Buffer.concat([
        header,
        padding1,
        addrBytes,
        cmdBytes,
        lengthBytes,
        padding2
    ])

}

interface IUsbRegisterCommandArgs{
    address: number;
    command: number;
    length: number;
}