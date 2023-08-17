import { useEffect, useRef, useState } from "react";
import CustomContextMenu from "./CustomContextMenu";
import { Trash } from "iconsax-react";
import { useSong } from "../context/SongContext";
const { ipcRenderer } = window.require('electron');



const SongListItem = ({ song, type }) => {

    const { activeId, setactiveId, setactiveLine, deleteBookmark, songDisplayRef } = useSong()


    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
    const [showContextMenu, setShowContextMenu] = useState(false);
    const contextMenuRef = useRef(null);
    const [contextMenuKey, setContextMenuKey] = useState(1);
    const [activeItem, setActiveItem] = useState(null);


    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
                setShowContextMenu(false);
            }
        };

        window.addEventListener('click', handleOutsideClick);

        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    }, []);


    const handleContextMenu = (e) => {
        e.preventDefault();
        if (type === "bookmark") {
            return
        }

        if (showContextMenu) {
            setShowContextMenu(false);
            return
        }

        const newContextMenuKey = contextMenuKey + 1;
        setContextMenuKey(newContextMenuKey);

        const clickX = e.clientX;
        const clickY = e.clientY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const menuW = 180;
        const menuH = 190;

        const posX = clickX + menuW > screenW ? screenW - menuW : clickX;
        const posY = clickY + menuH > screenH ? screenH - menuH : clickY;

        setContextMenuPos({ x: posX, y: posY });
        setShowContextMenu(true);

    };



    const removeBookmark = () => {
        deleteBookmark(song)
    };
    const handleOptionSelect = (option) => {
        setShowContextMenu(false);
    };

    return (
        <div className="SongListItem" style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center", width: "100%", textAlign: "left", marginBottom: "7px", }}>
            <p style={{ listStyleType: "none", fontSize: '12px', fontWeight: "500px", color: activeId == song.uuid ? "#FF3939" : "#B1B1B1", cursor: "pointer" }} onClick={() => {
                setactiveLine(-1);
                setactiveId(song.uuid)
                if (songDisplayRef.current) {
                    songDisplayRef.current.focus()
                }
            }} onContextMenu={handleContextMenu}>{song.title}</p>
            {showContextMenu && (
                <div ref={contextMenuRef} key={contextMenuKey}>
                    <CustomContextMenu
                        posX={contextMenuPos.x}
                        posY={contextMenuPos.y}
                        onOptionSelect={handleOptionSelect}
                        activeSong={song}
                        type={type}
                        setShowContextMenu={setShowContextMenu}
                    // setBody={setBody}
                    // activeSongArray={activeSongArray}
                    // openModal={openModal}
                    // menuEditId={menuEditId}
                    // setmenuEditId={setmenuEditId}
                    // setisDeleteModalOpen={setisDeleteModalOpen}
                    // deleteSong={deleteSong}
                    // setdeleteSong={setdeleteSong}
                    // addBookmark={addBookmark}
                    // setbookmarkOPen={setbookmarkOPen}

                    />
                </div>
            )}

            {
                type === 'bookmark' &&
                <Trash size={16} color={"white"} style={{ marginLeft: "auto", cursor: "pointer", alignSelf: "center", paddingRight: "10px" }} onClick={removeBookmark} />
            }

        </div>
    );
};

export default SongListItem;
