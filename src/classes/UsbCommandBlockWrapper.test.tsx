/**
 * @jest-environment node
 */

import {expect, test} from '@jest/globals';
import { Uint8 } from './IntConverter';
import UsbCommandBlockWrapper from './UsbCommandBlockWrapper';

test("UsbCommandBlockWrapper", () => {

    const incoming = true
    const flags = Uint8(incoming ? 128 : 0)
    const tag = 1
    const signature = Buffer.from([85, 83, 66, 67])
    const data_transfer_length = 1
    const logical_unit_number = Uint8(0)
    const command_length = Uint8(0)
    const command_data = Buffer.alloc(0)
    const bigEndian = true
    const wrapper = UsbCommandBlockWrapper({
        signature,
        tag,
        data_transfer_length,
        command_length,
        command_data,
        bigEndian,
        flags,
        logical_unit_number
    })

    expect(wrapper.length).toBe(15 + command_data.length)
    expect(wrapper.byteLength).toBe(15 + command_data.length)

    // Signature
    expect(wrapper[0]).toBe(signature[0])
    expect(wrapper[1]).toBe(signature[1])
    expect(wrapper[2]).toBe(signature[2])
    expect(wrapper[3]).toBe(signature[3])

    // Tag
    expect(wrapper[4]).toBe(0)
    expect(wrapper[5]).toBe(0)
    expect(wrapper[6]).toBe(0)
    expect(wrapper[7]).toBe(1)
    
    // Data transfer length
    expect(wrapper[8]).toBe(0)
    expect(wrapper[9]).toBe(0)
    expect(wrapper[10]).toBe(0)
    expect(wrapper[11]).toBe(1)

    // Flags
    expect(wrapper[12]).toBe(128)

    // Logical unit number
    expect(wrapper[13]).toBe(0)

    // Command length
    expect(wrapper[14]).toBe(0)

    // ...Don't check command data, since it's 0-length
})