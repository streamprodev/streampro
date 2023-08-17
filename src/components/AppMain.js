
import { useEffect, useMemo, useState, useRef } from 'react';
import '../App.css';
import Splash from './Splash';
import { BrowserRouter, Routes, Route } from "react-router-dom";


import MainBody from './MainBody/MainBody';
import { useRegistrationInfo } from '../context/RegistrationInfoContext';
import EnterLicenseKey from './EnterLicenseKey';
// const icmp = window.require('ping'); 
const { ipcRenderer } = window.require('electron');

function AppMain() {
    const [showSplash, setShowSplash] = useState(true);
    const { userExists } = useRegistrationInfo()



    useEffect(() => {
        setTimeout(() => {
            if (userExists === 1){
                setShowSplash('main')
                
            } else if (userExists === 0){
                setShowSplash('register')

            }
        }, 2500)
    }, [userExists])

    useEffect(() => {

        setTimeout(() => {
            setShowSplash(false)
        }, 2500)
    }, [])




    return (
        <div className="App">
            {showSplash === true && <Splash /> }
            {showSplash === 'main' && <MainBody /> }
            {showSplash === 'register' && <EnterLicenseKey showSplash={showSplash} setShowSplash={setShowSplash}/> }
            {/* <MainBody /> */}
        </div >
    );
}

export default AppMain;

