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

    const [config, setConfig] = useState<string>(USE_DAEMON)
    const [queryInProgress, setQueryInProgress] = useState<boolean>(false)
    const [showConnectionDetails, setShowConnectionDetails] = useState<boolean>(false)

    // Whenever the panels variable changes, reset the panel
    // variable to whatever the first option is.
    useEffect(() => {
        const show = config !== USE_DAEMON
        setShowConnectionDetails(show)
    }, [config])

    const query = (
        callback: (data: JSON) => void
    ) => {

        setQueryInProgress(true)

        // TODO perform the query
        // TODO display the info

        // TODO config arguments
        const config = {}

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
        config, setConfig,
        queryInProgress
    }

}

interface IQueryPageViewModel{
    showConnectionDetails: boolean;
    query: (callback: (data: JSON) => void) => void;
    configs: Array<string>;
    config: string;
    setConfig: (value: string) => void;
    queryInProgress: boolean;
}