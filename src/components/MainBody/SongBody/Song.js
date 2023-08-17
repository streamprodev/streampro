
import { useEffect, useMemo, useState, useRef } from 'react';
import SideBar from '../../SideBar';
import CreateSongModal from '../../CreateSongModal';
import { Copy, Edit2, ProfileCircle, SearchNormal, Setting2, ArrowDown2, ArrowUp2 } from 'iconsax-react';
import ImportSongsModal from '../../ImportSongsModal';
import SongListItem from '../../SongListItem';
import MiniSearch from 'minisearch'
import LyricsLine from '../../LyricsLine';
import EditSongModal from '../../EditSongModal';
import ConnectNowModal from '../../ConnectNowModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LowerToast from '../../LowerToast';
import { useStopwatch } from 'react-timer-hook';
import GenerateURLModal from '../../GenerateURLModal';
import DeleteSongModal from '../../DeleteSongModal';
import { addDoc, collection } from "@firebase/firestore"
import { firestore } from "../../../firebase_setup/firebase"
import { SlOptionsVertical } from "react-icons/sl";
import OutputOptionsMenu from '../../OutputOptionsMenu';
import NavBar from '../NavBar';
import { useRegistrationInfo } from '../../../context/RegistrationInfoContext';
import { useSong } from '../../../context/SongContext';
const { ipcRenderer } = window.require('electron');

function Song() {

    const { deviceHostName } = useRegistrationInfo()
    const { activeSongArray, setTitle, activeSong, setBody, openModal, activeLine, setactiveLine, LyricsLineRef, LyricsLineParentRef, detectKeyDown, songDisplayRef } = useSong()

    // const songDisplayRef = useRef(null);
    useEffect(() => {
        if (songDisplayRef.current) {
            songDisplayRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [activeSong]);

    // useEffect(() => {
    //     const handleClick = () => {
    //         alert("Button clicked");
    //     };
    //     const buttonEl = songDisplayRef.current;
    //     buttonEl.addEventListener("click", handleClick);
    //     return () => {
    //         buttonEl.removeEventListener("click", handleClick);
    //     };
    // }, []);


    return (
        <div className='song'>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "36px", gap: "10px", marginRight: "30px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", cursor: activeSongArray.length < 1 ? "not-allowed" : "pointer" }} onClick={() => {
                    if (activeSongArray.length > 0) {
                        setTitle(activeSong.title)
                        setBody(activeSong.body)
                        openModal(1)
                    }
                }} >

                    <span style={{ fontSize: '11px', fontWeight: "500" }}>Edit Song</span>
                    <Edit2 size={11} />
                </div>
            </div>
            <span style={{ fontSize: '14px', fontWeight: "600", color: "#FFFFFF", marginTop: "30px", textAlign: "left", marginLeft: "90px" }}>{activeSong && activeSong.title} </span>

            <div className='song-body' style={{ height: "90%", width: "100%", overflow: "scroll", }}>
                <div ref={songDisplayRef} className='bookmarks' style={{ overflow: "scroll", height: "100%", width: "100%", marginBottom: "10px",outline:"none" }} tabIndex="-1" onKeyDown={detectKeyDown}>
                    {activeSongArray &&
                        activeSongArray.map((item, index) => (
                            <LyricsLine key={index} line={item} index={index} activeLine={activeLine} setactiveLine={setactiveLine} ownRef={LyricsLineRef} parentRef={songDisplayRef}/>
                        ))
                    }
                </div>
            </div>
        </div>


    );
}

export default Song;
