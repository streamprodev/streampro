

import { BookSquare } from 'iconsax-react';
import logo from '../assets/Frame 38.png';
import logo2 from '../assets/wifi-logo3.png';
import { PiMusicNote } from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom"
import { usePreviewXOutput } from '../context/PreviewXOutputContext';
import { useBible } from '../context/BibleContext';
import { LuSettings2 } from "react-icons/lu";
import { TbBrandGooglePlay } from "react-icons/tb";


const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { setoutputLine } = usePreviewXOutput()
    const { expandedView, setexpandedView } = useBible()



    return (
        <div className="SideBar" style={{ width: expandedView ? "50px" : "191px" }}>
            {
                expandedView ?
                    <img src={logo2} alt="logo" width={"24px"} style={{ alignSelf: "flex-start", paddingTop: "20px", paddingLeft: "16px", }} />
                    :
                    <img src={logo} alt="logo" width={"125.16px"} style={{ alignSelf: "flex-start", paddingTop: "20px", paddingLeft: "16px", }} />
            }
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", paddingLeft: "16px", paddingTop: expandedView ? "83px" : "80px", gap: "35px" }}>
                <div style={{ display: "flex", flexDirection: 'row', justifyContent: "center", }}>
                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => { navigate("/main/sp-control") }}>
                        <LuSettings2 style={{ paddingRight: "10px" }} size={24} color={(location.pathname == "/main/sp-control") ? "#FF3939" : "#B1B1B1"} />
                        {
                            !expandedView &&
                            <span style={{ fontSize: "15px", fontWeight: "600", color: (location.pathname == "/main/sp-control") ? "#FF3939" : "#B1B1B1" }}>SP Control</span>
                        }
                    </div>

                </div>
                {/* <hr style={{ width: "80%", color: '#B1B1B1', height: "0.4px", borderTop: "0.4px solid #B1B1B1" }} /> */}
                <div style={{ borderTop: "0.4px solid #B1B1B1", width: "90%" }}></div>
                <div style={{ display: "flex", flexDirection: 'row', justifyContent: "center", }}>
                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => { navigate("/main/song") }}>
                        <PiMusicNote style={{ paddingRight: "10px" }} size={24} color={(location.pathname == "/main/song" || location.pathname == "/main/all-song") ? "#FF3939" : "#B1B1B1"} />
                        {
                            !expandedView &&
                            <span style={{ fontSize: "15px", fontWeight: "600", color: (location.pathname == "/main/song" || location.pathname == "/main/all-song") ? "#FF3939" : "#B1B1B1" }}>Songs</span>
                        }
                    </div>

                </div>
                <div style={{}} >
                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => { setoutputLine(''); navigate("/main/bible") }}>
                        <BookSquare style={{ paddingRight: "10px" }} size={24} color={location.pathname == "/main/bible" ? "#FF3939" : "#B1B1B1"} />
                        {
                            !expandedView &&
                            <span style={{ fontSize: "15px", fontWeight: "600", color: location.pathname == "/main/bible" ? "#FF3939" : "#B1B1B1" }}>Bible</span>
                        }
                    </div>
                </div>
                <div style={{ borderTop: "0.4px solid #B1B1B1", width: "90%" }}></div>
                {/* <hr style={{ width: "80%", color: '#B1B1B1', height: "0.4px" }} /> */}
                <div style={{}} >
                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => { setoutputLine(''); navigate("/main/ew-graber") }}>
                        <TbBrandGooglePlay style={{ paddingRight: "10px" }} size={24} color={location.pathname == "/main/ew-graber" ? "#FF3939" : "#B1B1B1"} />
                        {
                            !expandedView &&
                            <span style={{ fontSize: "15px", fontWeight: "600", color: location.pathname == "/main/ew-graber" ? "#FF3939" : "#B1B1B1" }}>EW Grabber</span>
                        }
                    </div>
                </div>
            </div>


        </div>
    );
};

export default SideBar;
