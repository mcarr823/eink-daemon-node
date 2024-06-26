/**
 * Interface made to mimic the Gpio class from pigpio.
 * 
 * This is so classes can rely on this interface instead of the
 * actual class, because the actual class requires pigpio to be
 * installed and running on the device.
 */
export default interface IGpioPin{
    //
}