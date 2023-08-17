
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
import NavBar from './NavBar';
import { usePreviewXOutput } from '../../context/PreviewXOutputContext';
import { useSong } from '../../context/SongContext';
import { useLocation } from 'react-router-dom';
import { useBible } from '../../context/BibleContext';
const { ipcRenderer } = window.require('electron');

function PreviewXOutput() {

    const location = useLocation();



    // const [outPutType, setoutPutType] = useState('song');
    const {
        outputLine, setoutputLine, setngrokUrlError, ngrokStatus, setngrokStatus, outputOptionsPosition, setoutputOptionsPosition, showoutputOptions, setshowoutputOptions, isLive, setisLive, externalConnectionConnectionEstablished, setexternalConnectionConnectionEstablished, externalConnectionPasscode, setexternalConnectionPasscode, externalConnectionUrl, setexternalConnectionUrl, outputConnectionEstablished, setoutputConnectionEstablished, outputConnectionSoftware, setoutputConnectionSoftware, outputPasscode, setoutputPasscode, outputUrl, setoutputUrl, finaloutputLine, setfinaloutputLine, seconds, minutes, hours, days, isRunning, start, pause, reset, copiedToaster, vmixDisconected, isConnectNowModalOpen, setIsConnectNowModalOpen, isGenerateURLModalOpen, setisGenerateURLModalOpen, outputOptionsRef, handleShowOutputOption } = usePreviewXOutput();

    const { activeSongArray, activeLine, setactiveLine, outPutType, setoutPutType } = useSong()
    const { activeChapterContent, selectActiveVersion, selectedVerseArray, setselectedVerseArray } = useBible()


    const openConnectNowModal = () => {
        setIsConnectNowModalOpen(true);
    };
    const openGenerateURLModal = () => {
        setisGenerateURLModalOpen(true);
    };

    const destroyCreatedUrl = () => {
        reset()
        setexternalConnectionPasscode('')
        setexternalConnectionUrl('')
        // pause()
        ipcRenderer.send('closengrok', 'Session closed successfully')
        setexternalConnectionConnectionEstablished(0)
    };

    const closeConnectNowModal = () => {
        setIsConnectNowModalOpen(false);
    };
    const closeGenerateURLModal = () => {
        setisGenerateURLModalOpen(false);
    };

    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    useEffect(() => {
        if (location.pathname == "/main/song") {
            setoutPutType('song')
            if (activeSongArray.length > 0) {

                if (activeSongArray.length > 0 && activeLine >= activeSongArray.length) {
                    setactiveLine(prev => prev - 1)
                } if (activeLine < -1) {
                    setactiveLine(prev => prev + 1)
                } else {

                    if (activeLine !== -1 && activeSongArray) {
                        setoutputLine(activeSongArray[activeLine])
                    } else {
                        setoutputLine('')
                    }
                }
            }

        } else if (location.pathname == "/main/bible") {
            setoutPutType('bible')
            if (activeChapterContent.length > 0) {

                if (activeChapterContent.length > 0 && activeLine >= activeChapterContent.length) {
                    setactiveLine(prev => prev - 1)
                } if (activeLine < -1) {
                    setactiveLine(prev => prev + 1)
                } else {
                    if (activeLine !== -1 && activeChapterContent) {

                        setoutputLine(selectedVerseArray.text)
                        // setoutputLine(activeChapterContent[activeLine].text)
                    } else {
                        setoutputLine('')
                    }
                }
            }
        }
    }, [activeLine, activeChapterContent]);

    return (
        <div className='connectionsXnotes'>
            <div className='preview'>
                <div style={{ display: "flex", marginLeft: "24px", marginRight: "24px", justifyContent: "space-between", alignItems: "center", maxHeight: "10%", marginTop: "20px" }}>
                    <span style={{ fontSize: '14px', fontWeight: "600", color: "#FFFFFF", textAlign: "left", }}>Preview</span>

                </div>
                <div style={{ paddingLeft: "24px", paddingRight: "24px", textAlign: "left", flex: 1, alignItems: 'flex-start', display: "flex", flexDirection: "column", gap: "10px" }}>
                    {(location.pathname == "/main/bible" && outputLine) && <span style={{ listStyleType: "none", fontSize: '14px', fontWeight: "500", color: "#B1B1B1", cursor: "pointer", textAlign: "left" }} onClick={() => { }}>{selectedVerseArray?.book_name + " " + selectedVerseArray?.chapter_number + ":" + selectedVerseArray?.verse_number} ({selectActiveVersion.toUpperCase()})</span>}
                    {outputLine  && <span style={{ fontSize: '14px', fontWeight: "600", color: "#B1B1B1", lineHeight: "1.3" }}>{location.pathname == "/main/bible" ? selectedVerseArray?.text : outputLine} </span>}
                </div>
                <div style={{ flex: 1 }}></div>
            </div>
            <div className='finaloutput'>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "24px", gap: "5px", minHeight: "30%", marginRight: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                        <span style={{ fontSize: '14px', fontWeight: "600", color: "#FFFFFF" }}>{!outputConnectionEstablished ? "Output(Not Connected)" : "Output (" + capitalize(outputConnectionSoftware) + ")"} </span>
                        <div style={{ height: "11px", width: "11px", borderRadius: "50%", backgroundColor: !outputConnectionEstablished ? "#FF3939" : "#3EDB57", marginTop: "5px" }}></div>
                    </div>
                    {/* {
                        outputConnectionEstablished == 1 &&
                        <button style={{ width: "82px", height: "30px", backgroundColor: "#15181C", border: "1px solid #FF3939", borderRadius: "4px", cursor: "pointer", borderColor: isLive ? "#3EDB57" : "#FF3939" }} onClick={() => setisLive(prev => !prev)}>
                            <span style={{ color: isLive ? "#3EDB57" : "#FF3939" }}>{!isLive ? "Go Live" : "Live"}</span>
                        </button>
                    } */}
                    {
                        outputConnectionEstablished == 1 &&
                        <div style={{ cursor: "pointer", width: "10px" }} onClick={handleShowOutputOption}>
                            <SlOptionsVertical size={15} color='#B1B1B1' />

                            {showoutputOptions && (
                                <div ref={outputOptionsRef}>
                                    <OutputOptionsMenu
                                        posX={outputOptionsPosition.x}
                                        posY={outputOptionsPosition.y}
                                        setshowoutputOptions={setshowoutputOptions}
                                        setoutputConnectionEstablished={setoutputConnectionEstablished}
                                        setisLive={setisLive}

                                    />
                                </div>
                            )}
                        </div>
                    }
                </div>
                {
                    finaloutputLine &&
                    <div style={{ paddingLeft: "24px", paddingRight: "24px", textAlign: "left", alignItems: "flex-start", display: 'flex', flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: "10px" }}>
                        {(outPutType == 'bible' && finaloutputLine) && <span style={{ listStyleType: "none", fontSize: '14px', fontWeight: "500", color: "#FF3939", textAlign: "left" }} onClick={() => { }}>{selectedVerseArray?.book_name + " " + selectedVerseArray?.chapter_number + ":" + selectedVerseArray?.verse_number} ({selectActiveVersion.toUpperCase()})</span>}
                        {finaloutputLine  && <span style={{ fontSize: '14px', fontWeight: "600", color: "#FF3939", lineHeight: "1.3" }}>{location.pathname == "/main/bible" ? selectedVerseArray?.text : finaloutputLine} </span>}
                    </div>
                }

                <div style={{ flex: outputConnectionEstablished }}></div>
                {
                    outputConnectionEstablished !== 1 &&
                    <div style={{ marginBottom: "20px" }}>
                        <button style={{ width: "164px", height: "53px", backgroundColor: "#FF3939", border: "none", borderRadius: "4px", cursor: "pointer", flex: 1 }} onClick={openConnectNowModal}>
                            <span style={{ color: "white" }}>Connect Now</span>
                        </button>
                    </div>
                }
            </div>

            <div className='externalConnection'>
                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", marginTop: "20px", marginLeft: "24px", gap: "5px" }}>
                    <span style={{ fontSize: '14px', fontWeight: "600", color: "#FFFFFF" }}>Remote Connection Code</span>
                    <div style={{ marginTop: "3px", height: "11px", width: "11px", borderRadius: "50%", backgroundColor: externalConnectionConnectionEstablished === 0 ? "transparent" : "#3EDB57" }}></div>
                </div>
                {
                    externalConnectionConnectionEstablished === 0 ?
                        <div style={{ paddingLeft: "24px", paddingRight: "24px", textAlign: "left", lineHeight: 1 }}>
                            <span style={{ listStyleType: "none", marginBottom: "24px", fontSize: '14px', fontWeight: "500", color: "#B1B1B1", textAlign: "left" }}>Generate connection code for output connection to streaming software on this system.</span>
                        </div> :
                        <div style={{}}>
                            <div style={{ textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", }}>
                                <span style={{ fontSize: '40px', fontWeight: "600", color: "#B1B1B1", textAlign: "center" }}>{hours > 0 ? hours + ":" : ""}{minutes > 9 ? minutes : "0" + minutes}:{seconds > 9 ? seconds : "0" + seconds}</span>
                            </div>
                            <div style={{ paddingLeft: "24px", paddingRight: "24px", display: "flex", flexDirection: "column", gap: "8px", marginTop: "20px", }}>
                                <span style={{ fontSize: '14px', fontWeight: "600", color: "#FFFFFF", textAlign: "center" }}>Code: {externalConnectionPasscode} <Copy size="14" color="#FFFFFF" onClick={() => {
                                    navigator.clipboard.writeText(externalConnectionPasscode);
                                    copiedToaster()
                                }} style={{ cursor: "pointer" }} /></span>

                            </div>
                        </div>
                }
                <div>
                    {
                        externalConnectionConnectionEstablished === 0 ?
                            <button style={{ width: "164px", height: "53px", backgroundColor: "#15181C", border: "1px solid #FF3939", borderRadius: "4px", marginBottom: "20px", cursor: "pointer" }} onClick={externalConnectionConnectionEstablished === 0 ? openGenerateURLModal : destroyCreatedUrl}>
                                <span style={{ color: "#FF3939" }}>Generate Code</span>
                            </button>
                            :
                            <button style={{ width: "164px", height: "53px", marginTop: "20px", backgroundColor: "#FF3939", borderRadius: "4px", marginBottom: "20px", cursor: "pointer", border: "none" }} onClick={externalConnectionConnectionEstablished === 0 ? openGenerateURLModal : destroyCreatedUrl}>
                                <span style={{ color: "#ffffff" }}>Stop Connection</span>
                            </button>

                    }
                </div>
            </div>
        </div>
    );
}

export default PreviewXOutput;
