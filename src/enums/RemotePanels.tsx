/**
 * Enum to keep track of the supported e-ink panels supported
 * via remote input.
 * 
 * Any values in here should map to panels in both
 * /src/drivers/gpio and /src/drivers/usb
 * 
 * This is because the remote driver sends data to a secondary
 * device, which then utilizes one of those other direct drivers.
 */

export enum RemotePanels{
    UNSUPPORTED = "Not yet supported"
}