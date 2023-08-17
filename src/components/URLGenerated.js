

import { BookSquare, Copy } from 'iconsax-react';
import logo from '../assets/Frame 38.png';
import { PiMusicNote } from "react-icons/pi";
import wifi from '../assets/fi_upload-cloud.png';
import twitch from '../assets/twitch.png';
import vmix from '../assets/vmix.png';
import YT from '../assets/YT.png';
import unscreen from '../assets/unscreen.png';
import { ArrowLeft, Wifi } from 'iconsax-react';
import { StyledLabelConnect, StyledInputConnect, StyledButton, StyledTextInputURL, StyledInputURL, LogoWrapper2 } from './FormComponents';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import LowerToast from './LowerToast';
import BounceLoader from "react-spinners/BounceLoader";


const URLGenerated = ({ onClick, url, setUrl, passCode, setPasscode, onClickBack, externalConnectionConnectionEstablished }) => {
    const [errors, setErrors] = useState({});
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#ffffff");

    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };

    useEffect(() => {
        if (externalConnectionConnectionEstablished === 0) {
            setLoading(true)
        } else {
            setLoading(false)
        }
    }, [externalConnectionConnectionEstablished])



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

    return (
        <>
            <div style={{ paddingRight: '10vw', paddingLeft: '10vw', paddingTop: "70px", marginBottom: "20vh" }}>

                <h2 style={{ color: '#FFFFFF', textAlign: "center", fontSize: '24px', fontWeight: "500px", marginBottom: "5vh" }}>{externalConnectionConnectionEstablished == 1 ? "Code Generated" : "Generating Code"} </h2>

                {/* <>
                    <StyledLabelConnect >URL </StyledLabelConnect>

                    <StyledTextInputURL>
                        <StyledInputURL type="text" onChange={e => setUrl(e.target.value)} disabled={true} value={url} />
                        <LogoWrapper2>
                            <Copy size="24" color="#FFFFFF" onClick={() => {
                                navigator.clipboard.writeText(url);
                                copiedToaster()
                            }} style={{ cursor: "pointer" }} />
                        </LogoWrapper2>
                    </StyledTextInputURL>

                    <StyledLabelConnect style={{ marginTop: "24px" }}>Passcode </StyledLabelConnect>


                    <StyledTextInputURL>
                        <StyledInputURL type="text" onChange={e => setPasscode(e.target.value)} disabled={true} value={passCode} />
                        <LogoWrapper2>
                            <Copy size="24" color="#FFFFFF" onClick={() => {
                                navigator.clipboard.writeText(passCode);
                                copiedToaster()
                            }} style={{ cursor: "pointer" }} />
                        </LogoWrapper2>
                    </StyledTextInputURL>
                </> */}

                {
                    loading ?
                        <BounceLoader
                            color={color}
                            loading={loading}
                            cssOverride={override}
                            size={80}
                            speedMultiplier={0.5}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                        :
                        <>
                            {/* <StyledLabelConnect >URL </StyledLabelConnect>

                            <StyledTextInputURL>
                                <StyledInputURL type="text" onChange={e => setUrl(e.target.value)} disabled={true} value={url} />
                                <LogoWrapper2>
                                    <Copy size="24" color="#FFFFFF" onClick={() => {
                                        navigator.clipboard.writeText(url);
                                        copiedToaster()
                                    }} style={{ cursor: "pointer" }} />
                                </LogoWrapper2>
                            </StyledTextInputURL> */}

                            <div style={{ display: "flex",justifyContent:"center",alignItems:"center",gap:"34px" }}>
                                <h2 style={{ color: '#FFFFFF', textAlign: "center", fontSize: '60px', fontWeight: "500px",letterSpacing:"2vh" }}>{externalConnectionConnectionEstablished == 1 ? passCode : ""} </h2>
                                <Copy size="39" color="#FFFFFF" onClick={() => {
                                    navigator.clipboard.writeText(passCode);
                                    copiedToaster()
                                }} style={{ cursor: "pointer" }} />

                            </div>

                            {/* <StyledLabelConnect style={{ marginTop: "24px" }}>Passcode </StyledLabelConnect>


                            <StyledTextInputURL>
                                <StyledInputURL type="text" onChange={e => setPasscode(e.target.value)} disabled={true} value={passCode} />
                                <LogoWrapper2>
                                    <Copy size="24" color="#FFFFFF" onClick={() => {
                                        navigator.clipboard.writeText(passCode);
                                        copiedToaster()
                                    }} style={{ cursor: "pointer" }} />
                                </LogoWrapper2>
                            </StyledTextInputURL> */}
                        </>
                }


                <h2 style={{ color: '#FFFFFF', textAlign: "center", fontSize: '14px', fontWeight: "400", marginTop: "5vh" }}>{externalConnectionConnectionEstablished === 0 ? "Loading....." : "Copy this Passcode and use in StreamPRO on the remote system"}</h2>

            </div>
        </>
    );
};

export default URLGenerated;

// <StyledInputConnect type="text" onChange={e => setPasscode(e.target.value)} disabled={true} value={passCode} />
// <StyledInputConnect type="text" onChange={e => setUrl(e.target.value)} disabled={true} value={url} />
// W76I12https://981a-102-67-1-5.ngrok-free.app
