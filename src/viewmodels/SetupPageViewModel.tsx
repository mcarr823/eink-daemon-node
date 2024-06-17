import { Drivers } from "@/enums/Drivers"
import { GpioPanels } from "@/enums/GpioPanels"
import { RemotePanels } from "@/enums/RemotePanels"
import { UsbPanels } from "@/enums/UsbPanels"
import IConfig from "@/interfaces/IConfig"
import { INextResponseSuccess } from "@/network/NextResponseSuccess"
import { useEffect, useState } from "react"

/**
 * Viewmodel for the setup screen.
 * 
 * Responsible for providing configuration options to the screen
 * for the user to select, and enables facilitates the saving
 * of those configuration options.
 * 
 * @returns Setup screen's viewmodel
 */
export default function SetupPageViewModel() : ISetupPageViewModel{

    const drivers = [Drivers.USB, Drivers.GPIO, Drivers.REMOTE]
    const usbPanels = [UsbPanels.IT8951]
    const gpioPanels = [GpioPanels.UNSUPPORTED]
    const remotePanels = [RemotePanels.UNSUPPORTED]

    const [driver, setDriver] = useState<string>(Drivers.USB.toString())
    const [panel, setPanel] = useState(UsbPanels.IT8951.toString())
    const [host, setHost] = useState("")
    const [port, setPort] = useState(0)
    const [panels, setPanels] = useState<Array<string>>([])
    const [saving, setSaving] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)

    // Whenever the panels variable changes, reset the panel
    // variable to whatever the first option is.
    useEffect(() => {
        setPanel(panels[0])
    }, [panels])

    // When the user selects a driver, change the available
    // panels to match the driver selection.
    useEffect(() => {
        if (driver === Drivers.USB.toString())
            setPanels(usbPanels)
        else if (driver === Drivers.REMOTE.toString())
            setPanels(remotePanels)
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
                    setDriver(data.driver)
                    setPanel(data.panel)
                    setHost(data.host)
                    setPort(data.port)
                    setLoading(false)
                })
        }
    }, [loading])

    // Function for saving the user's configs to disk
    const save = (callback: (data: JSON) => void) => {
        setSaving(true)
        const config: IConfig = {
            panel,
            driver,
            host,
            port
        }
        fetch('/api/config', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(config),
        })
            .then((res) => res.json())
            .then((data: JSON) => {
                setSaving(false)
                callback(data)
            })
    }

    return {
        drivers,
        panels,
        driver, setDriver,
        panel, setPanel,
        host, setHost,
        port, setPort,
        saving, save
    }

}

interface ISetupPageViewModel{
    drivers: Array<string>;
    panels: Array<string>;
    driver: string;
    setDriver: (value: string) => void;
    panel: string;
    setPanel: (value: string) => void;
    host: string;
    setHost: (value: string) => void;
    port: number;
    setPort: (value: number) => void;
    saving: boolean;
    save: (callback: (data: JSON) => void) => void;
}