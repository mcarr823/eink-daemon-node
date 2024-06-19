/**
 * @jest-environment node
 */

import {expect, test} from '@jest/globals';
import { Uint8, bytesToInt, intToBytes, shortToBytes } from './IntConverter';

test("Uint8", () => {

    const num = 1
    const buf = Uint8(num)

    expect(buf.length).toBe(1)
    expect(buf.byteLength).toBe(1)
    expect(buf[0]).toBe(1)

    const num2 = 100
    const buf2 = Uint8(num2)

    expect(buf2.length).toBe(1)
    expect(buf2.byteLength).toBe(1)
    expect(buf2[0]).toBe(100)

})

test("intToBytes", () => {

    const num = 1
    const buf = intToBytes(num, true)

    expect(buf.length).toBe(4)
    expect(buf.byteLength).toBe(4)
    expect(buf[0]).toBe(0)
    expect(buf[1]).toBe(0)
    expect(buf[2]).toBe(0)
    expect(buf[3]).toBe(1)

    const buf2 = intToBytes(num, false)

    expect(buf2.length).toBe(4)
    expect(buf2.byteLength).toBe(4)
    expect(buf2[0]).toBe(1)
    expect(buf2[1]).toBe(0)
    expect(buf2[2]).toBe(0)
    expect(buf2[3]).toBe(0)

})

test("shortToBytes", () => {

    const num = 1
    const buf = shortToBytes(num, true)

    expect(buf.length).toBe(2)
    expect(buf.byteLength).toBe(2)
    expect(buf[0]).toBe(0)
    expect(buf[1]).toBe(1)

    const buf2 = shortToBytes(num, false)

    expect(buf2.length).toBe(2)
    expect(buf2.byteLength).toBe(2)
    expect(buf2[0]).toBe(1)
    expect(buf2[1]).toBe(0)

})

test("bytesToInt", () => {

    var failnum: number | null = null
    try{
        const buf = Buffer.from([1])
        failnum = bytesToInt(buf, true)
    }catch(e){
        //
    }
    expect(failnum).toBeNull()

    const buf = Buffer.from([0, 0, 0, 1])

    const num = bytesToInt(buf, true) // big endian, so it's 0001
    const num2 = bytesToInt(buf, false) // little endian, so it's 1000

    expect(buf.length).toBe(4)
    expect(buf.byteLength).toBe(4)

    // 1 = 00000000 00000000 00000000 00000001
    // ie. 2^0
    expect(num).toBe(1)

    // 16777216 = 00000001 00000000 00000000 00000000
    // ie. 2^24
    expect(num2).toBe(16777216)


    // Same test again, but reversed
    const buf2 = Buffer.from([1, 0, 0, 0])

    const num3 = bytesToInt(buf2, true)
    const num4 = bytesToInt(buf2, false)

    expect(buf2.length).toBe(4)
    expect(buf2.byteLength).toBe(4)

    expect(num3).toBe(16777216)
    expect(num4).toBe(1)

})