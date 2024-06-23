import { Buffer } from "node:buffer";
import IDriver from "./IDriver";

/**
 * Interface from which any USB-connected panel driver
 * implementations should inherit.
 */
export default interface IUsbDriver extends IDriver {

    // The base memory address after which register commands can be run.
    // ie. Register commands run at base_address + VALUE.
    base_address: number;

    // Commands for reading from and writing to the panel registers
    read_register(address: number, length: number): Promise<Buffer>
    write_register(address: number, data: Buffer): Promise<void>
    write_register_fast(address: number, data: Buffer): Promise<void>

}