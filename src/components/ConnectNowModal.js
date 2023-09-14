import React, { useEffect, useState } from 'react';
import SelectStreamPlatform from './SelectStreamPlatform';
import SetConnectionMode from './SetConnectionMode';
import SetRemoteConnectionDetails from './SetRemoteConnectionDetails';
import EstablishingConnection from './EstablishingConnection';
import { ToastContainer, toast } from 'react-toastify';
import LowerToast from './LowerToast';
import axios from 'axios';
import { initializeApp } from "firebase/app"
import { getDocs, collection, query, where, getFirestore } from "@firebase/firestore"
import { usePreviewXOutput } from '../context/PreviewXOutputContext';
import { useRegistrationInfo } from '../context/RegistrationInfoContext';

const { ipcRenderer } = window.require('electron');

const ConnectNowModal = () => {



    const { registrationInfo, firestore } = useRegistrationInfo();
    const { isConnectNowModalOpen, closeConnectNowModal, outputUrl, setoutputUrl, outputPasscode, setoutputPasscode, outputConnectionSoftware, setoutputConnectionSoftware, outputConnectionEstablished, setoutputConnectionEstablished, setisLive } = usePreviewXOutput();

    const [page, setPage] = useState(1)
    // const [streamingPlatform, setStreamingPlatform] = useState('')
    const [connectionMode, setconnectionMode] = useState('')



    useEffect(() => {
        if (outputConnectionEstablished === 1) {
            setTimeout(() => {
                setPage(1)
                // setoutputConnectionSoftware('')
                // setconnectionMode('')
                closeConnectNowModal()

            }, 1500);
        }
        else if (outputConnectionEstablished === -1) {
            setTimeout(() => {
                setPage(1)
                setoutputConnectionEstablished(0)
                // setoutputConnectionSoftware('')
                // setconnectionMode('')
                closeConnectNowModal()

            }, 1500);
        }
        setisLive(outputConnectionEstablished)
    }, [outputConnectionEstablished]);

    const closeModal = () => {
        closeConnectNowModal()
        setPage(1)
        // setoutputConnectionSoftware('')
        // setconnectionMode('')
    }
    const updateStreamingPlatform = (platform) => {

        setoutputConnectionSoftware(platform)
        setPage(2)
    }
    const updateConnectionMode = (mode) => {
        setconnectionMode(mode)
        if (mode === 'local') {
            setPage(4)
            establishConnection('local')
        } else {
            setoutputPasscode('')
            setoutputUrl('')
            setPage(3)
        }
    }
    const updateRemoteConnectionDetails = () => {
        setPage(4)
        establishConnection()
    }

    const establishConnection = async (local = null) => {

        var url = outputUrl;
        if (local) {
            url = "http://127.0.0.1:8088"
        } else {

            const firebaseConfig = {
                apiKey: registrationInfo.firestore_apikey,
                projectId: registrationInfo.firestore_projectid,
                appId: registrationInfo.firestore_appid,
            };

            // Initialize Firebase
            const firestore = getFirestore(initializeApp(firebaseConfig, new Date().toJSON()))

            const collection_ref = collection(firestore, 'Remote Connections')
            const q = query(collection_ref, where("password", "==", outputPasscode))
            const doc_refs = await getDocs(q);
            const res = []

            doc_refs.forEach(country => {
                res.push({
                    id: country.id,
                    ...country.data()
                })
            })


            // console.log(res)
            if (res.length > 0) {
                const initial = res[0];
                url = initial.url
                // console.log(url)
                setoutputUrl(url)
            }

        }
        console.log({ outputPasscode, outputUrl: url });

        try {
            ipcRenderer.invoke('connectVmix', { outputPasscode, outputUrl: url })
                .then(res => {
                    setoutputConnectionEstablished(1)


                })
                .catch(err => {
                    console.log(err)
                    setTimeout(() => {
                        closeConnectNowModal()
                        setPage(1)

                    }, 3000);
                    toast(<LowerToast status={'error'} message={"Error connecting to existing server"} />, {
                        position: "bottom-center",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        style: { width: "500px", backgroundColor: "#FF3939", textAlign: "left", height: "10px", margin: "auto" }
                    });
                })
        } catch (error) {
            console.log(error)
        }

        // setTimeout(() => {
        //     setoutputConnectionEstablished(1)

        // }, 2500);
    }

    const onClickBack = () => {
        if (page === 2) {
            setPage(1)
        } else if (page === 3) {
            setPage(2)
        }

    }

    return (
        isConnectNowModalOpen && (
            <div className="modal" style={{ display: 'block', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', zIndex: "10" }}>
                <div className="modal-content" style={{ background: '#121212', width: '60%', margin: '100px auto', padding: '20px', height: "70vh" }}>
                    <span className="close" onClick={closeModal} style={{ cursor: 'pointer', float: 'right', color: '#FFFFFF', fontSize: '24px' }}>
                        &times;
                    </span>
                    <div style={{ height: "100%" }}>

                        {
                            page === 1 && <SelectStreamPlatform onClick={updateStreamingPlatform} />
                        }
                        {
                            page === 2 && <SetConnectionMode onClick={updateConnectionMode} onClickBack={onClickBack} />
                        }
                        {
                            page === 3 && <SetRemoteConnectionDetails onClick={updateRemoteConnectionDetails} onClickBack={onClickBack} url={outputUrl} setUrl={setoutputUrl} passCode={outputPasscode} setPasscode={setoutputPasscode} />
                        }

                        {
                            page === 4 && <EstablishingConnection onClick={updateConnectionMode} outputConnectionEstablished={outputConnectionEstablished} />
                        }
                    </div>



                </div>
            </div>
        )
    );
};

export default ConnectNowModal;

//SELECT STREAMING PLATFORM


//CONNECTION MODE


//REMOTE CONNECTION
