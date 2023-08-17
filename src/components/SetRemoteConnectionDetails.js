

import { BookSquare } from 'iconsax-react';
import logo from '../assets/Frame 38.png';
import { PiMusicNote } from "react-icons/pi";
import wifi from '../assets/fi_upload-cloud.png';
import twitch from '../assets/twitch.png';
import vmix from '../assets/vmix.png';
import YT from '../assets/YT.png';
import unscreen from '../assets/unscreen.png';
import { ArrowLeft, Wifi } from 'iconsax-react';
import { StyledLabelConnect, StyledInputConnect, StyledButton } from './FormComponents';
import { useState } from 'react';
import OtpInput from 'react-otp-input';


const SetRemoteConnectionDetails = ({ onClick, url, setUrl, passCode, setPasscode, onClickBack }) => {
    const [errors, setErrors] = useState({});

    return (
        <>
            <ArrowLeft size="24" color="#ffffff" style={{ textAlign: "left", float: "left", cursor: "pointer" }} onClick={onClickBack} />
            <div style={{ paddingRight: '10vw', paddingLeft: '10vw', paddingTop: "50px", marginBottom: "20vh" }}>

                <h2 style={{ color: '#FFFFFF', textAlign: "center", fontSize: '24px', fontWeight: "500" }}>Remote Connection </h2>
                <h2 style={{ color: '#b1b1b1', textAlign: "center", fontSize: '14px', fontWeight: "600" }}>Please enter your StreamPro generated connection code </h2>

                {/* <StyledLabelConnect >Enter URL </StyledLabelConnect>
                <StyledInputConnect type="text" onChange={e => setUrl(e.target.value)} /> */}

                {/* <StyledLabelConnect style={{ marginTop: "24px" }}>Enter Passcode </StyledLabelConnect>
                <StyledInputConnect type="text" onChange={e => setPasscode(e.target.value)} /> */}
                <div style={{display:'flex',justifyContent:"center"}}>

                <OtpInput
                    value={passCode}
                    onChange={setPasscode}
                    numInputs={5}
                    renderSeparator={<span style={{ margin: "0px 4px" }}></span>}
                    inputStyle={{ height: "50px", width: "50px",border:"1px solid #B1B1B1",backgroundColor:"#15181C",borderRadius:"4px",fontSize:"25px",color:"#ffffff",fontWeight:"600" }}
                    renderInput={(props) => <input {...props} />}
                    inputType='text'
                    shouldAutoFocus
                    containerStyle={{ marginTop: "10vh" }}
                />

                </div>


                <StyledButton type="submit" style={{ marginTop: "10vh" }} disabled={ (!passCode || passCode.length < 5)} onClick={onClick}>Connect</StyledButton>

            </div>
        </>
    );
};

export default SetRemoteConnectionDetails;
