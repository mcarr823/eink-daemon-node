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

    const usbDriver = "USB"
    const gpioDriver = "GPIO"
    const drivers = [usbDriver, gpioDriver]
    const IT8951Panel = "IT8951"
    const usbPanels = [IT8951Panel]
    const gpioPanels = ['Not yet supported']

    const [driver, setDriver] = useState(usbDriver)
    const [panel, setPanel] = useState(IT8951Panel)
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
        if (driver === usbDriver)
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
                    setDriver(data.driver)
                    setPanel(data.panel)
                    setLoading(false)
                })
        }
    }, [loading])

    // Function for saving the user's configs to disk
    const save = () => {
        setSaving(true)
        //TODO perform ajax request
        setSaving(false)
    }

    return {
        drivers,
        panels,
        driver, setDriver,
        setPanel,
        saving, save
    }

}

interface ISetupPageViewModel{
    drivers: Array<string>;
    panels: Array<string>;
    driver: string;
    setDriver: (value: string) => void;
    setPanel: (value: string) => void;
    saving: boolean;
    save: () => void;
}