

import { Minus } from 'iconsax-react';
import logo from '../assets/Frame 38.png';
import wifi from '../assets/wifi.png';
import { IoCloseOutline } from "react-icons/io5";
import { PiCopySimpleLight } from "react-icons/pi";
import { FiMinimize2 } from "react-icons/fi";
import minimize from "../assets/titlebar-icons/min-w-10.png";
import maximize from "../assets/titlebar-icons/max-w-10.png";
import close from "../assets/titlebar-icons/close-w-10.png";
const { ipcRenderer } = window.require('electron');


const AppNav = () => {

    return (
        <header id="titlebar">
            <div className="draggable">
                <div className="title">
                    {/* <script>document.write(document.title)</script> */}
                </div>
                <div className="controls">

                    <span className="button minimize" onClick={() => ipcRenderer.invoke('minimize-app')}>
                        <img className="icon" id="max" alt="maximize"
                            src={minimize}
                            draggable="false" />
                    </span>
                    <span className="button maximize" onClick={() => ipcRenderer.invoke('maximize-app')}>

                        <img className="icon" id="max" alt="maximize"
                        src={maximize}
                            draggable="false" />

                    </span>
                    <span className="button close" onClick={() => ipcRenderer.invoke('close-app')}>
                        <img className="icon" id="max" alt="maximize"
                            src={close}
                            draggable="false" />

                    </span>
                </div>


            </div>
        </header>
    )
};

export default AppNav;
