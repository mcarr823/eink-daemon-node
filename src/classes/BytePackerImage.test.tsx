/**
 * @jest-environment node
 */

import { BitsPerPixel } from '@/enums/BitsPerPixel';
import BytePacker from './BytePacker';
import Image from './Image';
import {expect, test} from '@jest/globals';

const width = 100
const height = 100
const pixels = width * height
const packer: BytePacker = new BytePacker()
const image = new Image(width, height)

image.fill("#FFF")
const whiteInput: Buffer = image.asBufferGrayscale()

image.fill("#000")
const blackInput: Buffer = image.asBufferGrayscale()

test("1bpp pack", () => {
    const bpp = BitsPerPixel.BPP1
    const whiteOutput = packer.pack(bpp, whiteInput, false)
    const blackOutput = packer.pack(bpp, blackInput, false)
    const divisor = 8 / bpp

    expect(whiteOutput.length).toBe(pixels / divisor)
    expect(whiteOutput.byteLength).toBe(pixels / divisor)
    expect(blackOutput.length).toBe(pixels / divisor)
    expect(blackOutput.byteLength).toBe(pixels / divisor)

    const allWhite = whiteOutput.every(byte => byte == 255)
    expect(allWhite).toBe(true)

    const allBlack = blackOutput.every(byte => byte == 0)
    expect(allBlack).toBe(true)
})

test("2bpp pack", () => {
    const bpp = BitsPerPixel.BPP2
    const whiteOutput = packer.pack(bpp, whiteInput, false)
    const blackOutput = packer.pack(bpp, blackInput, false)
    const divisor = 8 / bpp

    expect(whiteOutput.length).toBe(pixels / divisor)
    expect(whiteOutput.byteLength).toBe(pixels / divisor)
    expect(blackOutput.length).toBe(pixels / divisor)
    expect(blackOutput.byteLength).toBe(pixels / divisor)

    const allWhite = whiteOutput.every(byte => byte == 255)
    expect(allWhite).toBe(true)

    const allBlack = blackOutput.every(byte => byte == 0)
    expect(allBlack).toBe(true)
})

test("4bpp pack", () => {
    const bpp = BitsPerPixel.BPP4
    const whiteOutput = packer.pack(bpp, whiteInput, false)
    const blackOutput = packer.pack(bpp, blackInput, false)
    const divisor = 8 / bpp

    expect(whiteOutput.length).toBe(pixels / divisor)
    expect(whiteOutput.byteLength).toBe(pixels / divisor)
    expect(blackOutput.length).toBe(pixels / divisor)
    expect(blackOutput.byteLength).toBe(pixels / divisor)

    const allWhite = whiteOutput.every(byte => byte == 255)
    expect(allWhite).toBe(true)

    const allBlack = blackOutput.every(byte => byte == 0)
    expect(allBlack).toBe(true)
})

test("8bpp pack", () => {
    const bpp = BitsPerPixel.BPP8
    const whiteOutput = packer.pack(bpp, whiteInput, false)
    const blackOutput = packer.pack(bpp, blackInput, false)
    const divisor = 8 / bpp

    expect(whiteOutput.length).toBe(pixels / divisor)
    expect(whiteOutput.byteLength).toBe(pixels / divisor)
    expect(blackOutput.length).toBe(pixels / divisor)
    expect(blackOutput.byteLength).toBe(pixels / divisor)

    const allWhite = whiteOutput.every(byte => byte == 255)
    expect(allWhite).toBe(true)

    const allBlack = blackOutput.every(byte => byte == 0)
    expect(allBlack).toBe(true)
})
