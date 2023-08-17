

import { BookSquare } from 'iconsax-react';
import logo from '../assets/Frame 38.png';
import { PiMusicNote } from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom"
import { usePreviewXOutput } from '../context/PreviewXOutputContext';


const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { setoutputLine } = usePreviewXOutput()

    return (
        <div className="SideBar">
            <img src={logo} alt="logo" width={"125.16px"} style={{ alignSelf: "flex-start", paddingTop: "20px", paddingLeft: "16px", }} />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", paddingLeft: "16px", paddingTop: "80px", }}>
                <div style={{ display: "flex", flexDirection: 'row', justifyContent: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => { setoutputLine(''); navigate("/main/song") }}>
                        <PiMusicNote style={{ paddingRight: "10px" }} size={24} color={location.pathname == "/main/song" ? "#FF3939" : "#ffffff"} />
                        <p style={{ fontSize: "15px", color: location.pathname == "/main/song" ? "#FF3939" : "#ffffff" }}>Songs</p>
                    </div>

                </div>
                <div >
                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => { setoutputLine(''); navigate("/main/bible") }}>
                        <BookSquare style={{ paddingRight: "10px" }} size={24} color={location.pathname == "/main/bible" ? "#FF3939" : "#ffffff"} />
                        <p style={{ fontSize: "15px", color: location.pathname == "/main/bible" ? "#FF3939" : "#ffffff" }}>Bible</p>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default SideBar;
