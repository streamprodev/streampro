import React, { useState } from 'react';
import LoginForm from './LoginForm';
import { Trash } from 'iconsax-react';
import { useSong } from '../context/SongContext';
import { FadeLoader } from 'react-spinners';
const { ipcRenderer } = window.require('electron');

const UpdateDownloadingModal = () => {
    const { isDeleteModalOpen, closeDeleteModal, deleteSong, isUpdateDownloadingModalOpen, setisUpdateDownloadingModalOpen, closisUpdateDownloadingModal } = useSong();

    const [updating, setupdating] = useState(false);


    const handleDelete = () => {
        ipcRenderer.send('update-available-manual', 'download-update');
        console.log('is this working');
        setupdating(true);
        // closisUpdateDownloadingModal()
    }

    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };


    return (
        isUpdateDownloadingModalOpen && (
            <div className="modal" style={{ display: 'flex', position: 'fixed', left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', justifyContent: "center", alignItems: "center", height: "100%", width: "100%", zIndex: "10" }}>
                <div className="modal-content" style={{ backgroundColor: "#000000", width: "25vw", height: "30vh", borderRadius: "4px" }}>
                    {
                        updating ?
                            <div style={{ marginTop: "32px", marginBottom: "24px" }}>
                                <FadeLoader
                                    color={"#fff"}
                                    loading={updating}
                                    cssOverride={override}
                                    size={80}
                                    speedMultiplier={0.5}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                // style={{ paddingTop: "32px" }}
                                />

                            </div>
                            :

                            <Trash size={24} color={"#FF0E48"} style={{ marginTop: "32px", marginBottom: "24px" }} />
                    }
                    {
                        updating ?
                            <p style={{ fontSize: "12px", fontWeight: "600", paddingLeft: "54px", paddingRight: "54px" }}>Download in progress.... The application will be restart once the download is complete.</p>
                            :
                            <p style={{ fontSize: "12px", fontWeight: "600", paddingLeft: "54px", paddingRight: "54px" }}>A new version is available. Click "Yes" to download and restart the application to apply the updates.</p>
                    }
                    <div className="modal-actions" style={{ display: updating ? "none" : "flex", justifyContent: "center", marginTop: "5vh", gap: "45px" }}>
                        <button style={{ width: "6vw", height: "23px", backgroundColor: "#000000", border: "none", borderRadius: "4px", cursor: "pointer", color: "white", fontSize: "12px", fontWeight: "600" }} onClick={closisUpdateDownloadingModal}>No</button>
                        <button style={{ width: "6vw", height: "23px", backgroundColor: "#FF3939", border: "none", borderRadius: "4px", cursor: "pointer" }} onClick={handleDelete}><span style={{ color: "white", fontSize: "12px", fontWeight: "600" }}>Yes</span></button>
                    </div>
                </div>
            </div>
        )
    );
};

export default UpdateDownloadingModal;