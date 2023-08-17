

import { BookSquare, Monitor } from 'iconsax-react';
import logo from '../assets/Frame 38.png';
import { PiMusicNote } from "react-icons/pi";
import wifi from '../assets/fi_upload-cloud.png';
import twitch from '../assets/twitch.png';
import vmix from '../assets/vmix.png';
import YT from '../assets/YT.png';
import unscreen from '../assets/unscreen.png';
import { ArrowLeft, Wifi } from 'iconsax-react';


const SetConnectionMode = ({ onClick, onClickBack }) => {

    return (
        <>
            <ArrowLeft size="24" color="#ffffff" style={{ textAlign: "left", float: "left", cursor: "pointer", }} onClick={onClickBack}/>
            <div style={{ paddingRight: '10vw', paddingLeft: '10vw', paddingTop: "70px", marginBottom: "20vh" }}>

                <h2 style={{ color: '#FFFFFF', textAlign: "center", fontSize: '24px', fontWeight: "500px" }}>Choose connection mode </h2>

                <div style={{ display: "flex", justifyContent: "flex-Start", alignItems: "flex-start", flexDirection: "row", marginBottom: "20px", gap: "1vw", paddingTop: "2.5vh", paddingBottom: "2.5vh", backgroundColor: "#15181C", paddingLeft: "6vh", marginTop: "5vh", cursor: "pointer" }} onClick={() => onClick('local')}>
                    <Monitor size="32" color="#ffffff" style={{paddingTop:"5px"}}/>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: "8px" }}>
                        <span style={{ textAlign: "left", fontSize: "24px", fontWeight: "600px" }}>Locally</span>
                        <span style={{ textAlign: "left", fontSize: "14px" }}>Connect to streaming software on this system</span>
                    </div>

                </div>
                <div style={{ display: "flex", justifyContent: "flex-Start", alignItems: "flex-start", flexDirection: "row", marginBottom: "20px", gap: "1vw", paddingTop: "2.5vh", paddingBottom: "2.5vh", backgroundColor: "#15181C", paddingLeft: "5vh", cursor: "pointer" }} onClick={() => onClick('remote')}>
                    <Wifi size="32" color="#ffffff" style={{ paddingTop: "5px" }} />
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: "8px" }}>
                        <span style={{ textAlign: "left", fontSize: "24px", fontWeight: "600px" }}>Remotely</span>
                        <span style={{ textAlign: "left", fontSize: "14px" }}>Connect to streaming software on another system</span>
                    </div>
                </div>

            </div>
        </>
    );
};

export default SetConnectionMode;
