import { Bookmark, Copy, Setting2 } from 'iconsax-react';
import React, { useEffect, useState } from 'react';
import DeleteSongModal from './DeleteSongModal';
import useContextMenu from '../hooks/useContextMenu';
import { FiWifiOff } from "react-icons/fi";
import { toast } from 'react-toastify';
import LowerToast from './LowerToast';

const { ipcRenderer } = window.require('electron');

const OutputOptionsMenu = ({ posX, posY, setshowoutputOptions, setoutputConnectionEstablished, setisLive, setreconnectingStatus, showoutputOptions, outputOptionsRef, iconRef }) => {

    // const { anchorPoint, show } = useContextMenu(type);


    useEffect(() => {
        const handleOutsideClick = (e) => {

            if (outputOptionsRef.current && !outputOptionsRef.current.contains(e.target) && !iconRef.current.contains(e.target)) {
                setshowoutputOptions(false);
            }
        };

        setTimeout(() => {

        }, 100);
        window.addEventListener('click', handleOutsideClick);

        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    }, []);



    return (
        <div
            style={{
                position: 'absolute',
                display: 'block',
                left: posX,
                top: posY,
                background: '#000',
                border: 'none',
                padding: "10px",
                overflow: "scroll",
                borderRadius: "4px"

            }}
        >
            <div style={{ display: "flex", flexDirection: "column", height: "13vh", minWidth: "8vw", alignItems: "flex-start", justifyContent: "space-between", paddingTop: "2vh", paddingBottom: "2vh", paddingLeft: "5px", borderRadius: "4px", gap: "15px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => {
                    setshowoutputOptions(false)


                }}>
                    <span style={{ fontSize: '14px', fontWeight: "500" }}>Output Settings</span>
                    <Setting2 size={14} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => {
                    setshowoutputOptions(false)

                    // ipcRenderer.send('singleBookmark', { id: activeSong.id })
                }}>
                    <span style={{ fontSize: '14px', fontWeight: "500" }}>Duplicate</span>
                    <Copy size={14} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => {
                    setoutputConnectionEstablished(0)
                    setisLive(false)
                    setshowoutputOptions(false)
                    setreconnectingStatus(false)
                    ipcRenderer.send('stopOutputConnectionCheck', 'Session closed successfully')

                    toast(<LowerToast status={'success'} message={'Connection closed!'} />, {
                        position: "bottom-center",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        style: { width: "500px", height: "20px", backgroundColor: "#A7FFB5", textAlign: "left" }
                    });
                }}>
                    <span style={{ fontSize: '14px', fontWeight: "500", color: "#FF0E48" }}>Disconnect output</span>
                    <FiWifiOff size={14} color={"#FF0E48"} />
                </div>
            </div>
        </div>
    );
};

export default OutputOptionsMenu;
        // <DeleteSongModal isOpen={isModalOpen} onClose={() => closeModal()} song={activeSong} />
