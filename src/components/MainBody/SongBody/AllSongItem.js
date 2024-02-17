
import { useEffect, useMemo, useState, useRef } from 'react';
import SideBar from '../../SideBar';
import CreateSongModal from '../../CreateSongModal';
import { Copy, Edit2, ProfileCircle, SearchNormal, Setting2, ArrowDown2, ArrowUp2, MinusSquare, Trash } from 'iconsax-react';
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
import { useSong } from '../../../context/SongContext';
const { ipcRenderer } = window.require('electron');


function AllSongsItem({ type, item, selectSong, selectAllSongs }) {
    const [selected, setSelected] = useState(false)
    const { AllSonggSelectionArray, setAllSonggSelectionArray, setTitle, setBody, openModal, setmenuEditId, setisDeleteModalOpen, setdeleteSong } = useSong();
    let createdDate = new Date(item && item.created);
    let updatedDate = new Date(item && item.updated);

    let finalCreatedDate = createdDate.getMonth() + 1 + "/" + createdDate.getDate() + "/" + createdDate.getFullYear()
    let finalupdatedDate = updatedDate.getMonth() + 1 + "/" + updatedDate.getDate() + "/" + updatedDate.getFullYear()

    const openDeleteModal = () => {
        setdeleteSong(item)
        setisDeleteModalOpen(true);
    };

    return (
        type == "header" ?
            <div style={{ display: 'flex', justifyContent: "space-between", width: "100%", borderTopColor: "#656464", borderTopWidth: '0.5px', borderTopStyle: "solid", height: "44px", fontWeight: "600", color: "#b1b1b1", fontSize: "12px", }} >

                <div style={{ display: 'flex', paddingLeft: "24px", flex: 3, gap: "12px", alignItems: "center", height: "44px", }} onClick={() => selectAllSongs()}>
                    {
                        AllSonggSelectionArray.length > 0 ?
                            <MinusSquare size="23" color="#B1B1B1" /> :
                            <BiSquareRounded size="23" color="#B1B1B1" />
                    }
                    <span>Title</span>
                </div>
                <div style={{ display: 'flex', flex: 1.5, height: "44px", alignItems: "center", }}><span>Date Created</span></div>
                <div style={{ display: 'flex', paddingRight: "24px", flex: 2.5, height: "44px", alignItems: "center" }}><span>Last Modified</span></div>
            </div>
            :
            <div style={{ display: 'flex', justifyContent: "space-between", width: "100%", borderTopColor: "#656464", borderTopWidth: '0.5px', borderTopStyle: "solid", alignItems: "center", fontWeight: "400", color: "#fff", fontSize: "14px", }} >

                <div style={{ display: 'flex', paddingLeft: "24px", flex: 3, gap: "12px", alignItems: "center", height: "72px" }} onClick={() => selectSong(item)}>
                    {
                        AllSonggSelectionArray.length > 0 && AllSonggSelectionArray.some(el => el.uuid === item.uuid) ?
                            <MinusSquare size="23" color="#B1B1B1" /> :
                            <BiSquareRounded size="23" color="#B1B1B1" />
                    }
                    <span>{item.title}</span>
                </div>
                <div style={{ display: 'flex', flex: 1.5, height: "72px", alignItems: "center" }}><span>{finalCreatedDate}</span></div>
                <div style={{ display: 'flex', paddingRight: "24px", flex: 2.5, height: "72px", alignItems: "center", justifyContent: "space-between" }}>
                    <span>{finalupdatedDate}</span>
                    <div style={{ display: 'flex', alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
                        <div title="Edit Song" >
                            <Edit2 size="20" color="#B1B1B1" style={{ cursor: "pointer" }} onClick={() => {

                                setTitle(item.title)
                                setBody(item.body)
                                setmenuEditId(item.uuid)
                                openModal(1)
                            }} />
                        </div>
                        <div title="Delete Song" >
                            <Trash size="20" color="#FF3939" onClick={() => {
                                openDeleteModal()
                            }} style={{ cursor: "pointer" }} />

                        </div>
                    </div>
                </div>
            </div>

    );
}

export default AllSongsItem;
