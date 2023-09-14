import { Bookmark, Copy, Refresh, Setting2 } from 'iconsax-react';
import React, { useEffect, useState } from 'react';
import DeleteSongModal from './DeleteSongModal';
import useContextMenu from '../hooks/useContextMenu';
import { FiWifiOff } from "react-icons/fi";
import { toast } from 'react-toastify';
import LowerToast from './LowerToast';
import { useRegistrationInfo } from '../context/RegistrationInfoContext';
import { useSong } from '../context/SongContext';

const { ipcRenderer } = window.require('electron');

const OutputOptionsMenu = ({ posX, posY, setshowoutputOptions, setoutputConnectionEstablished, setisLive }) => {


    const { songData } = useSong()
    // const { anchorPoint, show } = useContextMenu(type);
    const { showAccountMenu, setshowAccountMenu, showAccountMenuPosition, AccountMenuRef, registrationInfo, getRandomColor } = useRegistrationInfo();

    useEffect(() => {
        console.log(AccountMenuRef)
        console.log(showAccountMenu)
        const handleOutsideClick = (e) => {

            if (AccountMenuRef.current && !AccountMenuRef.current.contains(e.target)) {
                setshowAccountMenu(false);
            }
        };

        window.addEventListener('click', handleOutsideClick);

        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    }, [showAccountMenu,AccountMenuRef]);





    return (

        showAccountMenu &&
        <div ref={AccountMenuRef}
            style={{
                position: 'absolute',
                display: 'flex',
                left: showAccountMenuPosition.x,
                top: showAccountMenuPosition.y,
                background: '#000',
                border: 'none',
                overflow: "scroll",
                borderRadius: "4px",
                zIndex: "2",
                width: "320px",
                height: "312px",
                justifyContent: "center",
                alignItems: "flex-start",


            }}
            className='accountmenu'
        >
            <div style={{
                display: "flex", alignItems: 'center', paddingTop: "40px", justifyContent: "center", flexDirection
                    : "column"
            }}>

                <div style={{ height: "30px", width: "30px", borderRadius: "16px", backgroundColor: registrationInfo.license_owner && getRandomColor(registrationInfo.license_owner).color, fontSize: "20px", marginBottom: "24px", display: "absolute" }} >
                    {registrationInfo?.license_owner && getRandomColor(registrationInfo.license_owner).character}
                    <div style={{ height: "12px", width: "12px", borderRadius: "16px", backgroundColor: registrationInfo.auto_sync == 0 ? "#B1B1B1" : "#3EDB57", fontSize: "20px", display: "flex", alignItems: 'center', justifyContent: "center", position: "relative", top: -8, left: 18 }} >
                        <Refresh size="7" color="#ffffff" />
                    </div>
                </div>

                {/* <p>{registrationInfo?.license_owner_email}</p> */}
                <span style={{ fontSize: "14px", fontWeight: "600" }}>{registrationInfo?.license_owner}</span>
                    <span style={{ fontSize: "14px", fontWeight: "500", color: "#B1B1B1" }}>{registrationInfo?.license_owner_email}</span>

                <div style={{
                    display: "flex", alignItems: 'center', paddingTop: "40px", justifyContent: "center", gap: "4px"
                }}>
                    <div style={{ height: "15px", width: "15px", borderRadius: "16px", backgroundColor: registrationInfo.auto_sync == 0 ? "#B1B1B1" : "#3EDB57", fontSize: "20px", display: "flex", alignItems: 'center', justifyContent: "center" }} >
                        <Refresh size="8" color="#ffffff" />
                    </div>

                    <span style={{ fontSize: "12px", fontWeight: "500", color: "#B1B1B1" }}>{registrationInfo.auto_sync == 0 ? "Sync is off" : "Sync is on"}</span>
                </div>

                <button style={{ width: "138px", height: "30px", backgroundColor: "#FF3939", border: "1px solid #FF3939", borderRadius: "4px", cursor: "pointer", marginTop: "20px", cursor: "pointer" }} onClick={() => {
                    if (registrationInfo.auto_sync == 0) {
                        ipcRenderer.send('enableSync', { registrationInfo: registrationInfo, songData: songData, notified: 0 })
                    } else {
                        ipcRenderer.send('disableSync', { registrationInfo: registrationInfo, songData: songData, notified: 0 })
                    }
                    setshowAccountMenu(false);
                }}>
                    <span style={{ color: "#ffffff", fontSize: "10x", fontWeight: "500" }}>{registrationInfo.auto_sync == 0 ? "Turn on sync" : " Turn off sync"}</span>
                </button>
            </div>
        </div>

    );
};

export default OutputOptionsMenu;
        // <DeleteSongModal isOpen={isModalOpen} onClose={() => closeModal()} song={activeSong} />
