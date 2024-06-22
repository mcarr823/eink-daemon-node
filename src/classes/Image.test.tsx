/**
 * @jest-environment node
 */

import Image from './Image';
import {expect, test} from '@jest/globals';

// Fill the canvas with a color, then export it to a buffer
// and confirm the color/length of the result.
test("Canvas fill color", () => {

    const width = 100
    const height = 100
    
    const img = new Image(width, height)
    img.fill("#FFF")
    const whiteImage = img.asBufferColor()

    // Expected length is the number of pixels (width x height)
    // multiplied by the number of bytes per pixel.
    // The current image library encodes images in
    // 32bpp (32 bits per pixel, ie. 4 bytes per pixel).
    // So the number of bytes is width x height x 4
    const numPixels = width * height
    const bytesPerPixel = 4
    const expectedBufferLength = numPixels * bytesPerPixel

    expect(whiteImage.length).toBe(expectedBufferLength)
    expect(whiteImage.byteLength).toBe(expectedBufferLength)
    
    // Check bytes one by one to confirm that they're all white
    const allWhite = whiteImage.every(byte => byte == 255)
    expect(allWhite).toBe(true)

    // Paint the image black and run the tests again
    img.fill("#000")
    const blackImage = img.asBufferColor()

    expect(blackImage.length).toBe(expectedBufferLength)
    expect(blackImage.byteLength).toBe(expectedBufferLength)
    
    // Check bytes one by one to confirm that they're all black.
    // However, every 4th byte should be 255.
    // This is because the 4th byte in a 32bpp image is the alpha
    // channel, and a value of 255 there means it's opaque.
    // So we're expecting [0, 0, 0, 255] for every black 32bpp pixel.
    const allBlack = blackImage.every((byte, index) => {
        if (index % 4 == 3)
            return byte == 255
        else
            return byte == 0
    })
    expect(allBlack).toBe(true)
})


// Same test, but in grayscale
test("Canvas fill grayscale", () => {

    const width = 100
    const height = 100
    
    const img = new Image(width, height)
    img.fill("#FFF")
    const whiteImage = img.asBufferGrayscale()

    // Expected length is the number of pixels (width x height)
    // multiplied by the number of bytes per pixel.
    // In grayscale mode it's 8bpp (1 byte per pixel)
    const numPixels = width * height
    const bytesPerPixel = 1
    const expectedBufferLength = numPixels * bytesPerPixel

    expect(whiteImage.length).toBe(expectedBufferLength)
    expect(whiteImage.byteLength).toBe(expectedBufferLength)
    
    // Check bytes one by one to confirm that they're all white
    const allWhite = whiteImage.every(byte => byte == 255)
    expect(allWhite).toBe(true)

    // Paint the image black and run the tests again
    img.fill("#000")
    const blackImage = img.asBufferGrayscale()

    expect(blackImage.length).toBe(expectedBufferLength)
    expect(blackImage.byteLength).toBe(expectedBufferLength)
    
    // Check bytes one by one to confirm that they're all black.
    // Unlike the other test, we don't need to check every 4th pixel
    // for a value of 255, since there's no alpha channel.
    const allBlack = blackImage.every(byte => byte == 0)
    expect(allBlack).toBe(true)
})