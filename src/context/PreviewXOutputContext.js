
import React, { useContext, useState, useEffect, useRef } from 'react'
import { useStopwatch } from 'react-timer-hook';
import { toast } from 'react-toastify';
import LowerToast from '../components/LowerToast';
import { addDoc, collection, getDocs, query, where, getFirestore } from "@firebase/firestore"
import { initializeApp } from "firebase/app"

import { useRegistrationInfo } from './RegistrationInfoContext';
import { useLocation } from 'react-router-dom';
import { useBible } from './BibleContext';
const { ipcRenderer } = window.require('electron');

export const PreviewXOutputContext = React.createContext({})




export function usePreviewXOutput() { return useContext(PreviewXOutputContext) }

export function PreviewXOutputContextProvider({ children }) {

    // const { registrationInfo } = useRegistrationInfo();

    const [isConnectNowModalOpen, setIsConnectNowModalOpen] = useState(false);
    const [isGenerateURLModalOpen, setisGenerateURLModalOpen] = useState(false);



    // const [reconnecting, setreconnectingStatus] = useState(false);
    const [outputLine, setoutputLine] = useState("");
    const [finaloutputLine, setfinaloutputLine] = useState('');

    const [outputUrl, setoutputUrl] = useState('http://127.0.0.1:8088');
    const [outputPasscode, setoutputPasscode] = useState('');
    const [outputConnectionSoftware, setoutputConnectionSoftware] = useState('');
    const [outputConnectionEstablished, setoutputConnectionEstablished] = useState(0);

    const [externalConnectionUrl, setexternalConnectionUrl] = useState('');
    const [externalConnectionPasscode, setexternalConnectionPasscode] = useState('');
    const [externalConnectionConnectionEstablished, setexternalConnectionConnectionEstablished] = useState(0);

    const [isLive, setisLive] = useState(false);
    const [showoutputOptions, setshowoutputOptions] = useState(false);
    const [outputOptionsPosition, setoutputOptionsPosition] = useState({ x: 0, y: 0 });


    const [ngrokStatus, setngrokStatus] = useState({});
    const [ngrokUrlError, setngrokUrlError] = useState('');

    const [reconnectingStatus, setreconnectingStatus] = useState(false)
    const [generatereconnectingStatus, setgeneratereconnectingStatus] = useState(false)

    const [selectedVmixInputKey, setselectedVmixInputKey] = useState('');

    const [isVmixStarted, setIsVmixStarted] = React.useState(false)
    const [isObsStarted, setIsObsStarted] = React.useState(false)
    const [isLightstreamStarted, setIsLightstreamStarted] = React.useState(false)
    const [isXsplitStarted, setIsXsplitStarted] = React.useState(false)

    const [isVmixExternalConnectionEnabled, setIsVmixExternalConnectionEnabled] = React.useState(false)
    const [isObsExternalConnectionEnabled, setIsObsExternalConnectionEnabled] = React.useState(false)
    const [isLightstreamExternalConnectionEnabled, setIsLightstreamExternalConnectionEnabled] = React.useState(false)
    const [isXsplitExternalConnectionEnabled, setIsXsplitExternalConnectionEnabled] = React.useState(false)

    const [bibleConnections, setbibleConnections] = useState([]);
    const [songConnections, setsongConnections] = useState([]);



    const location = useLocation();
    const { selectedBook, setselectedBook, selectedChapter, setselectedChapter, searchVerse, selectedVerseArray, selectActiveVersion, multipleselectedVerseArray, setmultipleselectedVerseArray, getVerseText } = useBible()

    useEffect(() => {
        ipcRenderer.on('vmixDisconected', vmixDisconected)
        // ipcRenderer.on('setReconnecting', setReconnecting)
        ipcRenderer.on('setngrokUrlError', setngrokUrlErrorf);
        ipcRenderer.on('setngrokUrl', setngrokUrlf);
        ipcRenderer.on('setngrokStatus', setngrokStatusf);
        ipcRenderer.on('closeNgrokSession', closeNgrokSessionf);
        ipcRenderer.on('updateMessage', updateMessage);

        return () => {
            ipcRenderer.removeListener('setngrokUrlError', setngrokUrlErrorf);
            ipcRenderer.removeListener('setngrokUrl', setngrokUrlf);
            ipcRenderer.removeListener('setngrokStatus', setngrokStatusf);
            ipcRenderer.removeListener('closeNgrokSession', closeNgrokSessionf);
            ipcRenderer.removeListener('vmixDisconected', vmixDisconected)
            ipcRenderer.removeListener('updateMessage', updateMessage)
            // ipcRenderer.removeListener('setReconnecting', setReconnecting)
        }
    }, []);




    // useEffect(() => {
    //     ipcRenderer.invoke('fetchHostName').then(setdeviceHostName)

    // }, [])
    // useEffect(() => {
    //     console.log('final', deviceHostName)

    // }, [deviceHostName])

    useEffect(() => {

        // if (outputLine) {
        if (isLive) {
            setfinaloutputLine(outputLine)
        } else if (outputConnectionEstablished) {
            if (location.pathname == '/main/bible' || location.pathname == '/main/ew-graber') {

                setTimeout(() => {
                    // delete selectedVerseArray['ref'];
                    let clone = Object.assign({}, selectedVerseArray);
                    delete clone.ref;

                    clone.ref = selectedVerseArray.book_name + " " + selectedVerseArray.chapter_number + ":" + selectedVerseArray.verse_number + " (" + selectActiveVersion.toUpperCase() + ")"
                    if (multipleselectedVerseArray.length > 0) {
                        clone = getVerseText(multipleselectedVerseArray)
                    }



                    const data = { outputUrl, outputPasscode, outputLine, selectedVerseArray: clone, selectActiveVersion }

                    ipcRenderer.invoke('sendToVmixBible', data).then(res => { }).catch(err => { console.log(err) })

                }, 0);
                return
            }
            const data = { outputUrl, outputPasscode, outputLine }
            ipcRenderer.invoke('sendToVmix', data).then(res => { }).catch(err => console.log(err))

        }

        // }
    }, [outputLine, selectedVerseArray, multipleselectedVerseArray]);

    useEffect(() => {
        // console.log(selectedVerseArray)
    }, [selectedVerseArray]);

    useEffect(() => {
        if (outputConnectionEstablished) {
            console.log('here');
            if (location.pathname == '/main/bible' || location.pathname == '/main/ew-graber') {
                setTimeout(() => {
                    // delete selectedVerseArray['ref'];

                    let clone = Object.assign({}, selectedVerseArray);
                    delete clone.ref;
                    clone.ref = selectedVerseArray.book_name + " " + selectedVerseArray.chapter_number + ":" + selectedVerseArray.verse_number + " (" + selectActiveVersion.toUpperCase() + ")"
                    if (multipleselectedVerseArray.length > 0) {
                        clone = getVerseText(multipleselectedVerseArray)
                    }

                    const data = { outputUrl, outputPasscode, finaloutputLine, selectedBook, selectedChapter, searchVerse, selectedVerseArray: clone, selectActiveVersion }
                    ipcRenderer.invoke('goLiveWBible', data).then(res => { }).catch(err => { console.log(err) })

                }, 0);
                return
            }
            const data = { outputUrl, outputPasscode, finaloutputLine }
            ipcRenderer.invoke('goLiveWSongs', data).then(res => { }).catch(err => { })

        }
    }, [finaloutputLine, multipleselectedVerseArray]);

    useEffect(() => {
        if (isLive) {
            if (!outputConnectionEstablished) {
                setisLive(false)
                toast(<LowerToast status={'error'} message={'You need to connect to streaming software before you go live'} />, {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    style: { width: "500px", backgroundColor: "#FF3939", textAlign: "left", height: "10px", margin: "auto", color: "#ffffff" }
                });
            } else {
                setfinaloutputLine(outputLine)
            }

        } else {
            const data = { outputUrl, outputPasscode, finaloutputLine }
            try {
                ipcRenderer.invoke('goOfflineWSongs', data).then(res => { }).catch(err => { })
                setfinaloutputLine('')
            } catch (error) {

            }
        }
    }, [isLive]);

    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        reset,
    } = useStopwatch({ autoStart: false });

    const copiedToaster = () => {
        return toast(<LowerToast status={'success'} message={'copied'} />, {
            position: "bottom-center",
            autoClose: 300,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            style: { width: "20vw", backgroundColor: "#A7FFB5", textAlign: "left", height: "10px", margin: "auto" }
        });
    }

    const updateMessage = (event, message) => {
        console.log(event)
        console.log(message)
    }
    const vmixDisconected = () => {
        setoutputConnectionEstablished(0)
        setisLive(false)
        setreconnectingStatus(false)
        toast(<LowerToast status={'error'} message={'Output Disconnected'} />, {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            style: { width: "500px", backgroundColor: "#FF3939", textAlign: "left", height: "10px", margin: "auto", color: "#ffffff" }
        });
    }


    const openConnectNowModal = () => {
        setIsConnectNowModalOpen(true);
    };
    const openGenerateURLModal = () => {
        setisGenerateURLModalOpen(true);
    };

    const destroyCreatedUrl = () => {
        reset()
        setexternalConnectionPasscode('')
        setexternalConnectionUrl('')
        // pause()
        ipcRenderer.send('closengrok', 'Session closed successfully')
        setexternalConnectionConnectionEstablished(0)
    };

    const closeConnectNowModal = () => {
        setIsConnectNowModalOpen(false);
    };
    const closeGenerateURLModal = () => {
        setisGenerateURLModalOpen(false);
    };

    const handleShowOutputOption = (e) => {
        e.preventDefault();
        // setActiveItem(itemId);
        if (showoutputOptions) {
            setTimeout(() => {
                setshowoutputOptions(false);
            }, 100);
            return
        }
        const clickX = e.clientX;
        const clickY = e.clientY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const menuW = 200;
        const menuH = 190;

        const posX = clickX + menuW > screenW ? screenW - menuW : clickX;
        const posY = clickY + menuH > screenH ? screenH - menuH : clickY;

        setoutputOptionsPosition({ x: posX, y: posY });
        setshowoutputOptions(true);
    }

    const setngrokUrlf = async (event, contents) => {
        let registrationInfo = contents.registration_info
        const firebaseConfig = {
            apiKey: registrationInfo.firestore_apikey,
            projectId: registrationInfo.firestore_projectid,
            appId: registrationInfo.firestore_appid,
        };

        // Initialize Firebase
        const firestore = getFirestore(initializeApp(firebaseConfig, new Date().toJSON()))
        const ref = collection(firestore, "Remote Connections") // Firebase creates this automatically

        let data = {
            url: contents.url,
            password: contents.password
        }

        try {
            addDoc(ref, data)
        } catch (err) {
            console.log(err)
        }

        setexternalConnectionConnectionEstablished(1)
        setIsVmixStarted(true)
        setexternalConnectionUrl(contents.url)
        setexternalConnectionPasscode(contents.password)
        // start()
        setngrokUrlError('')




    };
    const setngrokUrlErrorf = (event, contents) => {
        setngrokUrlError(contents)
        closeConnectNowModal()
        // setoutputConnectionEstablished(-1)
        toast(<LowerToast status={'error'} message={contents} />, {
            position: "bottom-center",
            autoClose: 300,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            style: { width: "500px", backgroundColor: "#FF3939", textAlign: "left", height: "10px", margin: "auto" }
        });
    };
    const closeNgrokSessionf = (event, contents) => {
        console.log('fff')
        setngrokUrlError(contents)
        reset()
        setexternalConnectionPasscode('')
        setexternalConnectionUrl('')
        closeGenerateURLModal()
        // pause()
        ipcRenderer.send('closengrok', 'Session closed successfully')
        setexternalConnectionConnectionEstablished(0)
        toast(<LowerToast status={'error'} message={contents} />, {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            style: { width: "500px", backgroundColor: "#FF3939", textAlign: "left", height: "10px", margin: "auto" }
        });
        // console.log(contents)
    };
    const setngrokStatusf = (event, contents) => {
        setngrokStatus(contents);
        toast(<LowerToast status={'error'} message={contents} />, {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            style: { width: "20vw", backgroundColor: "#A7FFB5", textAlign: "left", height: "10px", margin: "auto" }
        });
    };



    const outputOptionsRef = useRef(null);




    return (
        <PreviewXOutputContext.Provider value={{
            ngrokUrlError, setngrokUrlError, ngrokStatus, setngrokStatus, outputOptionsPosition, setoutputOptionsPosition, showoutputOptions, setshowoutputOptions, isLive, setisLive, externalConnectionConnectionEstablished, setexternalConnectionConnectionEstablished, externalConnectionPasscode, setexternalConnectionPasscode, externalConnectionUrl, setexternalConnectionUrl, outputConnectionEstablished, setoutputConnectionEstablished, outputConnectionSoftware, setoutputConnectionSoftware, outputPasscode, setoutputPasscode, outputUrl, setoutputUrl, finaloutputLine, setfinaloutputLine, outputLine, setoutputLine, seconds, minutes, hours, days, isRunning, start, pause, reset, copiedToaster, vmixDisconected, isConnectNowModalOpen, setIsConnectNowModalOpen, isGenerateURLModalOpen, setisGenerateURLModalOpen, outputOptionsRef, handleShowOutputOption, closeConnectNowModal, closeGenerateURLModal, reconnectingStatus, setreconnectingStatus, generatereconnectingStatus, setgeneratereconnectingStatus, selectedVmixInputKey, setselectedVmixInputKey, isVmixStarted, setIsVmixStarted, isObsStarted, setIsObsStarted, isLightstreamStarted, setIsLightstreamStarted, isXsplitStarted, setIsXsplitStarted, isVmixExternalConnectionEnabled, setIsVmixExternalConnectionEnabled, isObsExternalConnectionEnabled, setIsObsExternalConnectionEnabled, isLightstreamExternalConnectionEnabled, setIsLightstreamExternalConnectionEnabled, isXsplitExternalConnectionEnabled, setIsXsplitExternalConnectionEnabled, bibleConnections, setbibleConnections, songConnections, setsongConnections
        }}>
            {children}
        </PreviewXOutputContext.Provider>
    )
}