import React, { useEffect, useState } from 'react';
import SelectStreamPlatform from './SelectStreamPlatform';
import SetConnectionMode from './SetConnectionMode';
import SetRemoteConnectionDetails from './SetRemoteConnectionDetails';
import EstablishingConnection from './EstablishingConnection';
import { ToastContainer, toast } from 'react-toastify';
import LowerToast from './LowerToast';
import URLGenerated from './URLGenerated';
import { usePreviewXOutput } from '../context/PreviewXOutputContext';
import { useRegistrationInfo } from '../context/RegistrationInfoContext';
const { ipcRenderer } = window.require('electron');

const GenerateURLModal = () => {

const{registrationInfo} = useRegistrationInfo()
    const { isGenerateURLModalOpen, closeGenerateURLModal, externalConnectionUrl, setexternalConnectionUrl, externalConnectionPasscode, setexternalConnectionPasscode, externalConnectionConnectionEstablished, setexternalConnectionConnectionEstablished } = usePreviewXOutput();




    const [page, setPage] = useState(1)
    useEffect(() => {
        if (externalConnectionConnectionEstablished === 1) {
            setTimeout(() => {
                // setPage(1)
                // onClose()

            }, 1500);
        }
    }, [externalConnectionConnectionEstablished]);

    const closeModal = () => {
        closeGenerateURLModal()
        setPage(1)
        // setoutputConnectionSoftware('')
        // setconnectionMode('')
    }
    const updateStreamingPlatform = () => {
        setPage(2)
        establishConnection()

    }



    const establishConnection = () => {
        ipcRenderer.send('setngrok',registrationInfo)
        setTimeout(() => {
            // setexternalConnectionPasscode(generateRandom())
            // setexternalConnectionUrl("WWW.google.com")
            // setexternalConnectionConnectionEstablished(1)
            // start()
        }, 2500);
    }

    const onClickBack = () => {
        if (page === 2) {
            setPage(1)
        } else if (page === 3) {
            setPage(2)
        }

    }

    const generateRandom = () => {
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var result = ""
        var charactersLength = characters.length;

        for (var i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result
    }

    return (
        isGenerateURLModalOpen && (
            <div className="modal" style={{ display: 'block', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', zIndex: "10" }}>
                <div className="modal-content" style={{ background: '#121212', width: '60%', margin: '120px auto', padding: '20px', height: "60vh" }}>
                    <span className="close" onClick={closeModal} style={{ cursor: 'pointer', float: 'right', color: '#FFFFFF', fontSize: '24px' }}>
                        &times;
                    </span>
                    {
                        page === 1 && <SelectStreamPlatform onClick={updateStreamingPlatform} />
                    }
                    {
                        page === 2 && <URLGenerated onClickBack={onClickBack} url={externalConnectionUrl} setUrl={setexternalConnectionUrl} passCode={externalConnectionPasscode} setPasscode={setexternalConnectionPasscode} externalConnectionConnectionEstablished={externalConnectionConnectionEstablished} />
                    }




                </div>
            </div>
        )
    );
};

export default GenerateURLModal;

//SELECT STREAMING PLATFORM


//CONNECTION MODE


//REMOTE CONNECTION
