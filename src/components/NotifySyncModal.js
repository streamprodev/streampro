import React, { useState } from 'react';
import LoginForm from './LoginForm';
import { Trash } from 'iconsax-react';
import { useSong } from '../context/SongContext';
import { useRegistrationInfo } from '../context/RegistrationInfoContext';
const { ipcRenderer } = window.require('electron');

const NotifySyncModal = ({ isNotifySyncModalOpen, closeNotifyModal, handleDelete }) => {

    const { songData } = useSong()
    const { registrationInfo } = useRegistrationInfo()





    return (
        isNotifySyncModalOpen && (
            <div className="modal" style={{ display: 'flex', position: 'fixed', left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', justifyContent: "center", alignItems: "center", height: "100%", width: "100%", zIndex: "10" }}>
                <div className="modal-content" style={{ backgroundColor: "#000000", width: "25vw", height: "35vh", borderRadius: "4px" }}>
                    <Trash size={24} color={"#FF0E48"} style={{ marginTop: "32px", marginBottom: "24px" }} />
                    <p style={{ fontSize: "12px", fontWeight: "600", paddingLeft: "54px", paddingRight: "54px" }}>Enabling auto sync will delete all your local songs. would you like to proceed? </p>
                    <div className="modal-actions" style={{ display: "flex", justifyContent: "center", marginTop: "5vh", gap: "45px" }}>
                        <button style={{ width: "6vw", height: "23px", backgroundColor: "#000000", border: "none", borderRadius: "4px", cursor: "pointer", color: "white", fontSize: "12px", fontWeight: "600" }} onClick={closeNotifyModal}>No</button>
                        <button style={{ width: "6vw", height: "23px", backgroundColor: "#FF3939", border: "none", borderRadius: "4px", cursor: "pointer" }} onClick={handleDelete}><span style={{ color: "white", fontSize: "12px", fontWeight: "600" }}>Yes</span></button>
                    </div>
                </div>
            </div>
        )
    );
};

export default NotifySyncModal;