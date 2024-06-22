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
 * Converts a byte buffer into a single int.
 * 
 * Assumes that the buffer is at least 4 bytes in length.
 * 
 * @param x Byte buffer to convert to a single int
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

/**
 * Converts a byte buffer into an array of ints.
 * 
 * Assumes that the buffer is a multiple of 4 bytes in length.
 * 
 * @param x Byte buffer to convert to an array of ints
 * @param bigEndian If true, use big endian order. If false, little endian.
 * @returns Array of integers
 */
export function bytesToIntArray(
    x: Buffer,
    bigEndian: boolean
): Array<number> {
    
    const length = x.byteLength

    // 32-bit ints have 4 bytes to an int, so perform
    // all calculations henceforth based on a divisor
    // of 4.
    var ints = Array<number>(length / 4)

    for (var i = 0; i * 4 <= length - 4; i += 1){

        // Get a subarray which corresponds to how far
        // through the buffer we are.
        const offset = i * 4
        const sub = x.subarray(offset, offset+4)

        // Read the subarray into an int
        if (bigEndian)
            ints[i] = sub.readInt32BE()
        else
            ints[i] = sub.readInt32LE()

    }
    
    return ints

}