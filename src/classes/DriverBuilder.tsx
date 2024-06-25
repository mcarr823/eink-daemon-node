import MockGpio from "@/drivers/gpio/Mock";
import IT8951Usb from "@/drivers/usb/IT8951";
import MockUsb, { USB_Mock } from "@/drivers/usb/Mock";
import { Drivers } from "@/enums/Drivers";
import { GpioPanels } from "@/enums/GpioPanels";
import { UsbPanels } from "@/enums/UsbPanels";
import IConfig from "@/interfaces/IConfig";
import IDriver from "@/interfaces/IDriver";
import IGpioDriver from "@/interfaces/IGpioDriver";
import IUsbDriver from "@/interfaces/IUsbDriver";

/**
 * Builds and initializes a driver and panel combination based on
 * the configuration arguments passed in.
 * 
 * This class is intended to be the single place from which any
 * panel classes are initialized, so there's a single point of
 * entry for all panel initialization logic.
 * 
 * @param config IConfig object describing which driver and panel to initialize
 * @returns Promise for a particular panel and driver combination
 */
export default async function DriverBuilder(
    config: IConfig
): Promise<IDriver> {

    var panel: IDriver

    if (config.driver == Drivers.USB){
        panel = await UsbDriverBuilder(config);
    }else if (config.driver == Drivers.GPIO){
        panel = await GpioDriverBuilder(config);
    }else{
        throw new Error("Unknown driver type");
    }

    await panel.init()

    return panel

}

function UsbDriverBuilder(
    config: IConfig
): Promise<IUsbDriver> {

    if (config.panel == UsbPanels.IT8951){
        return IT8951Usb()
    }else if (config.panel == UsbPanels.MOCK){
        return MockUsb()
    }

    throw new Error("Unknown USB panel type");

}

function GpioDriverBuilder(
    config: IConfig
): Promise<IGpioDriver> {

    if (config.panel == GpioPanels.MOCK){
        return MockGpio()
    }

    throw new Error("Unknown GPIO panel type");

}