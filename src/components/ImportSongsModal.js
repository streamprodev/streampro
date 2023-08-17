import React, { useState } from 'react';
import LoginForm from './LoginForm';
import { FiUploadCloud } from "react-icons/fi";
import wifi from '../assets/fi_upload-cloud.png';

import BounceLoader from "react-spinners/BounceLoader";
import { useSong } from '../context/SongContext';

const { ipcRenderer } = window.require('electron');

const ImportSongsModal = ({ }) => {

    const { isImportModalOpen, closeImportModal, importing, setimporting } = useSong()


    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };


    const handleSubmit = (e) => {
        ipcRenderer.invoke('open-file-dialog-for-folder').then((filePath) => {
            console.log(filePath)
            if (filePath) {
                setimporting(true)
                filePath.forEach(async (element) => {
                    ipcRenderer.send('list-txt-files', element);
                });

            }
        });
    };


    return (


        isImportModalOpen && (
            <div className="modal" style={{ display: 'block', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="modal-content" style={{ background: '#121212', width: '60%', margin: '100px auto', padding: '20px' }}>
                    <span className="close" onClick={()=>closeImportModal()} style={{ cursor: 'pointer', float: 'right', color: '#FFFFFF', fontSize: '24px' }}>
                        &times;
                    </span>
                    <h2 style={{ color: '#FFFFFF', textAlign: "left", fontSize: '12px', fontWeight: "500px" }}>Import Songs</h2>

                    <div style={{ paddingRight: '100px', paddingLeft: '100px', paddingTop: "70px" }}>

                        <h2 style={{ color: '#FFFFFF', textAlign: "left", fontSize: '12px', fontWeight: "500px" }}>{importing ? "Importing" : "Select Songs"} <span style={{ color: "#FF3939" }}>*</span> </h2>

                        {
                            importing ?
                                <div style={{ height: "255px", width: "100%", borderWidth: "1px", borderStyle: "dashed", borderRadius: "4px", borderColor: "white", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginBottom: "20px", cursor: 'not-allowed' }}>

                                    <BounceLoader
                                        color={"#ffffff"}
                                        loading={importing}
                                        override={override}
                                        size={80}
                                        speedMultiplier={0.5}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                    />

                                </div>
                                :
                                <div style={{ height: "255px", width: "100%", borderWidth: "1px", borderStyle: "dashed", borderRadius: "4px", borderColor: "white", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginBottom: "20px", cursor: 'pointer' }} onClick={handleSubmit}>
                                    <img src={wifi} alt="logo" height={40} />
                                    <span style={{ fontSize: '12px', fontWeight: "500px", color: "white" }}><span style={{ color: "#FF3939" }}>Select Folder </span>  to import songs from</span>
                                    <span style={{ fontSize: '12px', fontWeight: "500px", color: "#B1B1B1" }}>Song must be a .txt file</span>
                                </div>
                        }

                    </div>

                </div>
            </div>
        )

    );
};

export default ImportSongsModal;