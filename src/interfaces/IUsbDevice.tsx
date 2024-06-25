/**
 * Interface for defining any USB Device functions which we want to
 * actually implement.
 * 
 * This is so the USB driver implementation can rely on this class instead
 * of the actual USB Device implementation, which isn't available for
 * unit testing.
 */
export default interface IUsbDevice{
    
    close(): void

}