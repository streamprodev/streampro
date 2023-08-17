

import { BookSquare } from 'iconsax-react';
import logo from '../assets/Frame 38.png';
import { PiMusicNote } from "react-icons/pi";
import wifi from '../assets/fi_upload-cloud.png';
import obs from '../assets/obs.png';
import vmix from '../assets/vmix.png';
import xsplit from '../assets/xsplit.png';
import lightstream from '../assets/lightstream.png';


const SelectStreamPlatform = ({ onClick }) => {

    return (
        <div style={{ paddingRight: '100px', paddingLeft: '100px', paddingTop: "70px" }}>

            <h2 style={{ color: '#FFFFFF', textAlign: "center", fontSize: '24px', fontWeight: "500px" }}>Select Streaming Software </h2>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", flexDirection: "row", marginBottom: "20px", gap: "2vw", paddingTop: "5vh", paddingBottom: "15vh", width: "100%" }}>
                <div onClick={() => onClick('vmix')} style={{ cursor: 'pointer' }}>
                    <img src={vmix} alt="logo" height={120} />
                    <p style={{ fontSize: '14px', fontWeight: "600px" }} >Vmix</p>

                </div>

                <div id="wrapper" onClick={() => { }} style={{ cursor: 'not-allowed' }} title="Coming Soon">
                    <img src={obs} alt="logo" height={120} />
                    <p style={{ fontSize: '14px', fontWeight: "600px" }}>OBS</p>

                </div>

                <div id="wrapper" onClick={() => { }} style={{ cursor: 'not-allowed' }} title="Coming Soon">
                    <img src={xsplit} alt="logo" height={120} />
                    <p style={{ fontSize: '14px', fontWeight: "600px" }} >X Split</p>

                </div>

                <div id="wrapper" onClick={() => { }} style={{ cursor: 'not-allowed' }} title="Coming Soon">
                    <img src={lightstream} alt="logo" height={120} />
                    <p style={{ fontSize: '14px', fontWeight: "600px" }}>Lightstream</p>

                </div>

            </div>

        </div>
    );
};

export default SelectStreamPlatform;
