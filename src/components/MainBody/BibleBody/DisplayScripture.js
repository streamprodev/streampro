
import { useEffect, useMemo, useState, useRef } from 'react';
import SideBar from '../../SideBar';
import CreateSongModal from '../../CreateSongModal';
import { Copy, Edit2, ProfileCircle, SearchNormal, Setting2, ArrowDown2, ArrowUp2, ArrowLeft } from 'iconsax-react';
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
import BibleLine from '../../BibleLine';
import SelectNumber from '../../SelectNumber';
import { useBible } from '../../../context/BibleContext';
const { ipcRenderer } = window.require('electron');

function DisplayScripture() {
    const { activeChapterContent, selectedBook, selectedChapter, detectKeyDown, contentChapterRef, expandedView, setexpandedView } = useBible()
    // console.log(activeChapterContent)



    return (
        <> 

            <span style={{ fontSize: '18px', fontWeight: "600", color: "#FFFFFF", marginTop: "50px", textAlign: "center", }}>{selectedBook.label + " Chaper " + selectedChapter?.chapter_number} </span>
            {/* <div style={{ display: "flex", justifyContent: "center", gap: "10px", }}>
                <div style={{ display: "flex", gap: "5px", alignItems: "center", cursor: "pointer" }} onClick={() => { }} >
                    <ArrowLeft size={24} />
                    <span style={{ fontSize: '12px', fontWeight: "500" }}>Back to Chapters</span>
                </div>
            </div> */}

            <div className='song-body' style={{ height: "90%", width: "100%", overflow: "scroll", }}>
                <div ref={contentChapterRef} className='bookmarks' style={{ overflow: "scroll", height: "100%", width: "100%", marginBottom: "10px",outline:"none" }} tabIndex="-1" onKeyDown={detectKeyDown}>
                    {activeChapterContent &&
                        activeChapterContent.map((item, index) => (
                            <BibleLine key={index} line={item} index={index} parentRef={contentChapterRef}
                            // activeLine={activeLine} setactiveLine={setactiveLine}
                            />
                        ))
                    }
                </div>
            </div>
        </>


    );
}

export default DisplayScripture;
