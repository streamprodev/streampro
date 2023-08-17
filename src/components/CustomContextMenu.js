import { Bookmark, Edit2, Trash } from 'iconsax-react';
import React, { useEffect, useState } from 'react';
import DeleteSongModal from './DeleteSongModal';
import useContextMenu from '../hooks/useContextMenu';
import { useSong } from '../context/SongContext';

const { ipcRenderer } = window.require('electron');

const CustomContextMenu = ({ activeSong, type, setShowContextMenu }) => {


    const { anchorPoint, show } = useContextMenu(type);
    const { setTitle, setBody, openModal, setmenuEditId, setisDeleteModalOpen, setdeleteSong, addBookmark, setbookmarkOPen } = useSong();



    const openDeleteModal = () => {
        setShowContextMenu(false)
        setdeleteSong(activeSong)
        setisDeleteModalOpen(true);
    };

    return (
        <div
            style={{
                position: 'absolute',
                display: 'block',
                left: anchorPoint.x,
                top: anchorPoint.y,
                background: '#000',
                border: 'none',
                padding: "10px",
                overflow: "scroll",
                borderRadius: "4px"

            }}
        >
            <div style={{ display: "flex", flexDirection: "column", height: "13vh", minWidth: "8vw", alignItems: "flex-start", justifyContent: "space-between", paddingTop: "2vh", paddingBottom: "2vh", paddingLeft: "5px", borderRadius: "4px", gap: "15px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => {
                    setShowContextMenu(false)

                    setTitle(activeSong.title)
                    setBody(activeSong.body)
                    setmenuEditId(activeSong.uuid)
                    openModal(1)
                }}>
                    <span style={{ fontSize: '14px', fontWeight: "500" }}>Edit Song</span>
                    <Edit2 size={14} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => {
                    setShowContextMenu(false)
                    addBookmark(activeSong)
                    setbookmarkOPen(true)
                }}>
                    <span style={{ fontSize: '14px', fontWeight: "500" }}>Bookmark Song</span>
                    <Bookmark size={14} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => {
                    openDeleteModal()
                }}>
                    <span style={{ fontSize: '14px', fontWeight: "500", color: "#FF0E48" }}>Delete Song</span>
                    <Trash size={14} color={"#FF0E48"} />
                </div>
            </div>
        </div>
    );
};

export default CustomContextMenu;
