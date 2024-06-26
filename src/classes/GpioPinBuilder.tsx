import IGpioPin from "@/interfaces/IGpioPin";
import MockGpioPin from "./mock/MockGpioPin";

/**
 * Creates an object compatible with the IGpioPin interface.
 * 
 * This can be either a real GPIO pin or a fake API-compatible one.
 * 
 * @param pin Number of the pin to bind
 * @param input If true, we want to read FROM the pin. If false, we want to write TO the pin.
 * @returns IGpioPin interface compatible object
 */
export default function GpioPinBuilder(
    pin: number,
    input: boolean
): IGpioPin{
    try{
        const { Gpio } = require("pigpio")
        const mode = input ? Gpio.INPUT : Gpio.OUTPUT
        return new Gpio(pin, { mode })
    }catch(e){
        return new MockGpioPin()
    }
    
}