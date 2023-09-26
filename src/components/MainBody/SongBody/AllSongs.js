
import { useEffect, useMemo, useState, useRef } from 'react';
import SideBar from '../../SideBar';
import CreateSongModal from '../../CreateSongModal';
import { Copy, Edit2, ProfileCircle, SearchNormal, Setting2, ArrowDown2, ArrowUp2, MinusSquare, SearchNormal1, Add } from 'iconsax-react';
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
import BookmarkXSongs from './BookmarkXSongs';
import Song from './Song';
import { BiSquareRounded } from "react-icons/bi";
import AllSongsItem from './AllSongItem';
import { useSong } from '../../../context/SongContext';
import Pagination from './Pagination';
const { ipcRenderer } = window.require('electron');

function AllSongs() {

    const { AllSonggSelectionArray, setAllSonggSelectionArray, displayData, searchAllSongsTerm, setsearchAllSongsTerm, songData, openModal, setisUpdateDownloadingModalOpen } = useSong();

    //  const unique = books.filter((obj, index) => {
    //     return index === books.findIndex(o => obj.title === o.title);
    // });
    // }

    const [currentPage, setCurrentPage] = useState(1);

    let PageSize = 10;

    const currentTableData = useMemo(() => {
        if (songData) {
            const firstPageIndex = (currentPage - 1) * PageSize;
            const lastPageIndex = firstPageIndex + PageSize;
            console.log(currentPage)
            return songData.slice(firstPageIndex, lastPageIndex);

        }
    }, [currentPage, songData]);
    console.log(currentTableData)

    const selectSong = (item) => {
        var index = AllSonggSelectionArray.findIndex(x => x.uuid == item.uuid);
        if (index === -1) {
            setAllSonggSelectionArray((prev) => {
                return prev.concat(item)
            })
        } else {
            setAllSonggSelectionArray((prev) => {
                return prev.filter(object => {
                    return object.uuid !== item.uuid;
                })
            })
        }
    }

    const selectAllSongs = () => {
        if (AllSonggSelectionArray.length > 0) {
            setAllSonggSelectionArray([])
        } else {
            setAllSonggSelectionArray(displayData)
        }
    }




    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", paddingRight: "24px", marginTop: "-10px" }}>
            <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "32px", }}>Songs</span>
            {/* <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "32px", }}>Songs/List</span> */}
            <div style={{ display: 'flex', justifyContent: "space-between", width: "100%", paddingTop: "55px" }}>
                <div style={{ display: 'flex', justifyContent: "space-between", gap: "25px" }}>
                    <div className='search-input-all-div' style={{ position: 'relative' }}>
                        <input type="text" placeholder="Search songs" className="search-input-all" onKeyUp={() => { }} onChange={(event) => setsearchAllSongsTerm(event.target.value)} value={searchAllSongsTerm} />
                        <SearchNormal1 className="search-icon-all" size={16} />
                    </div>
                </div>
                <button style={{ width: "175px", height: "40px", backgroundColor: "#FF3939", border: "1px solid #FF3939", borderRadius: "4px", cursor: "pointer", borderColor: "#FF3939", display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => { openModal() }}>
                    <span style={{ color: "#fff", verticalAlign: "center", fontWeight: "400", fontSize: "14px", }}>Add New Song</span>
                    <Add size="20" color="#fff" />
                </button>
            </div>
            <div className='All-songs' style={{
                display: "flex", flex: 1, flexDirection: "column", alignItems: "flex-start", backgroundColor: "#15181C", width: "100%", borderRadius: "8px", overflow: "scroll", marginTop: "12px"
            }}
            >
                <div style={{ display: 'flex', justifyContent: "space-between", width: "100%", paddingTop: '24px', paddingBottom: "24px" }}>
                    <div style={{ display: 'flex', alignItems: "flex-start", paddingLeft: "23.5px", gap: "12px" }}>
                        <div><span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "18px", }}>All Songs</span></div>
                        <div >
                            <span style={{ borderStyle: "solid", borderWidth: "1px", borderRadius: "16px", fontWeight: "500", color: "#FF3939", fontSize: "12px", lineHeight: "0.1px", backgroundColor: "#000", padding: "2px 8px", borderColor: "#ffc0c0" }}>{songData ? songData.length : 0} songs</span>
                        </div>

                    </div>
                    <div style={{ display: 'flex', paddingRight: "23.5px" }}>
                        <button style={{ width: "117px", height: "40px", backgroundColor: "#000", border: "1px solid #000", borderRadius: "4px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "5px" }} onClick={() => { setisUpdateDownloadingModalOpen(true); console.log('hey') }}>
                            <span style={{ color: "#fff", verticalAlign: "center", fontWeight: "400", fontSize: "12px", }}>Bulk Action</span>
                            <ArrowDown2 size="20" color="#fff" />
                        </button>
                    </div>
                </div>

                <AllSongsItem type={"header"} selectAllSongs={selectAllSongs} />
                {
                    currentTableData &&
                    currentTableData.map((item) => (
                        <AllSongsItem key={item.id} item={item} type={'list'} selectSong={(item) => selectSong(item)} />
                    ))
                }

                {
                    songData
                    &&
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={songData.length}
                        pageSize={PageSize}
                        onPageChange={page => setCurrentPage(page)}
                    />
                }
            </div>
        </div >
    );
}

export default AllSongs;
