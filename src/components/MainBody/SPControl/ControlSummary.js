import { Edit2 } from 'iconsax-react'
import React, { useEffect } from 'react'
import { TbBrandGooglePlay } from 'react-icons/tb'
import { useEwGrabber } from '../../../context/EwGrabberContext';
import { LuSettings2 } from 'react-icons/lu';

const { ipcRenderer } = window.require('electron');
function ControlSummary() {

    const { isEwGrabberConnected, setIsEwGrabberConnected, ewGrabbedText, setEwGrabberText, ewGrabbedImage, setEwGrabberImage } = useEwGrabber();



    return (
        <div className='controlSummary'>

            <div style={{ overflow: "scroll", height: "100%", width: "100%", marginBottom: "10px", outline: "none", alignItems: "center", display: 'flex', flexDirection: 'column', }}  >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: '70px' }}>
                    <LuSettings2 />
                    <p style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "20px", }}>SP Control</p>

                </div>
                <div style={{ paddingTop: '50px' }}>
                    <p style={{ fontWeight: "400", color: "#B1B1B1", fontSize: "14px", }}>SP Control super charges your live production software.Providing more ways of controlling your live production.</p>
                </div>
                <hr style={{ width: "50%", color: '#B1B1B1', height: '1px' }} />
                <div style={{ padding: "32px 10px" }}>
                    <p style={{ fontWeight: "400", color: "#B1B1B1", fontSize: "14px", fontStyle: 'normal' }}>Click the enable button on any of the supported applications to confirm and establish communication.</p>
                </div>
                <hr style={{ width: "50%", color: '#B1B1B1', height: '1px' }} />
                <div style={{ padding: "32px 10px" }}>
                    <p style={{ fontWeight: "400", color: "#B1B1B1", fontSize: "14px", fontStyle: 'normal' }}> Upon successful connection, a control key is generated.  </p>
                </div>
                <hr style={{ width: "50%", color: '#B1B1B1', height: '1px' }} />
                {/* <div style={{ paddingTop: '43px' }}>

                </div> */}
                <div style={{ padding: "32px 10px" }}>
                    <p style={{ fontWeight: "400", color: "#B1B1B1", fontSize: "14px", fontStyle: 'normal' }}>This will key will be needed for control of your live production</p>
                </div>
            </div>
        </div>
    )
}

export default ControlSummary