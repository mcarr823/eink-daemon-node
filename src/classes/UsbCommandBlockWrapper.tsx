import { Buffer } from "node:buffer";
import { intToBytes } from "./IntConverter"

/**
 * This is a data structure used for sending and receiving data
 * over a USB connection.
 * 
 * @param signature 
 * @param tag 
 * @param data_transfer_length 
 * @param flags 
 * @param logical_unit_number 
 * @param command_length 
 * @param command_data 
 * @param bigEndian 
 * @returns Buffer of bytes (Uint8)
 */
export default function UsbCommandBlockWrapper({
    signature,
    tag,
    data_transfer_length,
    flags,
    logical_unit_number,
    command_length,
    command_data,
    bigEndian
} : ICbwArgs): Buffer {

    const tagBytes = intToBytes(tag, bigEndian)
    const dataTransferLengthBytes = intToBytes(data_transfer_length, bigEndian)

    return Buffer.concat([
        signature,
        tagBytes,
        dataTransferLengthBytes,
        flags,
        logical_unit_number,
        command_length,
        command_data
    ])

}

interface ICbwArgs{
    signature: Buffer;
    tag: number;
    data_transfer_length: number;
    flags: Buffer;
    logical_unit_number: Buffer;
    command_length: Buffer;
    command_data: Buffer;
    bigEndian: boolean;
}