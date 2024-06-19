import { Buffer } from "node:buffer";

export default class IntConverter{
    // Empty default class export
    // Doesn't seem like a class will be needed at this time
}

/**
 * Converts a number to a Buffer object
 * 
 * @param x Number to convert to an int array
 * @returns 
 */
export function Uint8(
    x: number
){
    return Buffer.from(new Uint8Array([x]))
}

/**
 * @param x Integer to convert to bytes
 * @param bigEndian If true, use big endian order. If false, little endian.
 * @returns Buffer containing 4 bytes
 */
export function intToBytes(
    x: number,
    bigEndian: boolean
): Buffer {
    const bytes = Buffer.alloc(4)
    if (bigEndian)
        bytes.writeInt32BE(x)
    else
        bytes.writeInt32LE(x)
    return bytes;
}

/**
 * @param x Short to convert to bytes
 * @param bigEndian If true, use big endian order. If false, little endian.
 * @returns Buffer containing 2 bytes
 */
export function shortToBytes(
    x: number,
    bigEndian: boolean
): Buffer {
    const bytes = Buffer.alloc(2)
    if (bigEndian)
        bytes.writeInt16BE(x)
    else
        bytes.writeInt16LE(x)
    return bytes;
}

/**
 * @param x Byte buffer to convert to an int
 * @param bigEndian If true, use big endian order. If false, little endian.
 * @returns Integer
 */
export function bytesToInt(
    x: Buffer,
    bigEndian: boolean
): number {
    if (bigEndian)
        return x.readInt32BE()
    else
        return x.readInt32LE()
}