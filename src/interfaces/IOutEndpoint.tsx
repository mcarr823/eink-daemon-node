/**
 * Interface for defining any USB OutEndpoint functions which we want to
 * actually implement.
 * 
 * This is so the USB driver implementation can rely on this class instead
 * of the actual USB endpoint implementation, which isn't available for
 * unit testing.
 */
export default interface IOutEndpoint{
    
    transfer(buffer: Buffer, callback?: (error: Error | undefined, actual: number) => void): any;

}