import { Bookmark, Copy, Edit2, Trash } from 'iconsax-react';
import React, { useEffect, useState } from 'react';
import { useBible } from '../../../context/BibleContext';
import useContextMenu from '../../../hooks/useContextMenu';
import { usePreviewXOutput } from '../../../context/PreviewXOutputContext';

const { ipcRenderer } = window.require('electron');

const CustomContextMenu = ({ line }) => {
    // console.log(line)


    const { anchorPoint, show } = useContextMenu("bible");

    const { showBookmarkContext, setshowBookmarkContext, addBookmark, selectedLine, setselectedLine } = useBible();
    const { copiedToaster } = usePreviewXOutput();





    return (
        <>
            {
                showBookmarkContext &&
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
                        borderRadius: "4px",
                        zIndex: "5"

                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", height: "60px", minWidth: "8vw", alignItems: "flex-start", justifyContent: "space-between", paddingTop: "2vh", paddingBottom: "2vh", paddingLeft: "5px", borderRadius: "4px", gap: "5px" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => {
                            addBookmark(selectedLine)
                            setshowBookmarkContext(false)
                            setselectedLine({})
                        }}>
                            <span style={{ fontSize: '14px', fontWeight: "500" }}>Bookmark Verse</span>
                            <Bookmark size={14} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => {
                            navigator.clipboard.writeText(selectedLine.text);
                            copiedToaster()
                            setshowBookmarkContext(false)
                            setselectedLine({})
                        }}>
                            <span style={{ fontSize: '14px', fontWeight: "500" }}>Copy to Clipboard</span>
                            <Copy size="14" color="#FFFFFF" style={{ cursor: "pointer" }} />
                        </div>

                    </div>
                </div>
            }
        </>
    );
};

export default CustomContextMenu;
