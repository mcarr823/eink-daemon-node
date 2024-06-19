/**
 * @jest-environment node
 */

import {expect, test} from '@jest/globals';
import UsbCommandStatusWrapper from './UsbCommandStatusWrapper';

test("UsbCommandStatusWrapper fail", () => {

    // 11-length buffer
    const buf = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

    var wrapper: UsbCommandStatusWrapper | null = null

    // Buffer must be 13 or longer, so the initialization
    // should fail
    try{
        wrapper = new UsbCommandStatusWrapper(buf, true)
    }catch(e){
        //
    }

    expect(wrapper).toBe(null)

})

test("UsbCommandStatusWrapper success", () => {

    const buf = Buffer.from([1, 2, 3, 4, 0, 0, 0, 1, 0, 0, 0, 2, 3])

    const wrapper = new UsbCommandStatusWrapper(buf, true)

    expect(wrapper.signature.length).toBe(4)
    expect(wrapper.signature.byteLength).toBe(4)
    expect(wrapper.signature[0]).toBe(1)
    expect(wrapper.signature[1]).toBe(2)
    expect(wrapper.signature[2]).toBe(3)
    expect(wrapper.signature[3]).toBe(4)
    expect(wrapper.tag).toBe(1)
    expect(wrapper.dataResidue).toBe(2)
    expect(wrapper.status).toBe(3)

})