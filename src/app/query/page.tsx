"use client";

import SimpleSelect from '../components/SimpleSelect';
import SubmitButton from '../components/SubmitButton';
import Toast from '../components/Toast';
import ToastViewModel from '@/viewmodels/ToastViewModel';
import { ChangeEventHandler } from 'react';
import HorizontalLine from '../components/HorizontalLine';
import QueryPageViewModel from '@/viewmodels/QueryPageViewModel';
import IConfig from '@/interfaces/IConfig';
import ConfigViewModel from '@/viewmodels/ConfigViewModel';
import SimpleInput from '../components/SimpleInput';
import Checkbox from '../components/Checkbox';

/**
 * Panel query screen.
 * 
 * @returns Panel query screen
 */
export default function QueryPage(){

    const queryModel = QueryPageViewModel()
    const configModel = ConfigViewModel()
    const toast = ToastViewModel()

    const query = () => {
        const config = configModel.exportConfig()
        queryModel.query(config, (data: JSON) => {
            // TODO display the result
        });
    }


    // Only show the host and port if `remote` is ticked
    const showConn = queryModel.showConnectionDetails
    const connectionStyles = showConn ? {} : {display:'none'}
    const hostAndPortStyles = showConn && configModel.remote ? {} : {display:'none'}

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
                                    value={queryModel.selectedConfig}
                                    setValue={queryModel.setSelectedConfig}
                                    />
                            </div>
                            <div className="mt-3 mb-3" style={connectionStyles}>
                                <label htmlFor="driver" className="form-label">Connection Type</label>
                                <SimpleSelect
                                    id="driver"
                                    values={configModel.drivers}
                                    value={configModel.driver}
                                    setValue={configModel.setDriver}
                                    />
                            </div>
                            <div className="mb-3" style={connectionStyles}>
                                <label htmlFor="panel" className="form-label">Panel</label>
                                <SimpleSelect
                                    id="panel"
                                    values={configModel.panels}
                                    value={configModel.panel}
                                    setValue={configModel.setPanel}
                                    />
                            </div>
                            <div className="mb-3 form-check" style={connectionStyles}>
                                <label htmlFor="remote" className="form-check-label">Remote</label>
                                <Checkbox
                                    id="remote"
                                    value={configModel.remote}
                                    setValue={configModel.setRemote}
                                    />
                            </div>
                            <div className="mb-3" style={hostAndPortStyles}>
                                <label htmlFor="host" className="form-label">Host</label>
                                <SimpleInput
                                    id="host"
                                    value={configModel.host}
                                    setValue={configModel.setHost}
                                    />
                            </div>
                            <div className="mb-3" style={hostAndPortStyles}>
                                <label htmlFor="port" className="form-label">Port</label>
                                <SimpleInput
                                    id="port"
                                    value={configModel.port}
                                    setValueNumeric={configModel.setPort}
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

