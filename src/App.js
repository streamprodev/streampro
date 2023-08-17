
import { useEffect, useMemo, useState, useRef } from 'react';
import './App.css';
import Splash from './components/Splash';
import SideBar from './components/SideBar';
import CreateSongModal from './components/CreateSongModal';
import { Copy, Edit2, ProfileCircle, SearchNormal, Setting2, ArrowDown2, ArrowUp2 } from 'iconsax-react';
import ImportSongsModal from './components/ImportSongsModal';
import SongListItem from './components/SongListItem';
import MiniSearch from 'minisearch'
import LyricsLine from './components/LyricsLine';
import EditSongModal from './components/EditSongModal';
import ConnectNowModal from './components/ConnectNowModal';
// import toast, { Toaster } from 'react-hot-toast';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LowerToast from './components/LowerToast';
import { useStopwatch, useTimer } from 'react-timer-hook';
import GenerateURLModal from './components/GenerateURLModal';
import CustomContextMenu from './components/CustomContextMenu';
import DeleteSongModal from './components/DeleteSongModal';
import GoLiveSwitch from './components/GoLiveSwitch';
import BounceLoader from "react-spinners/BounceLoader";
import AppNav from './components/AppNav';
import { addDoc, collection, getDocs, query, where } from "@firebase/firestore"

import { firestore } from "./firebase_setup/firebase"
import { SlOptionsVertical } from "react-icons/sl";
import OutputOptionsMenu from './components/OutputOptionsMenu';
import { RegistrationInfoContextProvider } from './context/RegistrationInfoContext';
import MainBody from './components/MainBody/MainBody';
import { SongContextProvider } from './context/SongContext';
import { PreviewXOutputContextProvider } from './context/PreviewXOutputContext';
import AppMain from './components/AppMain';
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import EnterLicenseKey from './components/EnterLicenseKey';
import { BibleContextProvider } from './context/BibleContext';
// const icmp = window.require('ping'); 
const { ipcRenderer } = window.require('electron');

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // const collection_ref = collection(firestore, 'License Keys')
    // const q = query(collection_ref, where("key", "==", '12345'))
    // const doc_refs = getDocs(q);
    // // console.log(doc_refs)
    // const res = []

    // let data = {
    //   url: 'contents.url',
    //   password: 'contents.password'
    // }

    // try {
    //   addDoc(collection_ref, data)
    // } catch (err) {
    //   console.log(err)
    // }

    setTimeout(() => {
      setShowSplash(false)
    }, 2500)
  }, [])



  return (
    <RegistrationInfoContextProvider>
      <HashRouter>
        <SongContextProvider>
          <BibleContextProvider>
            <PreviewXOutputContextProvider>
              <div className="App">
                {/* <AppMain /> */}
                <AppNav />
                <Routes>
                  <Route index path="/" element={<Splash />} />
                  <Route path="/register" element={<EnterLicenseKey />} />
                  <Route path="/main/*" element={<MainBody />} />
                  {/* <Route path="*" element={<NoPage />} /> */}
                </Routes>
              </div>
              <ToastContainer />
            </PreviewXOutputContextProvider>
          </BibleContextProvider>
        </SongContextProvider>
      </HashRouter>
    </RegistrationInfoContextProvider >
  );
}

export default App;

