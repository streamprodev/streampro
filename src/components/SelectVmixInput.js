

import { BookSquare, MirroringScreen, Monitor, Setting4 } from 'iconsax-react';
import logo from '../assets/Frame 38.png';
import { PiMusicNote } from "react-icons/pi";
import wifi from '../assets/fi_upload-cloud.png';
import obs from '../assets/obs.png';
import vmix from '../assets/vmix.png';
import xsplit from '../assets/xsplit.png';
import lightstream from '../assets/lightstream.png';


import XMLParser from 'react-xml-parser';
import { useEffect, useState } from 'react';
import xmlJs from 'xml-js';
import { StyledButton } from './FormComponents';

const SelectVmixInput = ({ setselectedVmixInputKey, onClick }) => {

    const [avalaibleInputs, setavalaibleInputs] = useState([])

    useEffect(() => {
        // results.vmix.inputs[0].input
        var myHeaders = new Headers();
        const base_64 = btoa('outputPasscode' + "STP" + ":" + 'outputPasscode' + "STP")
        myHeaders.append("Authorization", "Basic " + base_64);
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            // headers: myHeaders,
            // mode: "no-cors",
        };
        fetch("http://172.16.1.145:8088/api", requestOptions)
            .then(res => {
                return res.text()
            })
            .then(data => {
                const jsonData = xmlJs.xml2json(data, { compact: true, spaces: 4 });
                console.log(JSON.parse(jsonData).vmix.inputs.input)
                setavalaibleInputs(JSON.parse(jsonData).vmix.inputs.input)
            })
            .catch(err => console.log(err));
    }, []);

    return (

        <div style={{ paddingRight: '100px', paddingLeft: '100px', paddingTop: "20px" }}>

            <h2 style={{ color: '#FFFFFF', textAlign: "center", fontSize: '24px', fontWeight: "500px" }}>Choose Input </h2>
            <p style={{ color: '#B1B1B1', textAlign: "center", fontSize: '14px', fontWeight: "300px", fontStyle: 'italic' }}>Select text input to control from the VMIX Software</p>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row", marginBottom: "20px", gap: "2vw", paddingTop: "5vh", paddingBottom: "15vh", width: "100%" }}>
                <div style={{ cursor: 'pointer' }}>
                    <img src={vmix} alt="logo" height={120} />
                    <div style={{ width: "100%", justifyItems: 'flex-start', paddingBottom: '60px' }}>
                        <p style={{ fontSize: '14px', fontWeight: "600", textAlign: 'left' }} >Choose Input</p>
                        <select id="input-select" name="input-select" style={{ width: "350px", height: '63px', backgroundColor: "#15181C", color: "#FFFFFF", outline: 'none', padding: "0px 10px" }} onChange={(e) => {
                            console.log(e.target.value)
                            setselectedVmixInputKey(e.target.value)
                        }}>
                            {
                                avalaibleInputs.map((input, index) => {
                                    return (
                                        <option value={input['_attributes'].key} key={index}>{input['_text']}</option>
                                    )
                                })
                            }
                        </select>
                        {/* onClick */}
                    </div>

                    <button style={{ width: "164px", height: "53px", backgroundColor: "#FF3939", border: "none", borderRadius: "4px", cursor: "pointer", flex: 1, width: "100%" }} onClick={onClick}>
                        <span style={{ color: "white" }}>{"Done"}</span>
                    </button>

                </div>



            </div>

        </div>
    );
};

export default SelectVmixInput;
