import React, { useContext, useState, useEffect } from 'react'


import { addDoc, collection, getDocs, query, where, getFirestore } from "@firebase/firestore"
import { initializeApp } from "firebase/app"

import { firestore } from "../firebase_setup/firebase"

import { useRef } from 'react';


const { machineId, machineIdSync } = window.require("node-machine-id");
const { ipcRenderer } = window.require('electron');

export const RegistrationInfoContext = React.createContext({})




export function useRegistrationInfo() { return useContext(RegistrationInfoContext) }

export function RegistrationInfoContextProvider({ children }) {



    const [firebaseInit, setfirebaseInit] = useState({})
    const [firestore, setfirestore] = useState({})
    const [userExists, setuserExists] = useState(-1)
    const [deviceHostName, setdeviceHostName] = useState(null)
    const [registrationInfo, setregistrationInfo] = useState({})
    const [licenseKey, setlicenseKey] = useState(null)
    const [documentId, setdocumentId] = useState(null)
    const [showAccountMenu, setshowAccountMenu] = useState(null)
    const [showAccountMenuPosition, setshowAccountMenuPosition] = useState({})
    const [isNotifySyncModalOpen, setisNotifySyncModalOpen] = useState(false)



    const AccountMenuRef = useRef(null)

    function getRandomColor(name) {
        // get first alphabet in upper case
        const firstAlphabet = name.charAt(0).toLowerCase();

        // get the ASCII code of the character
        const asciiCode = firstAlphabet.charCodeAt(0);

        // number that contains 3 times ASCII value of character -- unique for every alphabet
        const colorNum = asciiCode.toString() + asciiCode.toString() + asciiCode.toString();

        var num = Math.round(0xffffff * parseInt(colorNum));
        var r = num >> 16 & 255;
        var g = num >> 8 & 255;
        var b = num & 255;

        return {
            color: 'rgb(' + r + ', ' + g + ', ' + b + ', 0.3)',
            character: firstAlphabet.toUpperCase()
        };
    }

    useEffect(() => {
        getExistingLicenseDetails()
        ipcRenderer.on('resetRegistrationInfo', resetRegistrationInfof)
        return () => {
            ipcRenderer.removeListener('resetRegistrationInfo', resetRegistrationInfof)
        }
    }, [])

    useEffect(() => {
        if (registrationInfo) {


        }
    }, [registrationInfo])

    const openNotifyModal = () => {
        setisNotifySyncModalOpen(true)
    }




    const getExistingLicenseDetails = () => {
        ipcRenderer.invoke('fetchHostName').then(res => {
            
            setdeviceHostName(res)
            if (res) {
                ipcRenderer.invoke('getRegistrationInfo', res).then((res) => {
                    if (typeof res == 'object' && Object.keys(res).length > 0) {
                        setuserExists(1)
                        setregistrationInfo(res)
                        setlicenseKey(res.license_key)
                    } else {
                        setuserExists(0)
                    }
                })
            }
        })
    }

    const resetRegistrationInfof = (event, info) => {
        setregistrationInfo(info)
        setuserExists(1)
    }

    return (
        <RegistrationInfoContext.Provider value={{ deviceHostName, userExists, setuserExists, registrationInfo, setregistrationInfo, licenseKey, setlicenseKey, documentId, setdocumentId, firestore, firebaseInit, showAccountMenu, setshowAccountMenu, AccountMenuRef, showAccountMenuPosition, setshowAccountMenuPosition, getRandomColor, isNotifySyncModalOpen, setisNotifySyncModalOpen, openNotifyModal }}>
            {children}
        </RegistrationInfoContext.Provider>
    )
}