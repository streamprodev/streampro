
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
import { firestore } from "../../firebase_setup/firebase"
import { SlOptionsVertical } from "react-icons/sl";
import OutputOptionsMenu from '../OutputOptionsMenu';
import NavBar from './NavBar';
import SongBody from './SongBody/SongBody';
import PreviewXOutput from './PreviewXOutput';
import AppNav from '../AppNav';
import { useRegistrationInfo } from '../../context/RegistrationInfoContext';


import { initializeApp } from "firebase/app"
import { getFirestore, addDoc, collection, getDocs, query, where, updateDoc, doc } from "@firebase/firestore"
import NotifySyncModal from '../NotifySyncModal';
import { useSong } from '../../context/SongContext';
import Bible from './BibleBody/Bible';
import BibleBody from './BibleBody/BibleBody';
import { Route, Routes } from 'react-router-dom';
import { usePreviewXOutput } from '../../context/PreviewXOutputContext';
import { useBible } from '../../context/BibleContext';
const { ipcRenderer } = window.require('electron');

function MainBody() {

    // setSyncingToaster
    const { songData, setmenuEditId } = useSong()

    const { registrationInfo, setregistrationInfo, deviceHostName, openNotifyModal } = useRegistrationInfo()
    const { expandedView, setexpandedView } = useBible()

    useEffect(() => {
        ipcRenderer.on('setSyncingToaster', setSyncingToasterf);
        ipcRenderer.on('syncError', syncErrorf);
        ipcRenderer.on('syncComplete', syncCompletef);
        ipcRenderer.on('syncStatus', syncStatusf);

        return () => {
            ipcRenderer.removeListener('syncStatus', syncStatusf);
            ipcRenderer.removeListener('setSyncingToaster', setSyncingToasterf);
            ipcRenderer.removeListener('syncError', syncErrorf);
            ipcRenderer.removeListener('syncComplete', syncCompletef);
        }
    }, []);

    const [isNotifySyncModalOpen, setisNotifySyncModalOpen] = useState(false)

    const setSyncingToasterf = () => {
        toast(<LowerToast status={'sync'} message={'Syncing...'} />, {
            position: "top-right",
            toastId: "syncToast",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            style: { width: "200px", backgroundColor: "#FF3939", textAlign: "left", margin: "auto", color: "#ffffff", marginTop: "50px", marginRight: "0px", height: "30px", minHeight: "20px", fontSize: "11px" },
            bodyStyle: { margin: "0", padding: "0", fontSize: "11px" }

        });
    }
    const syncErrorf = () => {
        toast.update('syncToast', {
            render: <LowerToast status={'error'} message={'Error Syncing songs'} />,
            position: "top-right",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            style: { width: "200px", backgroundColor: "#FF3939", textAlign: "left", margin: "auto", color: "#ffffff", marginTop: "50px", marginRight: "0px", height: "30px", minHeight: "20px", fontSize: "11px" },
            bodyStyle: { margin: "0", padding: "0", fontSize: "11px" }

        });
    }
    const syncCompletef = () => {
        toast.update('syncToast', {
            render: <LowerToast status={'success'} message={'Syncing Complete'} />,
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            style: { width: "200px", backgroundColor: "#A7FFB5", textAlign: "left", margin: "auto", color: "#ffffff", marginTop: "50px", marginRight: "0px", height: "30px", minHeight: "20px", fontSize: "11px" },
            bodyStyle: { margin: "0", padding: "0", fontSize: "11px" }
        });

        //get registration info again

        ipcRenderer.invoke('getRegistrationInfo', deviceHostName).then((res) => {
            if (typeof res == 'object' && Object.keys(res).length > 0) {
                setregistrationInfo(res)
                try {
                    updateDoc(doc(firestore, 'License Keys', res.documentid), {
                        'last_sync_date': res.last_sync_date
                    });
                } catch (error) {
                    return
                }
            }
        })
    }

    const syncStatusf = (event, message) => {
        console.log(message)
        if (message == 'enable-success') {
            toast(<LowerToast status={'success'} message={'Auto sync enabled successfully'} />, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                style: { width: "500px", height: "20px", backgroundColor: "#A7FFB5", textAlign: "left" }
            });
            ipcRenderer.invoke('getRegistrationInfo', deviceHostName).then((res) => {
                if (typeof res == 'object' && Object.keys(res).length > 0) {
                    setregistrationInfo(res)
                }
            })
            setTimeout(() => {
                ipcRenderer.send('syncSongs', { registrationInfo, songData })
            }, 1000);
        } else if (message == 'enable-error') {
            toast(<LowerToast status={'error'} message={"Error enabling auto sync status"} />, {
                position: "bottom-center",
                autoClose: 300,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                style: { width: "500px", backgroundColor: "#FF3939", textAlign: "left", height: "10px", margin: "auto" }
            });

        } else if (message == "disable-success") {
            toast(<LowerToast status={'success'} message={'Auto sync disabled successfully'} />, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                style: { width: "500px", height: "20px", backgroundColor: "#A7FFB5", textAlign: "left" }
            });
            ipcRenderer.invoke('getRegistrationInfo', deviceHostName).then((res) => {
                if (typeof res == 'object' && Object.keys(res).length > 0) {
                    setregistrationInfo(res)
                }
            })
        } else if (message == 'disable-error') {
            toast(<LowerToast status={'error'} message={"Error disabling auto sync status"} />, {
                position: "bottom-center",
                autoClose: 300,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                style: { width: "500px", backgroundColor: "#FF3939", textAlign: "left", height: "10px", margin: "auto" }
            });
        } else if (message == 'enable-notify') {
            setisNotifySyncModalOpen(true)

        }
    }

    const handleDelete = () => {

        setisNotifySyncModalOpen(false)
        ipcRenderer.send('enableSync', { registrationInfo, songData, notified: 1 })
    }
    const closeNotifyModal = () => {
        setisNotifySyncModalOpen(false)
    }

    return (
        <div className='App-header2' style={{ paddingTop: "20px" }}>

            <SideBar />
            <div className='main-section' style={{ paddingLeft: !expandedView ? "215px" : "70px" }}>
                <NavBar />
                <div className='MainBody'>
                    <Routes>
                        <Route index path="/song" element={<SongBody />} />
                        <Route path="/bible" element={<BibleBody />} />
                        {/* <Route path="*" element={<NoPage />} /> */}
                    </Routes>
                    {/* <SongBody /> */}
                    <PreviewXOutput />

                </div>
            </div>
            <DeleteSongModal />
            <CreateSongModal />
            <EditSongModal />
            <ImportSongsModal />
            <ConnectNowModal />
            <GenerateURLModal />
            <NotifySyncModal isNotifySyncModalOpen={isNotifySyncModalOpen} setisNotifySyncModalOpen={setisNotifySyncModalOpen} handleDelete={handleDelete} closeNotifyModal={closeNotifyModal} />
        </div>
    );
}

export default MainBody;
