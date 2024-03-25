import React, { useState } from 'react';
import LoginForm from '../../LoginForm';
import { Trash } from 'iconsax-react';
import { useSong } from '../../../context/SongContext';
import { FadeLoader } from 'react-spinners';
const { ipcRenderer } = window.require('electron');

const GeneratingConnectionModal = ({ loading }) => {





    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };


    return (
        loading && (
            <div className="modal" style={{ display: 'flex', position: 'fixed', left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', justifyContent: "center", alignItems: "center", height: "100%", width: "100%", zIndex: "10" }}>
                <div className="modal-content" style={{ backgroundColor: "#000000", width: "25vw", height: "30vh", borderRadius: "4px" }}>
                    <div style={{ marginTop: "32px", marginBottom: "24px" }}>
                        <FadeLoader
                            color={"#fff"}
                            loading={loading}
                            cssOverride={override}
                            size={80}
                            speedMultiplier={0.5}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        // style={{ paddingTop: "32px" }}
                        />

                    </div>
                    <p style={{ fontSize: "12px", fontWeight: "600", paddingLeft: "54px", paddingRight: "54px" }}>Generating Code</p>


                </div>
            </div>
        )
    );
};

export default GeneratingConnectionModal;