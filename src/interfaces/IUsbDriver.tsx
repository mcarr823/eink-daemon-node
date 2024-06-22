import { Buffer } from "node:buffer";
import IDriver from "./IDriver";

/**
 * Interface from which any USB-connected panel driver
 * implementations should inherit.
 */
export default interface IUsbDriver extends IDriver {

    // The vendor and product IDs are what identify a specific
    // USB device.
    // You can find these by using the `lsusb` program.
    // Expected output of that program is something like:
    // Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
    // Where `1d6b` is the vendor ID and `0002` is the product ID.
    vendorId: string;
    productId: string;

    // The base memory address after which register commands can be run.
    // ie. Register commands run at base_address + VALUE.
    base_address: number;

    // Commands for reading from and writing to the panel registers
    read_register(address: number, length: number): Buffer
    write_register(address: number, data: Buffer): void
    write_register_fast(address: number, data: Buffer): void

}