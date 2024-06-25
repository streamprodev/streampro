import React, { useEffect } from 'react'
import { useEwGrabber } from '../../../context/EwGrabberContext';
import { useBible } from '../../../context/BibleContext';
import { useSong } from '../../../context/SongContext';

import obs from '../../../assets/obs.png';
import vmix from '../../../assets/vmix.png';
import xsplit from '../../../assets/xsplit.png';
import lightstream from '../../../assets/lightstream.png';
import { Copy, MinusSquare } from 'iconsax-react';
import { BiSquareRounded } from 'react-icons/bi';
import { FiEdit } from 'react-icons/fi';

import { initializeApp } from "firebase/app"
import { getDocs, collection, query, where, getFirestore } from "@firebase/firestore"
import { useRegistrationInfo } from '../../../context/RegistrationInfoContext';
import { usePreviewXOutput } from '../../../context/PreviewXOutputContext';
import LowerToast from '../../LowerToast';
import { toast } from 'react-toastify';
import GeneratingConnectionModal from './GeneratingConnectionModal';

const { ipcRenderer } = window.require('electron');

function ConnectionTypes() {

    const { registrationInfo, firestore } = useRegistrationInfo();
    const { setexternalConnectionConnectionEstablished, setexternalConnectionUrl, setexternalConnectionPasscode, externalConnectionPasscode, isVmixStarted, setIsVmixStarted, isObsStarted, setIsObsStarted, isLightstreamStarted, setIsLightstreamStarted, isXsplitStarted, setIsXsplitStarted, isVmixExternalConnectionEnabled, setIsVmixExternalConnectionEnabled, isObsExternalConnectionEnabled, setIsObsExternalConnectionEnabled, isLightstreamExternalConnectionEnabled, setIsLightstreamExternalConnectionEnabled, isXsplitExternalConnectionEnabled, setIsXsplitExternalConnectionEnabled, copiedToaster, bibleConnections, setbibleConnections, setoutputConnectionEstablished, setisLive, setreconnectingStatus, createConnectionLoading, setIsCreateConnectionLoading, carouselRef } = usePreviewXOutput();


    // const establishConnection = async (local = null) => {


    //     var url = outputUrl;
    //     url = "http://127.0.0.1:8088"
    //     if (isVmixExternalConnectionEnabled) {

    //         const firebaseConfig = {
    //             apiKey: registrationInfo.firestore_apikey,
    //             projectId: registrationInfo.firestore_projectid,
    //             appId: registrationInfo.firestore_appid,
    //         };

    //         // Initialize Firebase
    //         const firestore = getFirestore(initializeApp(firebaseConfig, new Date().toJSON()))

    //         const collection_ref = collection(firestore, 'Remote Connections')
    //         const q = query(collection_ref, where("password", "==", outputPasscode))
    //         const doc_refs = await getDocs(q);
    //         const res = []

    //         doc_refs.forEach(country => {
    //             res.push({
    //                 id: country.id,
    //                 ...country.data()
    //             })
    //         })


    //         // console.log(res)
    //         if (res.length > 0) {
    //             const initial = res[0];
    //             url = initial.url
    //             // console.log(url)
    //             setoutputUrl(url)
    //         }

    //     }
    //     console.log({ outputPasscode, outputUrl: url });

    //     try {
    //         ipcRenderer.invoke('connectVmix', { outputPasscode, outputUrl: url })
    //             .then(res => {
    //                 setoutputConnectionEstablished(1)


    //             })
    //             .catch(err => {
    //                 console.log(err)
    //                 setTimeout(() => {
    //                     closeConnectNowModal()

    //                 }, 3000);
    //                 toast(<LowerToast status={'error'} message={"Error connecting to existing server"} />, {
    //                     position: "bottom-center",
    //                     autoClose: 3000,
    //                     hideProgressBar: true,
    //                     closeOnClick: true,
    //                     pauseOnHover: true,
    //                     draggable: true,
    //                     progress: undefined,
    //                     theme: "light",
    //                     style: { width: "500px", backgroundColor: "#FF3939", textAlign: "left", height: "10px", margin: "auto" }
    //                 });
    //             })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }


    // 


    return (
        <div className='connectionTypes'>
            <div className='connectionTypesRow' >
                <div className='songsList' style={{ borderRadius: "10px", flex: "1", paddingLeft: "24px", overflow: "scroll", position: 'relative' }} >


                    <div style={{ display: 'flex', alignItems: "center", gap: "12px", flexDirection: "column", paddingTop: "20px" }}>
                        <div style={{ display: 'flex', gap: "12px", }}>
                            <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>{!isVmixStarted ? "Not Started" : "Started"}</span>
                            <div style={{ height: "11px", width: "11px", borderRadius: "50%", backgroundColor: !isVmixStarted ? "#FF3939" : "#3EDB57", marginTop: "5px" }}></div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <img src={vmix} alt="logo" height={90} width={"100%"} />
                            <div style={{ position: 'absolute', top: 0, right: 0 }}>
                                <FiEdit size={10} color={(isVmixStarted && isVmixExternalConnectionEnabled) ? "#3EDB57" : "#FFFFFF"} />
                            </div>
                        </div>
                        <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Vmix</span>

                        {
                            isVmixStarted ?
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, position: 'relative' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, }}>
                                        <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}> Control Key</span>
                                        <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>{externalConnectionPasscode}</span>
                                    </div>
                                    <div style={{ position: "absolute", top: 0, right: -20 }}>
                                        <Copy size="14" color={"#FFFFFF"} onClick={() => {
                                            navigator.clipboard.writeText(externalConnectionPasscode);
                                            copiedToaster()
                                        }} style={{ cursor: "pointer" }} />

                                    </div>
                                </div> :
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setIsVmixExternalConnectionEnabled(prev => !prev)}>
                                    {
                                        // isVmixExternalConnectionEnabled ?
                                        //     <MinusSquare size="14" color="#B1B1B1" onClick={() => setIsVmixExternalConnectionEnabled(false)} /> :
                                        //     <BiSquareRounded size="14" color="#B1B1B1" onClick={() => setIsVmixExternalConnectionEnabled(true)} />
                                    }
                                    <input type='checkbox' value={isVmixExternalConnectionEnabled} checked={isVmixExternalConnectionEnabled} style={{ cursor: 'pointer' }} />
                                    <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Permit external control</span>
                                </div>
                        }
                        <div style={{ height: "53px", padding: '20px 0', position: 'absolute', bottom: 0, }}>
                            <button style={{ width: "164px", height: "53px", backgroundColor: "#FF3939", border: "none", borderRadius: "4px", cursor: "pointer", flex: 1 }} onClick={() => {
                                console.log(isVmixExternalConnectionEnabled)
                                if (isVmixStarted) {
                                    setIsVmixStarted(false)
                                    setexternalConnectionPasscode('')
                                    setexternalConnectionUrl('')
                                    ipcRenderer.send('closengrok', 'Session closed successfully')
                                    setexternalConnectionConnectionEstablished(0)

                                    const filteredConnections = bibleConnections.filter(x => x.outputPasscode != externalConnectionPasscode)
                                    setbibleConnections(filteredConnections)
                                    if (carouselRef.current) {
                                        carouselRef.current.goToSlide(0)
                                    }
                                    if (filteredConnections < 0) {
                                        setoutputConnectionEstablished(0)
                                        setisLive(false)
                                        setreconnectingStatus(false)
                                        ipcRenderer.send('stopOutputConnectionCheck', 'Session closed successfully')

                                        toast(<LowerToast status={'success'} message={'Connection closed!'} />, {
                                            position: "bottom-center",
                                            autoClose: 2000,
                                            hideProgressBar: true,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                            theme: "light",
                                            style: { width: "500px", height: "20px", backgroundColor: "#A7FFB5", textAlign: "left" }
                                        });

                                    }
                                } else {
                                    // console.log((new Date()).toISOString().replace(/[ :.-]/g, "").slice(0, -5);)
                                    setIsCreateConnectionLoading(true)
                                    ipcRenderer.send('createConnection', registrationInfo, isVmixExternalConnectionEnabled)
                                }
                                // setIsVmixStarted(prev => !prev)
                            }}>
                                <span style={{ color: "white" }}>{isVmixStarted ? "Turn Off" : "Enable"}</span>
                            </button>

                        </div>

                    </div>
                </div>
                <div className='songsList' style={{ borderRadius: "10px", flex: "1", paddingLeft: "24px", overflow: "scroll", position: 'relative' }} >


                    <div style={{ display: 'flex', alignItems: "center", gap: "12px", flexDirection: "column", paddingTop: "20px" }}>
                        <div style={{ display: 'flex', gap: "12px", }}>
                            <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>{!isXsplitStarted ? "Not Started" : "Started"}</span>
                            <div style={{ height: "11px", width: "11px", borderRadius: "50%", backgroundColor: !isXsplitStarted ? "#FF3939" : "#3EDB57", marginTop: "5px" }}></div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <img src={xsplit} alt="logo" height={70} width={"100%"} />
                            <div style={{ position: 'absolute', top: 0, right: 0 }}>
                                {/* <FiEdit size={10} /> */}
                            </div>
                        </div>
                        <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Xsplit</span>
                        <div style={{ height: "53px", padding: '20px 0', position: 'absolute', bottom: 0, }}>
                            <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "17px", }}> Coming soon</span>

                        </div>

                        {/* {
                            isXsplitStarted ?
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, position: 'relative' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, }}>
                                        <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}> Control Key</span>
                                        <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>12356</span>
                                    </div>
                                    <div style={{ position: "absolute", top: 0, right: -20 }}>
                                        <Copy size="14" color="#FFFFFF" onClick={() => {
                                            navigator.clipboard.writeText('12345678');
                                        }} style={{ cursor: "pointer" }} />

                                    </div>
                                </div> :
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                                    {
                                        // isXsplitExternalConnectionEnabled ?
                                        //     <MinusSquare size="14" color="#B1B1B1" onClick={() => setIsXsplitExternalConnectionEnabled(false)} /> :
                                        //     <BiSquareRounded size="14" color="#B1B1B1" onClick={() => setIsXsplitExternalConnectionEnabled(true)} />
                                    }
                                    <input type='checkbox' onClick={() => setIsXsplitExternalConnectionEnabled(prev => !prev)} value={isXsplitExternalConnectionEnabled} />
                                    <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Permit external control</span>
                                </div>
                        } */}
                        {/* <div style={{ height: "53px", padding: '20px 0', position: 'absolute', bottom: 0, }}>
                            <button style={{ width: "164px", height: "53px", backgroundColor: "#FF3939", border: "none", borderRadius: "4px", cursor: "not-allowed", flex: 1 }} onClick={() => { setIsXsplitStarted(prev => !prev) }} disabled>
                                <span style={{ color: "white" }}>{isXsplitStarted ? "Turn Off" : "Enable"}</span>
                            </button>

                        </div> */}

                    </div>
                </div>
            </div>
            <div className='connectionTypesRow' >
                <div className='songsList' style={{ borderRadius: "10px", flex: "1", paddingLeft: "24px", overflow: "scroll", position: 'relative' }} >


                    <div style={{ display: 'flex', alignItems: "center", gap: "12px", flexDirection: "column", paddingTop: "20px" }}>
                        <div style={{ display: 'flex', gap: "12px", }}>
                            <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>{!isObsStarted ? "Not Started" : "Started"}</span>
                            <div style={{ height: "11px", width: "11px", borderRadius: "50%", backgroundColor: !isObsStarted ? "#FF3939" : "#3EDB57", marginTop: "5px" }}></div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <img src={obs} alt="logo" height={80} width={"100%"} />
                            <div style={{ position: 'absolute', top: 0, right: 0 }}>
                                {/* <FiEdit size={10} /> */}
                            </div>
                        </div>
                        <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>OBS</span>
                        <div style={{ height: "53px", padding: '20px 0', position: 'absolute', bottom: 0, }}>
                            <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "17px", }}> Coming soon</span>

                        </div>

                        {/* {
                            isObsStarted ?
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, position: 'relative' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, }}>
                                        <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}> Control Key</span>
                                        <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>12356</span>
                                    </div>
                                    <div style={{ position: "absolute", top: 0, right: -50 }}>
                                        <Copy size="14" color="#FFFFFF" onClick={() => {
                                            navigator.clipboard.writeText('12345678');
                                        }} style={{ cursor: "pointer" }} />

                                    </div>
                                </div> :
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                                    {
                                        // isVmixExternalConnectionEnabled ?
                                        //     <MinusSquare size="14" color="#B1B1B1" onClick={() => setIsVmixExternalConnectionEnabled(false)} /> :
                                        //     <BiSquareRounded size="14" color="#B1B1B1" onClick={() => setIsVmixExternalConnectionEnabled(true)} />
                                    }
                                    <input type='checkbox' onClick={() => setIsObsExternalConnectionEnabled(prev => !prev)} value={isObsExternalConnectionEnabled} />
                                    <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Permit external control</span>
                                </div>
                        } */}
                        {/* <div style={{ height: "53px", padding: '20px 0', position: 'absolute', bottom: 0, }}>
                            <button style={{ width: "164px", height: "53px", backgroundColor: "#FF3939", border: "none", borderRadius: "4px", cursor: "not-allowed", flex: 1 }} onClick={() => { setIsObsStarted(prev => !prev) }} disabled>
                                <span style={{ color: "white" }}>{isObsStarted ? "Turn Off" : "Enable"}</span>
                            </button>

                        </div> */}

                    </div>
                </div>
                <div className='songsList' style={{ borderRadius: "10px", flex: "1", paddingLeft: "24px", overflow: "scroll", position: 'relative' }} >


                    <div style={{ display: 'flex', alignItems: "center", gap: "12px", flexDirection: "column", paddingTop: "20px" }}>
                        <div style={{ display: 'flex', gap: "12px", }}>
                            <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>{!isLightstreamStarted ? "Not Started" : "Started"}</span>
                            <div style={{ height: "11px", width: "11px", borderRadius: "50%", backgroundColor: !isLightstreamStarted ? "#FF3939" : "#3EDB57", marginTop: "5px" }}></div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <img src={lightstream} alt="logo" height={90} width={"100%"} />
                            <div style={{ position: 'absolute', top: 0, right: 0 }}>
                                {/* <FiEdit size={10} /> */}
                            </div>
                        </div>
                        <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Lightstream</span>

                        <div style={{ height: "53px", padding: '20px 0', position: 'absolute', bottom: 0, }}>
                            <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "17px", }}> Coming soon</span>

                        </div>

                        {/* {
                            isLightstreamStarted ?
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, position: 'relative' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, }}>
                                        <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}> Control Key</span>
                                        <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>12356</span>
                                    </div>
                                    <div style={{ position: "absolute", top: 0, right: -20 }}>
                                        <Copy size="14" color="#FFFFFF" onClick={() => {
                                            navigator.clipboard.writeText('12345678');
                                        }} style={{ cursor: "pointer" }} />

                                    </div>
                                </div> :
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                                    {
                                        // isLightstreamExternalConnectionEnabled ?
                                        //     <MinusSquare size="14" color="#B1B1B1" onClick={() => setIsLightstreamExternalConnectionEnabled(false)} /> :
                                        //     <BiSquareRounded size="14" color="#B1B1B1" onClick={() => setIsLightstreamExternalConnectionEnabled(true)} />
                                    }
                                    <input type='checkbox' onClick={() => setIsLightstreamExternalConnectionEnabled(prev => !prev)} value={isLightstreamExternalConnectionEnabled} />
                                    <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Permit external control</span>
                                </div>
                        } */}
                        {/* <div style={{ height: "53px", padding: '20px 0', position: 'absolute', bottom: 0, }}>
                            <button style={{ width: "164px", height: "53px", backgroundColor: "#FF3939", border: "none", borderRadius: "4px", cursor: "not-allowed", flex: 1 }} onClick={() => { setIsLightstreamStarted(prev => !prev) }} disabled>
                                <span style={{ color: "white" }}>{isLightstreamStarted ? "Turn Off" : "Enable"}</span>
                            </button>

                        </div> */}

                    </div>
                </div>
            </div>
            <GeneratingConnectionModal loading={createConnectionLoading} />
        </div>


    );
}


export default ConnectionTypes