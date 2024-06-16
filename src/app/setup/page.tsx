"use client";
import SetupPageViewModel from '@/viewmodels/SetupPageViewModel';
import SimpleSelect from '../components/SimpleSelect';
import SubmitButton from '../components/SubmitButton';

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
            <SubmitButton
                classes="btn btn-success"
                text="Save"
                enabled={!model.saving}
                onClick={model.save}
                />
        </form>
    )
}

