"use client";
import SetupPageViewModel from '@/viewmodels/SetupPageViewModel';
import SimpleSelect from '../components/SimpleSelect';
import SubmitButton from '../components/SubmitButton';
import Toast from '../components/Toast';
import ToastViewModel from '@/viewmodels/ToastViewModel';
import { ChangeEventHandler } from 'react';
import { Drivers } from '@/enums/Drivers';

/**
 * Daemon setup screen.
 * 
 * Allows the user to modify the daemon's configuration via the GUI
 * instead of manually editing the config.json file.
 * 
 * @returns Setup screen
 */
export default function SetupPage(){

    const model = SetupPageViewModel()
    const toast = ToastViewModel()

    // Only show the host and port if the driver type is REMOTE
    const hostAndPortStyles = model.driver === Drivers.REMOTE.toString() ? {} : {display:'none'}

    const save = () => {
        model.save((data: JSON) => {
            if ('error' in data){
                const error = data.error as string
                toast.error(error)
            }else{
                toast.success('Config updated successfully')
            }
        })
    }

    const setHost: ChangeEventHandler<HTMLInputElement> = (event) => {
        model.setHost(event.target.value)
    }

    const setPort: ChangeEventHandler<HTMLInputElement> = (event) => {
        const value = parseInt(event.target.value)
        model.setPort(value)
    }

    return (
        <form>
            <div className="mb-3">
                <label htmlFor="driver" className="form-label">Connection Type</label>
                <SimpleSelect
                    id="driver"
                    values={model.drivers}
                    value={model.driver}
                    setValue={model.setDriver}
                    />
            </div>
            <div className="mb-3">
                <label htmlFor="panel" className="form-label">Panel</label>
                <SimpleSelect
                    id="panel"
                    values={model.panels}
                    value={model.panel}
                    setValue={model.setPanel}
                    />
            </div>
            <div className="mb-3" style={hostAndPortStyles}>
                <label htmlFor="host" className="form-label">Host</label>
                <input
                    id="host"
                    type="text"
                    className="form-control"
                    defaultValue={model.host}
                    onChange={setHost}
                    />
            </div>
            <div className="mb-3" style={hostAndPortStyles}>
                <label htmlFor="port" className="form-label">Port</label>
                <input
                    id="port"
                    type="text"
                    className="form-control"
                    defaultValue={model.port}
                    onChange={setPort}
                    />
            </div>
            <SubmitButton
                classes="btn btn-success"
                text="Save"
                enabled={!model.saving}
                onClick={save}
                />
            <Toast model={toast}/>
        </form>
    )
}

