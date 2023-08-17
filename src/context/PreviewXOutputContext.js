
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



    const [outputLine, setoutputLine] = useState(null);
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

    const location = useLocation();
    const { selectedBook, setselectedBook, selectedChapter, setselectedChapter, searchVerse, selectedVerseArray, selectActiveVersion } = useBible()

    useEffect(() => {
        ipcRenderer.on('vmixDisconected', vmixDisconected)
        ipcRenderer.on('setngrokUrlError', setngrokUrlErrorf);
        ipcRenderer.on('setngrokUrl', setngrokUrlf);
        ipcRenderer.on('setngrokStatus', setngrokStatusf);
        ipcRenderer.on('closeNgrokSession', closeNgrokSessionf);

        return () => {
            ipcRenderer.removeListener('setngrokUrlError', setngrokUrlErrorf);
            ipcRenderer.removeListener('setngrokUrl', setngrokUrlf);
            ipcRenderer.removeListener('setngrokStatus', setngrokStatusf);
            ipcRenderer.removeListener('closeNgrokSession', closeNgrokSessionf);
            ipcRenderer.removeListener('vmixDisconected', vmixDisconected)
        }
    }, []);




    // useEffect(() => {
    //     ipcRenderer.invoke('fetchHostName').then(setdeviceHostName)

    // }, [])
    // useEffect(() => {
    //     console.log('final', deviceHostName)

    // }, [deviceHostName])

    useEffect(() => {

        if (isLive) {
            setfinaloutputLine(outputLine)
        } else if (outputConnectionEstablished) {
            if (location.pathname == '/main/bible') {

                setTimeout(() => {
                    // delete selectedVerseArray['ref'];
                    const clone = Object.assign({}, selectedVerseArray);
                    delete clone.ref;



                    const data = { outputUrl, outputPasscode, outputLine, selectedVerseArray: clone, selectActiveVersion }

                    ipcRenderer.invoke('sendToVmixBible', data).then(res => { }).catch(err => { console.log(err) })

                }, 0);
                return
            }
            const data = { outputUrl, outputPasscode, outputLine }
            ipcRenderer.invoke('sendToVmix', data).then(res => { }).catch(err => console.log(err))

        }
    }, [outputLine, selectedVerseArray]);

    // useEffect(() => {

    //     if (isLive) {
    //         setfinaloutputLine(outputLine)
    //     } else if (outputConnectionEstablished) {
    //         if (location.pathname == '/main/bible') {
    //             const data = { outputUrl, outputPasscode, outputLine, selectedBook, selectedChapter, searchVerse, selectedVerseArray }

    //             console.log(outputLine, selectedVerseArray)
    //             ipcRenderer.invoke('sendToVmixBible', data).then(res => { }).catch(err => { })
    //             return
    //         }
    //         const data = { outputUrl, outputPasscode, outputLine }
    //         ipcRenderer.invoke('sendToVmix', data).then(res => console.log(res)).catch(err => console.log(err))
    //     }
    // }, [outputLine]);

    useEffect(() => {
        if (location.pathname == '/main/bible') {

            setTimeout(() => {
                // delete selectedVerseArray['ref'];

                const clone = Object.assign({}, selectedVerseArray);
                delete clone.ref;
                const data = { outputUrl, outputPasscode, finaloutputLine, selectedBook, selectedChapter, searchVerse, selectedVerseArray: clone, selectActiveVersion }
                ipcRenderer.invoke('goLiveWBible', data).then(res => { }).catch(err => { console.log(err) })

            }, 0);
            return
        }
        const data = { outputUrl, outputPasscode, finaloutputLine }
        ipcRenderer.invoke('goLiveWSongs', data).then(res => { }).catch(err => { })
    }, [finaloutputLine]);

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

    const vmixDisconected = () => {
        setoutputConnectionEstablished(0)
        setisLive(false)
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
            setshowoutputOptions(false);
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
        setexternalConnectionUrl(contents.url)
        setexternalConnectionPasscode(contents.password)
        start()
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
        setngrokUrlError(contents)
        // console.log(contents)
    };
    const setngrokStatusf = (event, contents) => {
        setngrokStatus(contents);
        toast(<LowerToast status={'error'} message={contents} />, {
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
    };



    const outputOptionsRef = useRef(null);




    return (
        <PreviewXOutputContext.Provider value={{
            ngrokUrlError, setngrokUrlError, ngrokStatus, setngrokStatus, outputOptionsPosition, setoutputOptionsPosition, showoutputOptions, setshowoutputOptions, isLive, setisLive, externalConnectionConnectionEstablished, setexternalConnectionConnectionEstablished, externalConnectionPasscode, setexternalConnectionPasscode, externalConnectionUrl, setexternalConnectionUrl, outputConnectionEstablished, setoutputConnectionEstablished, outputConnectionSoftware, setoutputConnectionSoftware, outputPasscode, setoutputPasscode, outputUrl, setoutputUrl, finaloutputLine, setfinaloutputLine, outputLine, setoutputLine, seconds, minutes, hours, days, isRunning, start, pause, reset, copiedToaster, vmixDisconected, isConnectNowModalOpen, setIsConnectNowModalOpen, isGenerateURLModalOpen, setisGenerateURLModalOpen, outputOptionsRef, handleShowOutputOption, closeConnectNowModal, closeGenerateURLModal
        }}>
            {children}
        </PreviewXOutputContext.Provider>
    )
}