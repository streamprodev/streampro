
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

function SelectChapterXVerse({ type, number }) {

    const { bibleView, setbibleView, selectedChapter, setselectedChapter, selectedBook, setselectedBook, chapters } = useBible()

    const handleBackClick = () => {
        // if (type == 'chapter') {
        //     setbibleView('select-verse')

        // } else
        if (type == 'verse') {
            setbibleView('select-chapter')
        }
    }

    return (
        <div style={{ width: "100%", height: "65vh" }}>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "51px", width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}  >
                    <ArrowLeft size={24} style={{ cursor: "pointer", marginLeft: "24px" }} onClick={handleBackClick} color={type == 'chapter' ? 'transparent':"#fff"} />
                    <span style={{ fontSize: '18px', fontWeight: "600", flex: 1, textAlign: "center" }}>{selectedBook.label} {type == 'verse' && "Chapter " + selectedChapter.chapter_number}</span>
                    <ArrowLeft size={24} style={{ marginRight: "24px" }} color={'transparent'} />
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "16px" }}>
                <div style={{ display: "flex", gap: "5px", alignItems: "center", cursor: "pointer" }} onClick={() => { }} >
                    <span style={{ fontSize: '12px', fontWeight: "500" }}>Select {type}</span>
                </div>
            </div>

            <div style={{ display: "flex", gap: "5px", justifyContent: "flex-start", paddingLeft: "30px", paddingRight: "25px", flexWrap: "wrap", marginTop: "24px", overflow: "scroll", maxHeight: "100%" }}>
                {type == 'chapter' && [...Array(parseInt(selectedBook.chapter_count))].map((e, i) => <SelectNumber key={i} value={i + 1} type={type} />)}
                {type == 'verse' && [...Array(parseInt(selectedChapter.verses_count))].map((e, i) => <SelectNumber key={i} value={i + 1} type={type} />)}
            </div>


        </div>


    );
}

export default SelectChapterXVerse;
