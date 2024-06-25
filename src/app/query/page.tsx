"use client";
import SetupPageViewModel from '@/viewmodels/SetupPageViewModel';
import SimpleSelect from '../components/SimpleSelect';
import SubmitButton from '../components/SubmitButton';
import Toast from '../components/Toast';
import ToastViewModel from '@/viewmodels/ToastViewModel';
import { ChangeEventHandler, useState } from 'react';
import HorizontalLine from '../components/HorizontalLine';
import QueryPageViewModel from '@/viewmodels/QueryPageViewModel';

/**
 * Panel query screen.
 * 
 * @returns Panel query screen
 */
export default function QueryPage(){

    const queryModel = QueryPageViewModel()
    const setupModel = SetupPageViewModel()
    const toast = ToastViewModel()

    const query = () => {
        queryModel.query((data: JSON) => {
            // TODO display the result
        });
    }


    // Only show the host and port if `remote` is ticked
    const showConn = queryModel.showConnectionDetails
    const connectionStyles = showConn ? {} : {display:'none'}
    const hostAndPortStyles = showConn && setupModel.remote ? {} : {display:'none'}

    const setHost: ChangeEventHandler<HTMLInputElement> = (event) => {
        setupModel.setHost(event.target.value)
    }

    const setPort: ChangeEventHandler<HTMLInputElement> = (event) => {
        const value = parseInt(event.target.value)
        setupModel.setPort(value)
    }

    const setRemote: ChangeEventHandler<HTMLInputElement> = (event) => {
        const value = event.target.checked;
        setupModel.setRemote(value)
    }

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-lg-9 col-xl-6">
                <div className="card">
                    <h2 className="card-header">
                        Panel Query
                    </h2>

                    <div className="card-body">
                        <p className="text-muted">
                            Query the connected panel to extract any infomation available.
                        </p>
                        <p className="text-muted">
                            eg. VCOM value, panel resolution, supported display modes, etc.
                        </p>
                        <HorizontalLine/>
                        <form className="mt-3">
                            <div className="mt-3 mb-3">
                                <label htmlFor="config" className="form-label">Configuration</label>
                                <SimpleSelect
                                    id="config"
                                    values={queryModel.configs}
                                    value={queryModel.config}
                                    setValue={queryModel.setConfig}
                                    />
                            </div>
                            <div className="mt-3 mb-3" style={connectionStyles}>
                                <label htmlFor="driver" className="form-label">Connection Type</label>
                                <SimpleSelect
                                    id="driver"
                                    values={setupModel.drivers}
                                    value={setupModel.driver}
                                    setValue={setupModel.setDriver}
                                    />
                            </div>
                            <div className="mb-3" style={connectionStyles}>
                                <label htmlFor="panel" className="form-label">Panel</label>
                                <SimpleSelect
                                    id="panel"
                                    values={setupModel.panels}
                                    value={setupModel.panel}
                                    setValue={setupModel.setPanel}
                                    />
                            </div>
                            <div className="mb-3 form-check" style={connectionStyles}>
                                <label htmlFor="remote" className="form-check-label">Remote</label>
                                <input
                                    id="remote"
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={setupModel.remote}
                                    onChange={setRemote}
                                    />
                            </div>
                            <div className="mb-3" style={hostAndPortStyles}>
                                <label htmlFor="host" className="form-label">Host</label>
                                <input
                                    id="host"
                                    type="text"
                                    className="form-control"
                                    defaultValue={setupModel.host}
                                    onChange={setHost}
                                    />
                            </div>
                            <div className="mb-3" style={hostAndPortStyles}>
                                <label htmlFor="port" className="form-label">Port</label>
                                <input
                                    id="port"
                                    type="text"
                                    className="form-control"
                                    defaultValue={setupModel.port}
                                    onChange={setPort}
                                    />
                            </div>
                            
                        </form>

                    </div>

                    <div className="card-footer text-end">
                        <SubmitButton
                            classes="btn btn-success"
                            text="Query"
                            enabled={!queryModel.queryInProgress}
                            onClick={query}
                            />
                    </div>
                </div>
            </div>
            <Toast model={toast}/>
        </div>
    )
}

