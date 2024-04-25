

import { useState } from 'react';
import logo from '../assets/Frame 38.png';
import wifi from '../assets/wifi.png';
import { useRegistrationInfo } from '../context/RegistrationInfoContext';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { addDoc, collection, getDocs, query, where } from "@firebase/firestore"
import { firestore } from "../firebase_setup/firebase"
const { ipcRenderer } = window.require('electron');


const Splash = () => {
    const navigate = useNavigate();

    const [showSplash, setShowSplash] = useState(true);
    const { userExists, registrationInfo } = useRegistrationInfo();

    useEffect(() => {
        setTimeout(() => {
            if (userExists === 1) {
                navigate('/main/song')
                updatRegistrationInfo(registrationInfo)

            } else if (userExists === 0) {
                navigate('/register')

            }
        }, 2500)
    }, [userExists])
    const updatRegistrationInfo = async (registrationInfo) => {
        // const collection_ref = collection(firestore, 'License Keys')

        // console.log(registrationInfo)
        // console.log(collection_ref)
        // const q = query(collection_ref, where("license_key", "==", registrationInfo.licenseKey))
        // const doc_refs = await getDocs(q);
        // const res = []

        // doc_refs.forEach(country => {
        //     res.push({
        //         documentid: country.id,
        //         ...country.data()
        //     })
        // })
        ipcRenderer.send('updateRegistrationInfo', registrationInfo);


        // if (res.length > 0) {
        //     const initial = res[0];
        //     console.log(initial)
        //     // ipcRenderer.invoke('fetchHostNameOld').then(res => {
        //         //     const ref = collection(firestore, "Registered Devices") // Firebase creates this automatically

        //         //     let data = {
        //             //         license_owner: initial.license_owner,
        //             //         device_id: machineIdSync({ original: true }),
        //             //         device_name: res
        //     //     }

        //     //     try {
        //     //         addDoc(ref, data)
        //     //     } catch (err) {
        //     //         console.log(err)
        //     //     }
        //     // })
        // }

    }


    return (
        <header className="App-header">
            <img src={logo} alt="logo" width={"700vw"} />
            <img src={wifi} alt="logo" style={{ position: "absolute", left: "0", bottom: "15%", height: "60%" }} />
        </header>
    );
};

export default Splash;
