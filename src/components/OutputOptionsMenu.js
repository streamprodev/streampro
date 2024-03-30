import { Add, Bookmark, Copy, Setting2 } from 'iconsax-react';
import React, { useEffect, useState } from 'react';
import DeleteSongModal from './DeleteSongModal';
import useContextMenu from '../hooks/useContextMenu';
import { FiWifiOff } from "react-icons/fi";
import { toast } from 'react-toastify';
import LowerToast from './LowerToast';
import { usePreviewXOutput } from '../context/PreviewXOutputContext';
import { useLocation } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

const OutputOptionsMenu = ({ posX, posY, setshowoutputOptions, setoutputConnectionEstablished, setisLive, setreconnectingStatus, showoutputOptions, outputOptionsRef, iconRef, setIsConnectNowModalOpen, isCurrentNowEdit, setisCurrentNowEdit, activeCarousel, setselectedSlide }) => {

    const { currentEditUuid, setcurrentEditUuid, bibleConnections, setbibleConnections, outputPathname, setactiveCarousel } = usePreviewXOutput();
    // const { anchorPoint, show } = useContextMennu(type);

    const location = useLocation();


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
                borderRadius: "4px",
                width: '150px'

            }}
        >
            <div style={{ display: "flex", flexDirection: "column", height: "13vh", minWidth: "8vw", alignItems: "flex-start", justifyContent: "space-between", paddingTop: "2vh", paddingBottom: "2vh", paddingLeft: "5px", borderRadius: "4px", gap: "15px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => {
                    setcurrentEditUuid(activeCarousel[outputPathname])
                    setshowoutputOptions(false)
                    setisCurrentNowEdit(true)
                    setIsConnectNowModalOpen(true)
                    ipcRenderer.send('getavalaibleVmixInputsInitiate', activeCarousel[outputPathname]);


                }}>
                    <Setting2 size={14} />
                    <span style={{ fontSize: '12px', fontWeight: "500" }}>Output Settings</span>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => {
                    setshowoutputOptions(false)
                    setIsConnectNowModalOpen(true)

                    // ipcRenderer.send('singleBookmark', { id: activeSong.id })
                }}>
                    <Add size={17} />
                    <span style={{ fontSize: '12px', fontWeight: "500" }}>Add New Output</span>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => {
                    const currentLocationConnections = bibleConnections.filter(x => x.key)
                    const removeKey = (activeCarousel[outputPathname]).uuid
                    console.log(bibleConnections.filter(x => x.uuid != removeKey))
                    // console.log(removeKey, bibleConnections)
                    setbibleConnections(prev => prev.filter(x => x.uuid != removeKey))
                    setshowoutputOptions(false)

                    if (currentLocationConnections.length == 1) {
                        setoutputConnectionEstablished(0)
                        setisLive(false)
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

                    } else {
                        setselectedSlide(prev => prev + 1)

                        // setactiveCarousel(prev => {
                        //     console.log(bibleConnections.find(x => x.key._attributes.key == removeKey))
                        //     return { ...prev, [outputPathname]: bibleConnections.find(x => x.key._attributes.key != removeKey) }
                        // })
                    }

                }}>
                    <FiWifiOff size={14} color={"#FF0E48"} />
                    <span style={{ fontSize: '12px', fontWeight: "500", color: "#FF0E48" }}>Disconnect output</span>
                </div>
            </div>
        </div>
    );
};

export default OutputOptionsMenu;
// <DeleteSongModal isOpen={isModalOpen} onClose={() => closeModal()} song={activeSong} />
