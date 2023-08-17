
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
import SelectChapterXVerse from './SelectChapterXVerse';
import DisplayScripture from './DisplayScripture';
import SearchScripture from './SearchScripture';
import { FaEllipsisH } from 'react-icons/fa';
import { LuExpand, LuShrink } from "react-icons/lu";
const { ipcRenderer } = window.require('electron');

function Bible() {

    const { bibleView, setbibleView, selectedChapter, setselectedChapter, selectedBook, setselectedBook, expandedView, setexpandedView } = useBible()



    return (
        <div className='song' style={{ width: expandedView ? "1000px" : "620px" }}>
            {!expandedView ? <LuExpand size={18} style={{ border: "1px solid", cursor: "pointer", padding: '2px', borderRadius: "4px", borderColor: expandedView ? "#FF3939" : "#FFFFFF", position: "relative", top: "5%", left: "90%" }} color={expandedView ? "#FF3939" : "#FFFFFF"} onClick={() => setexpandedView(prev => !prev)} />
                :
                <LuShrink size={18} style={{ border: "1px solid", cursor: "pointer", padding: '2px', borderRadius: "4px", borderColor: expandedView ? "#FF3939" : "#FFFFFF", position: "relative", top: "5%", left: "90%" }} color={expandedView ? "#FF3939" : "#FFFFFF"} onClick={() => setexpandedView(prev => !prev)} />
            }

            {/* <SelectChapterXVerse type={'chapter'} /> */}
            {bibleView == "select-verse" && <SelectChapterXVerse type={'verse'} book={selectedBook} chapter={selectedChapter} />}
            {bibleView == "select-chapter" && <SelectChapterXVerse type={'chapter'} book={selectedBook} />}
            {bibleView == "view-verses" && <DisplayScripture type={'chapter'} book={selectedBook} chapter={selectedChapter} />}
            {bibleView == "search-result" && <SearchScripture type={'chapter'} book={selectedBook} chapter={selectedChapter} />}
        </div>

    );
}

export default Bible;
