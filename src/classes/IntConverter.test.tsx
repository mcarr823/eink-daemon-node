/**
 * @jest-environment node
 */

import {expect, test} from '@jest/globals';
import { Uint8, bytesToInt, bytesToIntArray, intToBytes, shortToBytes } from './IntConverter';

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

test("bytesToIntArray", () => {

    var failnum: Array<number> | null = null
    try{
        const buf = Buffer.from([1])
        failnum = bytesToIntArray(buf, true)
    }catch(e){
        //
    }

    // failnum should be null, since [1] isn't a long enough
    // byte array to create any ints and will throw an error.
    expect(failnum).toBeNull()

    const buf = Buffer.from([0, 0, 0, 1, 0, 0, 0, 2])

    const num = bytesToIntArray(buf, true) // big endian, so it's 0001 0002
    const num2 = bytesToIntArray(buf, false) // little endian, so it's 1000 2000

    expect(buf.length).toBe(8)
    expect(buf.byteLength).toBe(8)

    // 1 = 00000000 00000000 00000000 00000001
    // ie. 2^0
    // 2 = 00000000 00000000 00000000 00000010
    // ie. 2^1
    expect(num.length).toBe(2)
    expect(num[0]).toBe(1)
    expect(num[1]).toBe(2)

    // 16777216 = 00000001 00000000 00000000 00000000
    // ie. 2^24
    // 33554432 = 00000010 00000000 00000000 00000000
    // ie. 2^25
    expect(num2.length).toBe(2)
    expect(num2[0]).toBe(16777216)
    expect(num2[1]).toBe(33554432)


    // Same test again, but reversed
    const buf2 = Buffer.from([2, 0, 0, 0, 1, 0, 0, 0])

    const num3 = bytesToIntArray(buf2, true)
    const num4 = bytesToIntArray(buf2, false)

    expect(buf2.length).toBe(8)
    expect(buf2.byteLength).toBe(8)

    expect(num3.length).toBe(2)
    expect(num3[0]).toBe(33554432)
    expect(num3[1]).toBe(16777216)
    expect(num4.length).toBe(2)
    expect(num4[0]).toBe(2)
    expect(num4[1]).toBe(1)

})
