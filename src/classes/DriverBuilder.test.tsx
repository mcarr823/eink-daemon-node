/**
 * @jest-environment node
 */

import {expect, test} from '@jest/globals';
import IConfig from '@/interfaces/IConfig';
import DriverBuilder from './DriverBuilder';
import { Drivers } from '@/enums/Drivers';
import { UsbPanels } from '@/enums/UsbPanels';
import { USB_Mock } from '@/drivers/usb/Mock';

// Try creating and initializing a mock usb panel
test("Mock USB driver init", async () => {

    const config: IConfig = {
        driver: Drivers.USB,
        panel: UsbPanels.MOCK,
        remote: false,
        host: "",
        port: 0
    }
    const panel = await DriverBuilder(config)

    expect(panel).toBeInstanceOf(USB_Mock)

})