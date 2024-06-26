import IInEndpoint from "@/interfaces/IInEndpoint";
import IOutEndpoint from "@/interfaces/IOutEndpoint";
import IUsbDevice from "@/interfaces/IUsbDevice";
import MockUsbInEndpoint from "./mock/MockUsbInEndpoint";
import MockUsbOutEndpoint from "./mock/MockUsbOutEndpoint";
import MockUsbDevice from "./mock/MockUsbDevice";

/**
 * Connects asynchronously to a given USB device.
 * 
 * The vendor and product IDs are what identify a specific
 * USB device.
 * You can find these by using the `lsusb` program.
 * Expected output of that program is something like:
 * Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
 * Where `1d6b` is the vendor ID and `0002` is the product ID.
 * 
 * @param vendorId Number representing vendor identifier
 * @param productId Number representing product identifier
 * @param device_interface_number Which USB interface to access
 * @param endpoint_in_number Which endpoint of the USB interface provides input
 * @param endpoint_out_number Which endpoint of the USB interface provides output
 * @returns Promise with the open input and output endpoints
 */
export default async function UsbDeviceBuilder({
    vendorId,
    productId,
    device_interface_number,
    endpoint_in_number,
    endpoint_out_number
} : {
    vendorId: number;
    productId: number;
    device_interface_number: number;
    endpoint_in_number: number;
    endpoint_out_number: number;
}): Promise<{
    endpoint_in: IInEndpoint;
    endpoint_out: IOutEndpoint;
    device: IUsbDevice;
}>{
    
    try{
        const { usb, findByIds, InEndpoint, OutEndpoint, LibUSBException } = require('usb');

        const device = findByIds(vendorId, productId)
        if (!device){
            throw Error("Failed to find device")
        }

        device.open(true)

        const error = await new Promise((cb: (error: typeof LibUSBException | undefined) => void) => device.reset(cb))
        if (error){
            throw error
        }

        if (device.__isKernelDriverActive(device_interface_number)){
            device.__detachKernelDriver(device_interface_number)
        }

        const intf = device.interface(device_interface_number)
        const inEndpoint = intf.endpoint(endpoint_in_number)
        const outEndpoint = intf.endpoint(endpoint_out_number)

        if (!inEndpoint || !outEndpoint){
            throw Error("Failed to setup endpoints")
        }else if (inEndpoint !instanceof InEndpoint){
            throw Error("Failed to setup input endpoint")
        }else if (outEndpoint !instanceof OutEndpoint){
            throw Error("Failed to setup output endpoint")
        }

        const endpoint_in = inEndpoint as IInEndpoint
        const endpoint_out = outEndpoint as IOutEndpoint

        return {
            endpoint_in,
            endpoint_out,
            device
        }
    }catch(e){
        return {
            endpoint_in: new MockUsbInEndpoint(),
            endpoint_out: new MockUsbOutEndpoint(),
            device: new MockUsbDevice()
        }
    }

}