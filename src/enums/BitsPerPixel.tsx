/**
 * Number of bits required to represent a single pixel.
 * 
 * e-ink panels allow for highly compressed images, since
 * they usually don't support many colors.
 * 
 * eg. 1bpp = 1 bit per pixel
 * 1 bit has 2 values (0 or 1), so 1bpp represents 2
 * colors: white and black.
 * 
 * 2bpp = 2 bits per pixel
 * 2 bits have 4 values (00, 01, 10, 11), so 2bpp
 * represents 4 colors: white, gray1, gray2, black
 * 
 * And so on.
 * For a detailed explanation, see the BytePacker class.
 */
export enum BitsPerPixel{
    BPP1 = 1,
    BPP2 = 2,
    BPP4 = 4,
    BPP8 = 8
}