

import { BookSquare } from 'iconsax-react';
import logo from '../assets/Frame 38.png';
import logo2 from '../assets/wifi-logo3.png';
import { PiMusicNote } from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom"
import { usePreviewXOutput } from '../context/PreviewXOutputContext';
import { useBible } from '../context/BibleContext';


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
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", paddingLeft: "16px", paddingTop: expandedView ? "83px" : "80px", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: 'row', justifyContent: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => { setoutputLine(''); navigate("/main/song") }}>
                        <PiMusicNote style={{ paddingRight: "10px" }} size={24} color={(location.pathname == "/main/song" || location.pathname == "/main/all-song") ? "#FF3939" : "#ffffff"} />
                        {
                            !expandedView &&
                            <span style={{ fontSize: "15px", color: (location.pathname == "/main/song" || location.pathname == "/main/all-song") ? "#FF3939" : "#ffffff" }}>Songs</span>
                        }
                    </div>

                </div>
                <div >
                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => { setoutputLine(''); navigate("/main/bible") }}>
                        <BookSquare style={{ paddingRight: "10px" }} size={24} color={location.pathname == "/main/bible" ? "#FF3939" : "#ffffff"} />
                        {
                            !expandedView &&
                            <span style={{ fontSize: "15px", color: location.pathname == "/main/bible" ? "#FF3939" : "#ffffff" }}>Bible</span>
                        }
                    </div>
                </div>
            </div>


        </div>
    );
};

export default SideBar;
