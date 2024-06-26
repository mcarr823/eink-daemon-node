import { openSync } from "spi-device";

/**
 * Connects asynchronously to a given GPIO device.
 * 
 * @param spi_bus_no BUS on which SPI is running
 * @param spi_dev_no Device on which SPI is running
 * @returns Promise with the SPI device
 */
export default async function SpiDeviceBuilder({
    spi_bus_no = 0,
    spi_dev_no = 0
} : {
    spi_bus_no: number;
    spi_dev_no: number;
}){

    // SpiDev init must come first, otherwise CS_PIN read conflicts
    // will sometimes occur during startup.
    const spi = openSync(spi_bus_no, spi_dev_no, {
        maxSpeedHz: 2000000, // 2MHz
        noChipSelect: true
    })

    return spi

}