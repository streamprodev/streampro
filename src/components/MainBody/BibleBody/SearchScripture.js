
import { useEffect, useMemo, useState, useRef } from 'react';
import SideBar from '../../SideBar';
import CreateSongModal from '../../CreateSongModal';
import { CpuSetting, Edit2, ProfileCircle, SearchNormal, Setting2, ArrowDown2, ArrowUp2, ArrowLeft, Magicpen, Pharagraphspacing, Brush2 } from 'iconsax-react';
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
import { FaEllipsisH } from "react-icons/fa";
const { ipcRenderer } = window.require('electron');

function SearchScripture() {
    const { activeChapterContent, selectedBook, selectedChapter, searchData, setsearchData, setChapterContent, setsearchBookObj, setsearchBook, setsearchChapter, setsearchVerse, setbibleView, books, setselectedChapter, chapters, showOneLine, setshowOneLine, showHilighted, setshowHilighted, searchResultRef, setsearchResultRef, showAllSearch, setshowAllSearch } = useBible()


    return (
        <>

            <span style={{ fontSize: '18px', fontWeight: "600", color: "#FFFFFF", marginTop: "50px", textAlign: "center", }}>Search Result </span>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "-10px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", cursor: "pointer" }} onClick={() => { }} >
                    <div title={showOneLine ? "Show in full" : "Reduce to one line"}>
                        <Pharagraphspacing size={18} style={{ border: "none", cursor: "pointer", padding: '2px', borderRadius: "4px", borderColor: showOneLine ? "#FF3939" : "#FFFFFF" }} color={showOneLine ? "#FFFFFF" : "#FF3939"} onClick={() => setshowOneLine(prev => !prev)} />
                    </div>
                    <div title={showHilighted ? "Remove keyword highlight" : "Show keyword highlights"}>
                        <Brush2 size={18} style={{ border: "none", cursor: "pointer", padding: '2px', borderRadius: "4px", borderColor: showHilighted ? "#FF3939" : "#FFFFFF" }} color={showHilighted ? "#FF3939" : "#FFFFFF"} onClick={() => setshowHilighted(prev => !prev)} title="Coming Soon" />
                    </div>
                    <div title={showAllSearch ? "Disable strict search" : "Enable strict search"}>
                        <CpuSetting size={18} style={{ border: "none", cursor: "pointer", padding: '2px', borderRadius: "4px", borderColor: showAllSearch ? "#FF3939" : "#FFFFFF" }} color={showAllSearch ? "#FF3939" : "#FFFFFF"} onClick={() => setshowAllSearch(prev => !prev)} />
                    </div>
                    {/* <span style={{ fontSize: '12px', fontWeight: "500" }}>Back to Chapters</span> */}
                </div>
            </div>


            <div className='song-body' style={{ height: "90%", width: "100%", overflow: "scroll", }}>
                <div className='bookmarks' style={{ overflow: "scroll", height: "100%", width: "100%", marginBottom: "10px" }} tabIndex="0" ref={searchResultRef}>
                    {searchData &&
                        searchData.map((item, index) => (
                            <BibleLine key={index} line={item} index={index}
                                // activeLine={activeLine} setactiveLine={setactiveLine}
                                search={true}
                            />
                        ))
                    }
                </div>
            </div>
        </>


    );
}

export default SearchScripture;
