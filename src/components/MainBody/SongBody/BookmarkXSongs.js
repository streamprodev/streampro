
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
import { useSong } from '../../../context/SongContext';
const { ipcRenderer } = window.require('electron');

function BookmarkXSongs() {



    const songListRef = useRef(null);
    const { bookmarkopen, setbookmarkOPen, bookmarkedData, setbookmarkedData, activeId, setactiveId, setBody, setTitle, activeSongArray, menuEditId, setmenuEditId, searchTerm, setSearchTerm, setactiveLine, activeLine, handleKeyPress, displayData, openModal, setisDeleteModalOpen, deleteSong, setdeleteSong, deleteBookmark, detectKeyDown, } = useSong()

    useEffect(() => {
        if (songListRef.current) {
            songListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [displayData]);
    useEffect(() => {
        if (songListRef.current) {
            songListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [searchTerm]);






    const songDisplayRef = useRef(null);
    const outputOptionsRef = useRef(null);




    return (
        <div className='bookmarkXsong' onKeyDown={detectKeyDown}>
            <div className={bookmarkopen ? 'bookmarks bookmark-show' : 'bookmarks bookmark-hide'} >
                <div className='' style={{ width: "90%", alignItems: "center", textAlign: "left", fontSize: "14px", paddingLeft: "24px", display: "flex", flexDirection: "row", paddingTop: "5px", justifyContent: "space-between" }}>
                    <p style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Bookmarks</p>
                    {
                        bookmarkopen ?
                            <ArrowUp2 size="20" color="#d9e3f0" onClick={() => setbookmarkOPen(false)} style={{ cursor: 'pointer', paddingRight: "13px" }} />
                            :
                            <ArrowDown2 size="20" color="#d9e3f0" onClick={() => setbookmarkOPen(true)} style={{ cursor: 'pointer', paddingRight: "13px" }} />
                    }
                </div>
                <div className='' style={{ overflow: "scroll", height: "100%", paddingLeft: "24px", width: "90%", }}>
                    {
                        bookmarkedData.length > 0 &&
                        bookmarkedData.map((item) => (
                            <SongListItem key={item.id} song={item} type={'bookmark'} />
                        ))
                    }

                    {/* <ToastContainer/> */}
                </div>
            </div>




            <div className='songsList' style={{ borderRadius: "10px", flex: "1", paddingLeft: "24px", overflow: "scroll", }} >

                <div style={{ position: "sticky", top: 0, background: "#15181C", alignItems: "flex-start", textAlign: "left", fontSize: "14px", borderTopRightRadius: "4px", borderTopLeftRadius: "4px", }}>
                    <p style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", paddingTop: "18px", background: "#15181C" }}>Songs</p>
                </div>
                <div style={{ position: "sticky", top: 0, background: "#15181C", alignItems: "center", fontSize: "14px", display: "flex", flexDirection: "row", justifyContent: "space-between", paddingRight: "24px", }}>
                    <div className='' style={{}}>
                        <input type="text" placeholder="Search songs" className="search-input" onKeyUp={handleKeyPress} onChange={(event) => setSearchTerm(event.target.value)} value={searchTerm} />
                        <SearchNormal className="search-icon" size={20} />
                    </div>
                    <p className="AddNew" style={{ fontWeight: "600", fontSize: "14px", background: "#15181C", textAlign: "center", cursor: 'pointer', color: "#FF3939" }} onClick={() => openModal()}>Add New</p>

                </div>

                <div ref={songListRef} className='' style={{ overflow: "scroll", height: "100%" }}>

                    {
                        displayData &&
                        displayData.map((item) => (
                            <SongListItem key={item.id} song={item} type={'list'} />
                        ))
                    }

                </div>
            </div>
        </div>


    );
}

export default BookmarkXSongs;
