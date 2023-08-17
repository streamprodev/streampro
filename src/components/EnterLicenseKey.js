

import { firestore } from "../firebase_setup/firebase"
import InputMask from 'react-input-mask';
import wifi from '../assets/wifi.png';
import { StyledButton, StyledInputConnect, StyledLabelConnect } from './FormComponents';
import { useRegistrationInfo } from '../context/RegistrationInfoContext';
import { useEffect, useState } from 'react';
import { addDoc, collection, getDocs, query, where } from "@firebase/firestore"
import { toast } from 'react-toastify';
import LowerToast from './LowerToast';
import { useNavigate } from "react-router-dom";

const { ipcRenderer } = window.require('electron');
const { machineIdSync } = window.require("node-machine-id");

const EnterLicenseKey = () => {
    const navigate = useNavigate();

    const { licenseKey, setlicenseKey, registrationInfo, setregistrationInfo, documentId, setdocumentId } = useRegistrationInfo()
    const [licenseKeyPlaceholder, setlicenseKeyPlaceholder] = useState('')
    const [disabled, setdisabled] = useState(true)
    useEffect(() => {
        if (licenseKeyPlaceholder) {
            setlicenseKey(licenseKeyPlaceholder?.replace(/\s/g, ''))
        }
    }, [licenseKeyPlaceholder])

    useEffect(() => {
        if (licenseKey) {
            if (licenseKey.length >= 16) {
                setdisabled(false)
            } else {
                setdisabled(true)
            }
        } else {
            setdisabled(true)
        }

    }, [licenseKey])

    const onChange = (event) => {
        setlicenseKeyPlaceholder(event.target.value);
    }

    const verifyLicenseKey = async () => {
        if (!disabled) {
            setdisabled(true)
            const collection_ref = collection(firestore, 'License Keys')
            const q = query(collection_ref, where("license_key", "==", licenseKey))
            const doc_refs = await getDocs(q);
            // console.log(doc_refs)
            const res = []

            doc_refs.forEach(country => {
                res.push({
                    documentid: country.id,
                    ...country.data()
                })
            })


            if (res.length > 0) {
                const initial = res[0];
                navigate('/main/song')
                ipcRenderer.send('saveRegistrationInfo', initial);
                ipcRenderer.invoke('fetchHostNameOld').then(res => {
                    const ref = collection(firestore, "Registered Devices") // Firebase creates this automatically

                    let data = {
                        license_owner: initial.license_owner,
                        device_id: machineIdSync({ original: true }),
                        device_name: res
                    }

                    try {
                        addDoc(ref, data)
                    } catch (err) {
                        console.log(err)
                    }
                })



            } else {

                toast(<LowerToast status={'error'} message={'License Key not found'} />, {
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
                setdisabled(false)
            }
        }


    }



    return (
        <header className="App-header">
            <div style={{ paddingRight: '10vw', paddingLeft: '10vw', paddingTop: "50px", marginBottom: "20vh" }}>

                <h2 style={{ color: '#ffffff', textAlign: "center", fontSize: '24px', fontWeight: "600" }}>Enter your licence key to get started</h2>

                <StyledLabelConnect style={{ marginTop: "20vh" }}>Enter License Key </StyledLabelConnect>

                <InputMask
                    className='inputMask'
                    mask='**** **** **** ****'
                    maskChar=" "
                    value={licenseKey?.toUpperCase()}
                    onChange={onChange}
                >
                </InputMask>




                <StyledButton type="submit" style={{ marginTop: "10vh", width: "30vw", cursor: disabled ? "not-allowed" : "pointer" }} disabled={disabled} onClick={verifyLicenseKey}>Continue</StyledButton>

            </div>
            <img src={wifi} alt="logo" style={{ position: "absolute", left: "0", bottom: "-10%", height: "100%" }} />
        </header >
    );
};

export default EnterLicenseKey;
