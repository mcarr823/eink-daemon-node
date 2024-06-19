/**
 * @jest-environment node
 */

import {expect, test} from '@jest/globals';
import UsbRegisterCommand from './UsbRegisterCommand';

test("UsbRegisterCommand", () => {
    const buf = UsbRegisterCommand({
        address: 100,
        command: 150,
        length: 10
    })

    // Length should always be 16
    expect(buf.length).toBe(16)
    expect(buf.byteLength).toBe(16)

    // Header
    expect(buf[0]).toBe(254)

    // Padding 1
    expect(buf[1]).toBe(0)

    // Address
    expect(buf[2]).toBe(0)
    expect(buf[3]).toBe(0)
    expect(buf[4]).toBe(0)
    expect(buf[5]).toBe(100)

    // Command
    expect(buf[6]).toBe(150)

    // Length
    expect(buf[7]).toBe(0)
    expect(buf[8]).toBe(10)

    // Padding 2
    expect(buf[9]).toBe(0)
    expect(buf[10]).toBe(0)
    expect(buf[11]).toBe(0)
    expect(buf[12]).toBe(0)
    expect(buf[13]).toBe(0)
    expect(buf[14]).toBe(0)
    expect(buf[15]).toBe(0)
})