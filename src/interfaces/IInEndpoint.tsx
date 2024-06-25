/**
 * Interface for defining any USB InEndpoint functions which we want to
 * actually implement.
 * 
 * This is so the USB driver implementation can rely on this class instead
 * of the actual USB endpoint implementation, which isn't available for
 * unit testing.
 */
export default interface IInEndpoint{

    transfer(length: number, callback: (error: Error | undefined, data?: Buffer) => void): any;

}