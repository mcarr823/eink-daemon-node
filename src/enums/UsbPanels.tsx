/**
 * Enum to keep track of the supported e-ink panels with
 * USB input.
 * 
 * This will probably only ever support the IT8951 driver
 * board, since there's been a lack of alternatives.
 * 
 * Any values in here should map to panels in /src/drivers/usb
 */
export enum UsbPanels{
    IT8951 = "IT8951"
}