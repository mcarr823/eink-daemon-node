import IConfig from "@/interfaces/IConfig"
import { useState } from "react"

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
    
    const [saving, setSaving] = useState<boolean>(false)

    // Function for saving the user's configs to disk
    const save = (
        config: IConfig,
        callback: (data: JSON) => void
    ) => {
        setSaving(true)
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
        saving, save
    }

}

interface ISetupPageViewModel{
    saving: boolean;
    save: (config: IConfig,callback: (data: JSON) => void) => void;
}