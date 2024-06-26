import IConfig from "@/interfaces/IConfig"
import { useEffect, useState } from "react"

/**
 * Viewmodel for the panel query screen.
 * 
 * @returns Panel query screen's viewmodel
 */
export default function QueryPageViewModel() : IQueryPageViewModel{

    const USE_DAEMON = "Use Daemon Setup"
    const configs = [
        USE_DAEMON,
        "Specify Manually"
    ]

    const [selectedConfig, setSelectedConfig] = useState<string>(USE_DAEMON)
    const [queryInProgress, setQueryInProgress] = useState<boolean>(false)
    const [showConnectionDetails, setShowConnectionDetails] = useState<boolean>(false)

    // Whenever the panels variable changes, reset the panel
    // variable to whatever the first option is.
    useEffect(() => {
        const show = selectedConfig !== USE_DAEMON
        setShowConnectionDetails(show)
    }, [selectedConfig])

    const query = (
        config: IConfig,
        callback: (data: JSON) => void
    ) => {

        setQueryInProgress(true)

        fetch('/api/query', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(config),
        })
            .then((res) => res.json())
            .then((data: JSON) => {
                setQueryInProgress(false)
                callback(data)
            })

    }

    return {
        showConnectionDetails,
        query,
        configs,
        selectedConfig, setSelectedConfig,
        queryInProgress
    }

}

interface IQueryPageViewModel{
    showConnectionDetails: boolean;
    query: (config: IConfig, callback: (data: JSON) => void) => void;
    configs: Array<string>;
    selectedConfig: string;
    setSelectedConfig: (value: string) => void;
    queryInProgress: boolean;
}