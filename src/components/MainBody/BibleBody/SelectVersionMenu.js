import { Book, Bookmark, Copy, Refresh, Setting2 } from 'iconsax-react';
import React, { useEffect, useState } from 'react';
import { useSong } from '../../../context/SongContext';
import { useRegistrationInfo } from '../../../context/RegistrationInfoContext';
import { useBible } from '../../../context/BibleContext';

const { ipcRenderer } = window.require('electron');

const SelectVersionMenu = () => {


    const { showSelectVersionMenu, setshowSelectVersionMenu, showSelectVersionMenuPosition, setshowSelectVersionMenuPosition, setselectActiveVersion } = useBible()
    // const { anchorPoint, show } = useContextMenu(type);
    const { showAccountMenu, setshowAccountMenu, AccountMenuRef, registrationInfo, getRandomColor } = useRegistrationInfo();

    useEffect(() => {
        const handleOutsideClick = (e) => {

            if (AccountMenuRef.current && !AccountMenuRef.current.contains(e.target)) {
                setshowSelectVersionMenu(false);
            }
        };

        window.addEventListener('click', handleOutsideClick);

        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    }, [showSelectVersionMenu, AccountMenuRef]);


    // console.log(showSelectVersionMenuPosition)


    return (

        showSelectVersionMenu &&
        <div ref={AccountMenuRef}
            style={{
                position: 'absolute',
                display: 'flex',
                left: showSelectVersionMenuPosition.x,
                top: showSelectVersionMenuPosition.y,
                background: '#000',
                border: 'none',
                overflow: "scroll",
                borderRadius: "4px",
                zIndex: "2",
                width: "255px",
                height: "200px",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                paddingLeft: "12px",
                paddingRight: "12px"


            }}
            className='accountmenu'
        >
            <div style={{
                display: "flex", alignItems: 'center', paddingTop: "40px", justifyContent: "flex-start", flexDirection: "column", height: "100%", gap: "24px"
            }}>
                <div className='' style={{ width: "100%", alignItems: "center", textAlign: "left", fontSize: "14px", display: "flex", flexDirection: "row", justifyContent: "space-between", cursor: 'pointer', }} onClick={() => { setselectActiveVersion('kjv'); setshowSelectVersionMenu(false) }}>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Book size="20" color="#d9e3f0" onClick={() => { }} style={{ cursor: 'pointer', paddingRight: "13px" }} />
                        <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>King James Version (KJV)</span>
                    </div>
                </div>
                <div className='' style={{ width: "100%", alignItems: "center", textAlign: "left", fontSize: "14px", display: "flex", flexDirection: "row", justifyContent: "space-between", cursor: 'pointer', }} onClick={() => { setselectActiveVersion('nkjv'); setshowSelectVersionMenu(false) }}>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Book size="20" color="#d9e3f0" onClick={() => { }} style={{ cursor: 'pointer', paddingRight: "13px" }} />
                        <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>New King James Version (NKJV)</span>
                    </div>
                </div>
                    <div className='' style={{ width: "100%", alignItems: "center", textAlign: "left", fontSize: "14px", display: "flex", flexDirection: "row", justifyContent: "space-between",  }} onClick={() => { setselectActiveVersion('niv'); setshowSelectVersionMenu(false) }}>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Book size="20" color="#d9e3f0" onClick={() => { }} style={{ cursor: 'pointer', paddingRight: "13px" }} />
                        <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>New International Version (NIV)</span>
                    </div>
                </div>
                    <div className='' style={{ width: "100%", alignItems: "center", textAlign: "left", fontSize: "14px", display: "flex", flexDirection: "row", justifyContent: "space-between", }} onClick={() => { setselectActiveVersion('amp'); setshowSelectVersionMenu(false) }}>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Book size="20" color="#d9e3f0" onClick={() => { }} style={{ cursor: 'pointer', paddingRight: "13px" }} />
                        <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Amplified Version (AMP)</span>
                    </div>
                </div>
                <div className='' style={{ width: "100%", alignItems: "center", textAlign: "left", fontSize: "14px", display: "flex", flexDirection: "row", justifyContent: "space-between", cursor: 'not-allowed', }} onClick={() => { setshowSelectVersionMenu(false) }}>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Book size="20" color="#d9e3f0" onClick={() => { }} style={{ paddingRight: "13px" }} />
                        <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Christian Standard Bible (CSB)</span>
                    </div>
                </div>

            </div>
        </div>

    );
};

export default SelectVersionMenu;
        // <DeleteSongModal isOpen={isModalOpen} onClose={() => closeModal()} song={activeSong} />
