
import { useEffect, useMemo, useState, useRef } from 'react';
import SideBar from '../SideBar';
import CreateSongModal from '../CreateSongModal';
import { Copy, Edit2, ProfileCircle, SearchNormal, Setting2, ArrowDown2, ArrowUp2 } from 'iconsax-react';
import ImportSongsModal from '../ImportSongsModal';
import SongListItem from '../SongListItem';
import MiniSearch from 'minisearch'
import LyricsLine from '../LyricsLine';
import EditSongModal from '../EditSongModal';
import ConnectNowModal from '../ConnectNowModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LowerToast from '../LowerToast';
import { useStopwatch } from 'react-timer-hook';
import GenerateURLModal from '../GenerateURLModal';
import DeleteSongModal from '../DeleteSongModal';
import { addDoc, collection } from "@firebase/firestore"
import { firestore } from "../../firebase_setup/firebase"
import { SlOptionsVertical } from "react-icons/sl";
import OutputOptionsMenu from '../OutputOptionsMenu';
import { useSong } from '../../context/SongContext';
import { useRegistrationInfo } from '../../context/RegistrationInfoContext';
import AccountMenu from '../AccountMenu';
import exportFromJSON from 'export-from-json'
import { saveAs } from 'file-saver';
const { ipcRenderer } = window.require('electron');


function NavBar() {

    const { openImportModal, songData, setsongData, setmenuEditId } = useSong()
    const { registrationInfo, AccountMenuRef, showAccountMenuPosition, setshowAccountMenuPosition, showAccountMenu, setshowAccountMenu, getRandomColor } = useRegistrationInfo()

    useEffect(() => {
        ipcRenderer.send('syncSongs', { registrationInfo, songData })
        // ipcRenderer.on('resetSongData', resetSongData);

        return () => {
            // ipcRenderer.removeListener('resetSongData', resetSongData);
        }
    }, []);

    const exportSongs=()=>{
        const zip = require('jszip')();
        // console.log(songData)
        songData.forEach((songg)=>{
            // const file = `data:text/;chatset=utf-8,${encodeURIComponent(
            //     JSON.stringify(songg.body)
            // )}`
            zip.file(songg.title + ".txt", songg.body);

        })
        zip.generateAsync({ type: "blob" }).then(content => {
            saveAs(content, "export.zip");
        });
        // exportFromJSON({ data: songData[0], fileName: 'data', exportType: exportFromJSON.types.txt })
    }

    const handleShowAccountMenu = (e) => {

        // setActiveItem(itemId);
        if (showAccountMenu) {
            setshowAccountMenu(false);
            return
        }
        const clickX = e.clientX;
        const clickY = e.clientY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const menuW = 350;
        const menuH = 270;

        const posX = clickX + menuW > screenW ? screenW - menuW : clickX;
        const posY = clickY + menuH > screenH ? screenH - menuH : clickY + 30;

        setshowAccountMenuPosition({ x: posX, y: posY });
        setTimeout(() => {
            setshowAccountMenu(true);

        }, 100);
    }

    const resetSongData = (event, data) => {
        console.log(data)

        if (data === "delete") {
            toast(<LowerToast status={'success'} message={'Song Deleted Successfully'} />, {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                style: { width: "500px", height: "20px", backgroundColor: "#A7FFB5", textAlign: "left" }
            });

        } else if (data === 'edit') {

            setmenuEditId('')
            setTimeout(() => {

                if (registrationInfo.auto_sync == 1) {
                }
                ipcRenderer.send('syncSongs', { registrationInfo, songData })
            }, 5000);
            toast(<LowerToast status={'success'} message={'Song edited Successfully'} />, {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: { height: "10px", backgroundColor: "#A7FFB5", width: "500px" }
            });

        } else if (data === "add") {
            console.log(123)
            toast(<LowerToast status={'success'} message={'Song Added Successfully'} />, {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                style: { width: "500px", height: "20px", backgroundColor: "#A7FFB5", textAlign: "left" }
            });
            ipcRenderer.invoke('refreshSongData').then(setsongData)


            setTimeout(() => {
                if (registrationInfo.auto_sync == 1) {
                }
                ipcRenderer.send('syncSongs', { registrationInfo, songData })
            }, 5000);
        } else if (data === "sync") {

            ipcRenderer.invoke('refreshSongData').then(setsongData)
        }


    }


    return (
        <div className='NavBar'>
            <div className='' style={{ width: "333px", display: "flex", position: "relative" }}>
                <input type="text" placeholder="Search" className="search-input-nav" />
                <SearchNormal style={{ position: "absolute", top: "20%", right: "4%" }} size={20} />
            </div>
            <div style={{ display: "flex", alignItems: 'center', gap: "55px" }}>
                <div style={{display:"flex",flexDirection:"row",gap:"10px"}}>
                <p style={{ fontWeight: "600", fontSize: "12px", background: "#15181C", textAlign: "center", cursor: "pointer" }} className='ImportSong' onClick={openImportModal}>Import Songs</p>
                    <p style={{ fontWeight: "600", fontSize: "12px", background: "#15181C", textAlign: "center", cursor: "pointer", color:"#FF3939" }} className='ImportSong' onClick={exportSongs}>|</p>
                    <p style={{ fontWeight: "600", fontSize: "12px", background: "#15181C", textAlign: "center", cursor: "pointer",  }} className='ImportSong' onClick={exportSongs}>Export Songs</p>

                </div>
                <div style={{ display: "flex", alignItems: 'center', gap: 21, marginRight: "15px" }}>
                    {/* <ProfileCircle size="24" /> */}
                    <div style={{ height: "30px", width: "30px", borderRadius: "16px", backgroundColor: registrationInfo.license_owner && getRandomColor(registrationInfo.license_owner).color, fontSize: "20px", cursor: "pointer" }} onClick={handleShowAccountMenu}>
                        {registrationInfo?.license_owner && getRandomColor(registrationInfo.license_owner).character}
                    </div>
                    {/* <Setting2 size="24" onClick={() => { console.log('working'); ipcRenderer.send('syncSongs', { registrationInfo, songData }) }} /> */}
                </div>
            </div>


            <AccountMenu />


        </div>

    );
}

export default NavBar;
