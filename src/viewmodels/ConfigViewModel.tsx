import { Drivers } from "@/enums/Drivers"
import { GpioPanels } from "@/enums/GpioPanels"
import { UsbPanels } from "@/enums/UsbPanels"
import IConfig from "@/interfaces/IConfig"
import { INextResponseSuccess } from "@/network/NextResponseSuccess"
import { useEffect, useState } from "react"

/**
 * Viewmodel for an IConfig object.
 * 
 * Responsible for providing configuration options to the screen
 * for the user to select, and enables facilitates the changing
 * of those configuration options.
 * 
 * @returns IConfig interface viewmodel
 */
export default function ConfigViewModel() : IConfigViewModel{

    const drivers = Object.values(Drivers)

    // Config variables
    const [driver, setDriver] = useState<string>(Drivers.USB.toString())
    const [panel, setPanel] = useState(UsbPanels.IT8951.toString())
    const [remote, setRemote] = useState<boolean>(false)
    const [host, setHost] = useState("")
    const [port, setPort] = useState(0)

    // State variables
    const [panels, setPanels] = useState<Array<string>>([])
    const [loading, setLoading] = useState<boolean>(true)

    // Create a Config object from the values currently held
    // by this viewmodel
    const exportConfig = (): IConfig => {
        return {
            driver,
            panel,
            remote,
            host,
            port
        }
    }

    // Load a config object into the viewmodel
    const importConfig = (config: IConfig) => {
        setDriver(config.driver)
        setPanel(config.panel)
        setRemote(config.remote)
        setHost(config.host)
        setPort(config.port)
    }

    // Whenever the panels variable changes, reset the panel
    // variable to whatever the first option is.
    useEffect(() => {
        setPanel(panels[0])
    }, [panels])

    // When the user selects a driver, change the available
    // panels to match the driver selection.
    useEffect(() => {
        const usbPanels = Object.values(UsbPanels)
        const gpioPanels = Object.values(GpioPanels)
        if (driver === Drivers.USB)
            setPanels(usbPanels)
        else
            setPanels(gpioPanels)
    }, [driver])

    // When the viewmodel first loads, fetch the config from the server
    useEffect(() => {
        if (loading){
            fetch('/api/config')
                .then((res) => res.json())
                .then((res: INextResponseSuccess) => {
                    const data = res.data as IConfig
                    importConfig(data)
                    setLoading(false)
                })
        }
    }, [loading])

    return {
        drivers,
        panels,
        driver, setDriver,
        panel, setPanel,
        remote, setRemote,
        host, setHost,
        port, setPort,
        exportConfig
    }

}

interface IConfigViewModel{
    drivers: Array<string>;
    panels: Array<string>;
    driver: string;
    setDriver: (value: string) => void;
    panel: string;
    setPanel: (value: string) => void;
    remote: boolean;
    setRemote: (value: boolean) => void;
    host: string;
    setHost: (value: string) => void;
    port: number;
    setPort: (value: number) => void;
    exportConfig: () => IConfig;
}