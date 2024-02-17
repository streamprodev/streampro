import { Edit2 } from 'iconsax-react'
import React, { useEffect } from 'react'
import { TbBrandGooglePlay } from 'react-icons/tb'
import { useEwGrabber } from '../../../context/EwGrabberContext';

const { ipcRenderer } = window.require('electron');
function ControlBoard() {

    const { isEwGrabberConnected, setIsEwGrabberConnected, ewGrabbedText, setEwGrabberText, ewGrabbedImage, setEwGrabberImage } = useEwGrabber();



    return (
        <div className='controlBoard'>

            <div style={{ overflow: "scroll", height: "100%", width: "100%", marginBottom: "10px", outline: "none", alignItems: "center", display: 'flex', flexDirection: 'column', }} tabIndex="-1" >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <TbBrandGooglePlay />
                    <p>EW Grabber</p>

                </div>
                <div>
                    <p>Easy worhsip Grabber running, turn off to stop.</p>
                </div>
                <div>
                    {
                        isEwGrabberConnected ? <button style={{ width: "164px", height: "63px", backgroundColor: "#FF3939", border: "none", borderRadius: "4px", cursor: "pointer", flex: 1 }} onClick={() => {
                            setIsEwGrabberConnected(false)
                        }}>
                            <span style={{ color: "white" }}>Turn OFF</span>
                        </button>
                            :
                            <button style={{ width: "164px", height: "63px", backgroundColor: "#3EDB57", border: "none", borderRadius: "4px", cursor: "pointer", flex: 1 }} onClick={() => {
                                ipcRenderer.send('activateEwGrabber', 'initial');
                                setIsEwGrabberConnected(true)
                            }}>
                                <span style={{ color: "white" }}>Turn ON</span>
                            </button>

                    }

                </div>
                <div>
                    <p>Select Monitor 3 as your output on your easy worship and all output on easy worship will appear here</p>
                </div>
            </div>
        </div>
    )
}

export default ControlBoard