/**
 * @jest-environment node
 */

import { BitsPerPixel } from '@/enums/BitsPerPixel';
import BytePacker from './BytePacker';
import {expect, test} from '@jest/globals';

const packer = new BytePacker()

test("1bpp pack", () => {
    const bpp = BitsPerPixel.BPP1
    const input = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 20, 30, 50, 80, 100, 100, 100, 100])
    const output = packer.pack(bpp, input, false)
    const outputWordFlip = packer.pack(bpp, input, true)

    expect(output.length).toBe(2)
    expect(output.byteLength).toBe(2)
    expect(output[0]).toBe(0)
    expect(output[1]).toBe(255)

    expect(outputWordFlip.length).toBe(2)
    expect(outputWordFlip.byteLength).toBe(2)
    expect(outputWordFlip[0]).toBe(255)
    expect(outputWordFlip[1]).toBe(0)
})

test("2bpp pack", () => {
    const bpp = BitsPerPixel.BPP2
    const input = Buffer.from([0, 0, 0, 0, 20, 30, 50, 80, 0, 0, 0, 0, 100, 100, 100, 100])
    const output = packer.pack(bpp, input, false)
    const outputWordFlip = packer.pack(bpp, input, true)

    expect(output.length).toBe(4)
    expect(output.byteLength).toBe(4)
    expect(output[0]).toBe(0)
    expect(output[1]).toBe(255)
    expect(output[2]).toBe(0)
    expect(output[3]).toBe(255)

    expect(outputWordFlip.length).toBe(4)
    expect(outputWordFlip.byteLength).toBe(4)
    expect(outputWordFlip[0]).toBe(255)
    expect(outputWordFlip[1]).toBe(0)
    expect(outputWordFlip[2]).toBe(255)
    expect(outputWordFlip[3]).toBe(0)
})

test("4bpp pack", () => {
    const bpp = BitsPerPixel.BPP4
    const input = Buffer.from([0, 0, 20, 30, 0, 0, 50, 80, 0, 0, 100, 100, 0, 0, 100, 100])
    const output = packer.pack(bpp, input, false)
    const outputWordFlip = packer.pack(bpp, input, true)

    expect(output.length).toBe(8)
    expect(output.byteLength).toBe(8)
    expect(output[0]).toBe(0)
    expect(output[1]).toBe(255)
    expect(output[2]).toBe(0)
    expect(output[3]).toBe(255)
    expect(output[4]).toBe(0)
    expect(output[5]).toBe(255)
    expect(output[6]).toBe(0)
    expect(output[7]).toBe(255)

    expect(outputWordFlip.length).toBe(8)
    expect(outputWordFlip.byteLength).toBe(8)
    expect(outputWordFlip[0]).toBe(255)
    expect(outputWordFlip[1]).toBe(0)
    expect(outputWordFlip[2]).toBe(255)
    expect(outputWordFlip[3]).toBe(0)
    expect(outputWordFlip[4]).toBe(255)
    expect(outputWordFlip[5]).toBe(0)
    expect(outputWordFlip[6]).toBe(255)
    expect(outputWordFlip[7]).toBe(0)
})

test("8bpp pack", () => {
    const bpp = BitsPerPixel.BPP8
    const input = Buffer.from([0, 20, 0, 30, 0, 50, 0, 80, 0, 100, 0, 100, 0, 100, 0, 100])
    const output = packer.pack(bpp, input, false)
    const outputWordFlip = packer.pack(bpp, input, true)

    expect(output.length).toBe(16)
    expect(output.byteLength).toBe(16)
    expect(output[0]).toBe(0)
    expect(output[1]).toBe(255)
    expect(output[2]).toBe(0)
    expect(output[3]).toBe(255)
    expect(output[4]).toBe(0)
    expect(output[5]).toBe(255)
    expect(output[6]).toBe(0)
    expect(output[7]).toBe(255)
    expect(output[8]).toBe(0)
    expect(output[9]).toBe(255)
    expect(output[10]).toBe(0)
    expect(output[11]).toBe(255)
    expect(output[12]).toBe(0)
    expect(output[13]).toBe(255)
    expect(output[14]).toBe(0)
    expect(output[15]).toBe(255)

    expect(outputWordFlip.length).toBe(16)
    expect(outputWordFlip.byteLength).toBe(16)
    expect(outputWordFlip[0]).toBe(255)
    expect(outputWordFlip[1]).toBe(0)
    expect(outputWordFlip[2]).toBe(255)
    expect(outputWordFlip[3]).toBe(0)
    expect(outputWordFlip[4]).toBe(255)
    expect(outputWordFlip[5]).toBe(0)
    expect(outputWordFlip[6]).toBe(255)
    expect(outputWordFlip[7]).toBe(0)
    expect(outputWordFlip[8]).toBe(255)
    expect(outputWordFlip[9]).toBe(0)
    expect(outputWordFlip[10]).toBe(255)
    expect(outputWordFlip[11]).toBe(0)
    expect(outputWordFlip[12]).toBe(255)
    expect(outputWordFlip[13]).toBe(0)
    expect(outputWordFlip[14]).toBe(255)
    expect(outputWordFlip[15]).toBe(0)
})