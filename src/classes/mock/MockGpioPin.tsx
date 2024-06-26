import IGpioPin from "@/interfaces/IGpioPin";

/**
 * Mock GPIO pin.
 * 
 * This presents a fake GPIO pin for testing purposes,
 * since only certain devices (eg. the raspberry pi)
 * actually have GPIO pins.
 */
export default class MockGpioPin implements IGpioPin{
    //
}