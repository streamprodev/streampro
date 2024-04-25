
import { useEffect, useMemo, useState, useRef, CSSProperties } from 'react';
import SideBar from '../SideBar';
import CreateSongModal from '../CreateSongModal';
import { Copy, Edit2, ProfileCircle, SearchNormal, Setting2, ArrowDown2, ArrowUp2, ArrowCircleLeft, ArrowCircleRight } from 'iconsax-react';
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
// import { Carousel } from 'react-responsive-carousel';
// import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useEwGrabber } from '../../context/EwGrabberContext';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
const { ipcRenderer } = window.require('electron');

function PreviewXOutput() {

    const arrowStyles = {
        position: 'absolute',
        // zIndex: 999,
        top: 'calc(50%)',
        width: 20,
        height: 20,
        cursor: 'pointer',
    };

    const indicatorStyles = {
        // position: 'absolute',
        background: 'transparent',
        width: 8,
        height: 8,
        borderRadius: '50%',
        display: 'inline-block',
        margin: '0 4px',
        bottom: 15,
        border: '1px solid #FF3939',
        // right:
    };

    const location = useLocation();



    const [currentBibleOutputIndex, setCurrentBibleOutputIndex] = useState(0);
    // 
    // const [activeCarousel, setactiveCarousel] = useState({});
    // const [outPutType, setoutPutType] = useState('song');
    const {
        outputLine, setoutputLine, setngrokUrlError, ngrokStatus, setngrokStatus, outputOptionsPosition, setoutputOptionsPosition, showoutputOptions, setshowoutputOptions, isLive, setisLive, externalConnectionConnectionEstablished, setexternalConnectionConnectionEstablished, externalConnectionPasscode, setexternalConnectionPasscode, externalConnectionUrl, setexternalConnectionUrl, outputConnectionEstablished, setoutputConnectionEstablished, outputConnectionSoftware, setoutputConnectionSoftware, outputPasscode, setoutputPasscode, outputUrl, setoutputUrl, finaloutputLine, setfinaloutputLine, seconds, minutes, hours, days, isRunning, start, pause, reset, copiedToaster, vmixDisconected, isConnectNowModalOpen, setIsConnectNowModalOpen, isGenerateURLModalOpen, setisGenerateURLModalOpen, outputOptionsRef, handleShowOutputOption, reconnectingStatus, setreconnectingStatus, generatereconnectingStatus, setgeneratereconnectingStatus, currentLocationPathname, setcurrentLocationPathname, bibleConnections, setbibleConnections, isCurrentNowEdit, setisCurrentNowEdit, activeCarousel, setactiveCarousel, outputPathname, setoutputPathname, selectedSlide, setselectedSlide, carouselRef } = usePreviewXOutput();

    const { activeSongArray, activeLine, setactiveLine, outPutType, setoutPutType } = useSong()
    const { activeChapterContent, selectActiveVersion, selectedVerseArray, setselectedVerseArray, multipleselectedVerseArray, setmultipleselectedVerseArray, getVerseText } = useBible()

    const { isEwGrabberConnected, setIsEwGrabberConnected, ewGrabbedText, setEwGrabberText, ewGrabbedScreen, setEwGrabberImage } = useEwGrabber();

    const iconRef = useRef(null)
    // const [reconnectingStatus, setreconnectingStatus] = useState(false)

    useEffect(() => {
        ipcRenderer.on('setReconnecting', setReconnecting)
        ipcRenderer.on('setReconnectingMulti', setReconnectingMulti)

        return () => {
            ipcRenderer.removeListener('setReconnecting', setReconnecting)
            ipcRenderer.removeListener('setReconnectingMulti', setReconnectingMulti)
        }
    }, [outputConnectionEstablished]);
    useEffect(() => {
        ipcRenderer.on('setGenerateReconnecting', setGenerateReconnecting)
        ipcRenderer.on('checkIfGeneratedLinkActiv', checkIfGeneratedLinkActiv)

        return () => {
            ipcRenderer.removeListener('setGenerateReconnecting', setGenerateReconnecting)
            ipcRenderer.removeListener('checkIfGeneratedLinkActiv', checkIfGeneratedLinkActiv)
        }
    }, [externalConnectionConnectionEstablished]);

    const setReconnecting = (event, data) => {
        // console.log('status', data)
        if (outputConnectionEstablished) {
            if (data == 'close') {

            } else {

                setreconnectingStatus(data)
            }
        }
        if (isLive) {
        }

    }
    const setReconnectingMulti = (event, data) => {
        // console.log('status', data)
        // ser
        if (outputConnectionEstablished) {
            if (data == 'close') {

            } else {

                // setreconnectingStatus(data)
            }
        }
        if (isLive) {
        }

        // setbibleConnections(
        //     (c) =>  c.uuid !== data.connection.uuid ? c : { ...c, reconnecting: data }
        // )

        setbibleConnections(c => c.map(bibleConnection => bibleConnection.uuid !== data.connection.uuid ? bibleConnection : { ...bibleConnection, reconnecting: data.status }))

    }
    const checkIfGeneratedLinkActiv = (event, data) => {
        console.log('checkIfGeneratedLinkActiv', data)
        if (outputConnectionEstablished) {
            if (data == 'close') {

            } else {

                setreconnectingStatus(data)
            }
        }
        if (isLive) {
        }

    }
    const setGenerateReconnecting = (event, data) => {
        console.log('status', data)
        if (externalConnectionConnectionEstablished) {
            if (data == 'close') {

            } else {

                // generatereconnectingStatus
                setgeneratereconnectingStatus(data)
            }
        }
        if (isLive) {
        }

    }


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
    // console.log(bibleConnections)
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

        } else if (location.pathname == "/main/bible" || location.pathname == '/main/ew-graber') {
            setoutPutType('bible')
            if (activeChapterContent.length > 0) {

                if (activeChapterContent.length > 0 && activeLine >= activeChapterContent.length) {
                    setactiveLine(prev => prev - 1)
                } if (activeLine < -1) {
                    setactiveLine(prev => prev + 1)
                } else {
                    if (activeLine !== -1 && activeChapterContent) {
                        // console.log(activeChapterContent)
                        setoutputLine(selectedVerseArray?.text)
                        // setoutputLine(activeChapterContent[activeLine].text)
                    } else {
                        setoutputLine('')
                    }
                }
            }
            // console.log(activeLine)
        }
    }, [activeLine, multipleselectedVerseArray, activeChapterContent]);
    // const carouselRef = useRef(null);

    useEffect(() => {
        console.log(bibleConnections)
    }, [bibleConnections])

    useEffect(() => {
        // console.log(showoutputOptions)
        // console.log(outputOptionsPosition)
        // console.log(location.pathname)
        // console.log(bibleConnections.filter(x => x.path == location.pathname && x.key));

        // setactiveLine(-1);
        // setmultipleselectedVerseArray([])
        // setselectedVerseArray({})
        // setoutputLine('')
        if (!isEwGrabberConnected) {
            setEwGrabberText('')
            setEwGrabberImage('')
        }
        // console.log('clear')


    }, [location.pathname])
    const handleDelete = (current, total) => {
        if (current > total) {
            setselectedSlide(total - 1)
        }
    }

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };

    const CustomDot = ({ onClick, ...rest }) => {
        const {
            onMove,
            index,
            active,
            carouselState: { currentSlide, deviceType }
        } = rest;

        // onMove means if dragging or swiping in progress.
        // active is provided by this lib for checking if the item is active or not.
        if (active) {
            return (
                <li
                    style={{ ...indicatorStyles, background: '#FF3939' }}
                />
            );
        }
        return (
            <li
                style={indicatorStyles}
                onClick={onClick}
                onKeyDown={onClick}
                value={index}
                key={index}
                role="button"
                tabIndex={0}
            />
        );
    };

    const CustomRightArrow = ({ onClick, ...rest }) => {
        const {
            onMove,
            carouselState: { currentSlide, deviceType }
        } = rest;
        // onMove means if dragging or swiping in progress.
        return <ArrowCircleRight onClick={onClick} style={{ ...arrowStyles, right: 15 }} size={10} />;
    };
    const CustomLeftArrow = ({ onClick, ...rest }) => {
        const {
            onMove,
            carouselState: { currentSlide, deviceType }
        } = rest;
        // onMove means if dragging or swiping in progress.
        return <ArrowCircleLeft onClick={onClick} style={{ ...arrowStyles, left: 15 }} size={10} />;
    };


    return (
        <div className='connectionsXnotes'>
            <div className='preview'>
                <div style={{ display: "flex", marginLeft: "24px", marginRight: "24px", justifyContent: "space-between", alignItems: "center", maxHeight: "10%", marginTop: "20px" }}>
                    <span style={{ fontSize: '14px', fontWeight: "600", color: "#FFFFFF", textAlign: "left", }}>Preview</span>

                </div>
                <div style={{ paddingLeft: "24px", paddingRight: "24px", textAlign: "left", flex: 1, alignItems: 'flex-start', display: "flex", flexDirection: "column", gap: "10px" }}>
                    {((location.pathname == "/main/bible" || location.pathname == "/main/ew-graber") && outputLine) && <span style={{ listStyleType: "none", fontSize: '14px', fontWeight: "500", color: "#B1B1B1", cursor: "pointer", textAlign: "left" }} onClick={() => { }}>{multipleselectedVerseArray.length > 0 ? getVerseText(multipleselectedVerseArray).ref : selectedVerseArray?.book_name + " " + selectedVerseArray?.chapter_number + ":" + selectedVerseArray?.verse_number + " (" + selectActiveVersion.toUpperCase() + ")"} </span>}
                    {outputLine && <span style={{ fontSize: '14px', fontWeight: "600", color: "#B1B1B1", lineHeight: "1.3" }}>{(location.pathname == "/main/bible" || location.pathname == "/main/ew-graber") ? (multipleselectedVerseArray.length > 0 ? getVerseText(multipleselectedVerseArray).text : selectedVerseArray?.text) : outputLine} </span>}
                </div>
                <div style={{ flex: 1 }}></div>
            </div>

            {(bibleConnections.filter(x => x.path == outputPathname && x.key).length) < 1 ?
                (<div className='finaloutput'>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "24px", gap: "5px", marginRight: "24px", padding: "20px 0px" }}>
                        <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                            <span style={{ fontSize: '14px', fontWeight: "600", color: "#FFFFFF" }}> Output(Not Connected) </span>
                            <div id={(reconnectingStatus && outputConnectionEstablished) && 'blink'} style={{ height: "11px", width: "11px", borderRadius: "50%", backgroundColor: "#FF3939", marginTop: "5px" }}></div>
                        </div>
                    </div>

                    <div style={{ flex: outputConnectionEstablished }}></div>


                    <div style={{ marginBottom: "20px" }}>
                        <button style={{ width: "164px", height: "53px", backgroundColor: "#FF3939", border: "none", borderRadius: "4px", cursor: "pointer", flex: 1 }} onClick={openConnectNowModal}>
                            <span style={{ color: "white" }}>Connect Now</span>
                        </button>
                    </div>

                    {showoutputOptions && (
                        <div ref={outputOptionsRef}>
                            <OutputOptionsMenu
                                posX={outputOptionsPosition.x}
                                posY={outputOptionsPosition.y}
                                setshowoutputOptions={setshowoutputOptions}
                                setoutputConnectionEstablished={setoutputConnectionEstablished}
                                setisLive={setisLive}
                                showoutputOptions={showoutputOptions}
                                outputOptionsRef={outputOptionsRef}
                                setreconnectingStatus={setreconnectingStatus}
                                iconRef={iconRef}
                                setselectedSlide={setselectedSlide}

                            />
                        </div>
                    )}
                </div>)
                :
                // (<div className='finaloutput-carousel'>

                //     <Carousel
                //         ref={carouselRef}
                //         onChange={(index, item) => {
                //             console.log(index, item)
                //             // setactiveCarousel(bibleConnections.find(x => x.key._attributes.key == item.key.substring(2)))
                //             setactiveCarousel(prev => {
                //                 return { ...prev, [outputPathname]: bibleConnections.find(x => x.key._attributes.key == item.key.substring(2)) }
                //             })
                //         }}
                //         selectedItem={selectedSlide}
                //         className='finaloutput-carousel'
                //         statusFormatter={(current, total) => { handleDelete(current, total); return `` }}
                //         renderArrowPrev={(onClickHandler, hasPrev, label) =>
                //             hasPrev && (
                //                 <ArrowCircleLeft onClick={onClickHandler} title={label} style={{ ...arrowStyles, left: 15 }} size={10} />

                //             )
                //         }
                //         renderArrowNext={(onClickHandler, hasNext, label) =>
                //             hasNext && (
                //                 <ArrowCircleRight onClick={onClickHandler} title={label} style={{ ...arrowStyles, right: 15 }} size={10} />
                //             )
                //         }
                //         showThumbs={false}
                //         renderIndicator={(onClickHandler, isSelected, index, label) => {
                //             if (isSelected) {
                //                 return (
                //                     <li
                //                         style={{ ...indicatorStyles, background: '#FF3939' }}
                //                         aria-label={`Selected: ${label} ${index + 1}`}
                //                         title={`Selected: ${label} ${index + 1}`}
                //                     />
                //                 );
                //             }
                //             return (
                //                 <li
                //                     style={indicatorStyles}
                //                     onClick={onClickHandler}
                //                     onKeyDown={onClickHandler}
                //                     value={index}
                //                     key={index}
                //                     role="button"
                //                     tabIndex={0}
                //                     title={`${label} ${index + 1}`}
                //                     aria-label={`${label} ${index + 1}`}
                //                 />
                //             );
                //         }}
                //     >

                //         {
                //             bibleConnections.filter(x => x.path == outputPathname && x.key).map((item, index) => {
                //                 // setactiveCarousel(item)
                //                 return (
                //                     <div key={item.key._attributes.key} style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", flex: 1, position: 'relative' }}>

                //                         <div className='' style={{ width: '100%' }}>
                //                             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "24px", gap: "5px", marginRight: "24px", padding: "18px 0px" }}>
                //                                 <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                //                                     <span style={{ fontSize: '14px', fontWeight: "600", color: "#FFFFFF" }}>{!outputConnectionEstablished ? "Output(Not Connected)" : "Output (" + capitalize(outputConnectionSoftware) + " - " + activeCarousel[outputPathname]?.key?._text + ")"} </span>
                //                                     <div id={(item.reconnecting && outputConnectionEstablished) && 'blink'} style={{ height: "11px", width: "11px", borderRadius: "50%", backgroundColor: !outputConnectionEstablished ? "#FF3939" : item.reconnecting ? "yellow" : "#3EDB57", marginTop: "5px" }}></div>
                //                                 </div>

                //                                 <div style={{ cursor: "pointer", width: "10px" }} onClick={(e) => {
                //                                     setactiveCarousel(prev => {
                //                                         return { ...prev, [outputPathname]: bibleConnections.find(x => x.key._attributes.key == item.key._attributes.key) }
                //                                     })
                //                                     setTimeout(() => {
                //                                         handleShowOutputOption(e)

                //                                     }, 100);
                //                                 }} ref={iconRef}>
                //                                     <SlOptionsVertical size={15} color='#B1B1B1' />


                //                                 </div>

                //                             </div>


                //                             <div style={{ paddingLeft: "24px", paddingRight: "24px", textAlign: "left", alignItems: "flex-start", display: 'flex', flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: "10px", }}>
                //                                 {(outPutType == 'bible' && finaloutputLine) && <span style={{ listStyleType: "none", fontSize: '14px', fontWeight: "500", color: "#FF3939", textAlign: "left" }} onClick={() => { }}>{multipleselectedVerseArray.length > 0 ? getVerseText(multipleselectedVerseArray).ref : selectedVerseArray?.book_name + " " + selectedVerseArray?.chapter_number + ":" + selectedVerseArray?.verse_number + " (" + selectActiveVersion.toUpperCase() + ")"} </span>}
                //                                 {finaloutputLine && <span style={{ fontSize: '14px', fontWeight: "600", color: "#FF3939", lineHeight: "1.3" }}>{(location.pathname == "/main/bible" || location.pathname == "/main/ew-graber") ? multipleselectedVerseArray.length > 0 ? getVerseText(multipleselectedVerseArray).text : selectedVerseArray?.text : finaloutputLine} </span>}
                //                             </div>


                //                             <div style={{ flex: outputConnectionEstablished }}></div>

                //                         </div>


                //                     </div>

                //                 )
                //             }
                //             )
                //         }
                //     </Carousel>

                //     {showoutputOptions && (
                //         <div ref={outputOptionsRef}>
                //             <OutputOptionsMenu
                //                 posX={outputOptionsPosition.x}
                //                 posY={outputOptionsPosition.y}
                //                 setshowoutputOptions={setshowoutputOptions}
                //                 setoutputConnectionEstablished={setoutputConnectionEstablished}
                //                 setisLive={setisLive}
                //                 showoutputOptions={showoutputOptions}
                //                 outputOptionsRef={outputOptionsRef}
                //                 setreconnectingStatus={setreconnectingStatus}
                //                 iconRef={iconRef}
                //                 setIsConnectNowModalOpen={setIsConnectNowModalOpen}
                //                 isCurrentNowEdit={isCurrentNowEdit}
                //                 setisCurrentNowEdit={setisCurrentNowEdit}
                //                 activeCarousel={activeCarousel}
                //                 setselectedSlide={setselectedSlide}

                //             />
                //         </div>
                //     )}

                // </div>)
                (<div className='finaloutput-carousel'>
                    <Carousel
                        arrows
                        ref={carouselRef}
                        responsive={responsive}
                        customLeftArrow={<CustomLeftArrow />}
                        customRightArrow={<CustomRightArrow />}
                        customDot={<CustomDot />}
                        showDots={true}
                    >
                        {
                            bibleConnections.filter(x => x.path == outputPathname && x.key).map((item, index) => {
                                // setactiveCarousel(item)
                                return (
                                    <div key={item.key._attributes.key} style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", flex: 1, position: 'relative' }}>

                                        <div className='' style={{ width: '100%' }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "24px", gap: "5px", marginRight: "24px", padding: "18px 0px" }}>
                                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                                                    <span style={{ fontSize: '14px', fontWeight: "600", color: "#FFFFFF" }}>{!outputConnectionEstablished ? "Output(Not Connected)" : "Output (" + capitalize(outputConnectionSoftware) + " - " + item?.key?._text + ")"} </span>
                                                    <div id={(item.reconnecting && outputConnectionEstablished) && 'blink'} style={{ height: "11px", width: "11px", borderRadius: "50%", backgroundColor: !outputConnectionEstablished ? "#FF3939" : item.reconnecting ? "yellow" : "#3EDB57", marginTop: "5px" }}></div>
                                                </div>

                                                <div style={{ cursor: "pointer", width: "10px" }} onClick={(e) => {
                                                    console.log(bibleConnections, item)
                                                    setactiveCarousel(prev => {
                                                        return { ...prev, [outputPathname]: bibleConnections.find(x => x.key._attributes.key == item.key._attributes.key) }
                                                    })
                                                    setTimeout(() => {
                                                        handleShowOutputOption(e)

                                                    }, 100);
                                                }} ref={iconRef}>
                                                    <SlOptionsVertical size={15} color='#B1B1B1' />


                                                </div>

                                            </div>


                                            <div style={{ paddingLeft: "24px", paddingRight: "24px", textAlign: "left", alignItems: "flex-start", display: 'flex', flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: "10px", }}>
                                                {(outPutType == 'bible' && finaloutputLine) && <span style={{ listStyleType: "none", fontSize: '14px', fontWeight: "500", color: "#FF3939", textAlign: "left" }} onClick={() => { }}>{multipleselectedVerseArray.length > 0 ? getVerseText(multipleselectedVerseArray).ref : selectedVerseArray?.book_name + " " + selectedVerseArray?.chapter_number + ":" + selectedVerseArray?.verse_number + " (" + selectActiveVersion.toUpperCase() + ")"} </span>}
                                                {finaloutputLine && <span style={{ fontSize: '14px', fontWeight: "600", color: "#FF3939", lineHeight: "1.3" }}>{(location.pathname == "/main/bible" || location.pathname == "/main/ew-graber") ? multipleselectedVerseArray.length > 0 ? getVerseText(multipleselectedVerseArray).text : selectedVerseArray?.text : finaloutputLine} </span>}
                                            </div>


                                            <div style={{ flex: outputConnectionEstablished }}></div>

                                        </div>


                                    </div>

                                )
                            }
                            )
                        }
                    </Carousel>
                    {showoutputOptions && (
                        <div ref={outputOptionsRef}>
                            <OutputOptionsMenu
                                posX={outputOptionsPosition.x}
                                posY={outputOptionsPosition.y}
                                setshowoutputOptions={setshowoutputOptions}
                                setoutputConnectionEstablished={setoutputConnectionEstablished}
                                setisLive={setisLive}
                                showoutputOptions={showoutputOptions}
                                outputOptionsRef={outputOptionsRef}
                                setreconnectingStatus={setreconnectingStatus}
                                iconRef={iconRef}
                                setIsConnectNowModalOpen={setIsConnectNowModalOpen}
                                isCurrentNowEdit={isCurrentNowEdit}
                                setisCurrentNowEdit={setisCurrentNowEdit}
                                activeCarousel={activeCarousel}
                                setselectedSlide={setselectedSlide}
                                carouselRef={carouselRef}

                            />
                        </div>)
                    }
                </div>)

            }

            {/* <div className='externalConnection'>
                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", marginTop: "20px", marginLeft: "24px", gap: "5px" }}>
                    <span style={{ fontSize: '14px', fontWeight: "600", color: "#FFFFFF" }}>Remote Connection Code</span>
                    <div id={(generatereconnectingStatus && externalConnectionConnectionEstablished) && 'blink'} style={{ marginTop: "3px", height: "11px", width: "11px", borderRadius: "50%", backgroundColor: externalConnectionConnectionEstablished === 0 ? "transparent" : "#3EDB57" }}></div>
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
            </div> */}

        </div >
    );
}

export default PreviewXOutput;


{/* <div className='finaloutput'>

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "24px", gap: "5px", marginRight: "24px", padding: "20px 0px" }}>
        <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
            <span style={{ fontSize: '14px', fontWeight: "600", color: "#FFFFFF" }}>{!outputConnectionEstablished ? "Output(Not Connected)" : "Output (" + capitalize(outputConnectionSoftware) + ")"} </span>
            <div id={(reconnectingStatus && outputConnectionEstablished) && 'blink'} style={{ height: "11px", width: "11px", borderRadius: "50%", backgroundColor: !outputConnectionEstablished ? "#FF3939" : reconnectingStatus ? "yellow" : "#3EDB57", marginTop: "5px" }}></div>
        </div>
        {
            outputConnectionEstablished == 1 &&
            <button style={{ width: "82px", height: "30px", backgroundColor: "#15181C", border: "1px solid #FF3939", borderRadius: "4px", cursor: "pointer", borderColor: isLive ? "#3EDB57" : "#FF3939" }} onClick={() => setisLive(prev => !prev)}>
                <span style={{ color: isLive ? "#3EDB57" : "#FF3939" }}>{!isLive ? "Go Live" : "Live"}</span>
            </button>
        }
        {
            outputConnectionEstablished == 1 &&
            <div style={{ cursor: "pointer", width: "10px" }} onClick={handleShowOutputOption} ref={iconRef}>
                <SlOptionsVertical size={15} color='#B1B1B1' />


            </div>
        }
    </div>
    {
        finaloutputLine &&
        <div style={{ paddingLeft: "24px", paddingRight: "24px", textAlign: "left", alignItems: "flex-start", display: 'flex', flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: "10px", }}>
            {(outPutType == 'bible' && finaloutputLine) && <span style={{ listStyleType: "none", fontSize: '14px', fontWeight: "500", color: "#FF3939", textAlign: "left" }} onClick={() => { }}>{multipleselectedVerseArray.length > 0 ? getVerseText(multipleselectedVerseArray).ref : selectedVerseArray?.book_name + " " + selectedVerseArray?.chapter_number + ":" + selectedVerseArray?.verse_number + " (" + selectActiveVersion.toUpperCase() + ")"} </span>}
            {finaloutputLine && <span style={{ fontSize: '14px', fontWeight: "600", color: "#FF3939", lineHeight: "1.3" }}>{(location.pathname == "/main/bible" || location.pathname == "/main/ew-graber") ? multipleselectedVerseArray.length > 0 ? getVerseText(multipleselectedVerseArray).text : selectedVerseArray?.text : finaloutputLine} </span>}
        </div>
    }

    <div style={{ flex: outputConnectionEstablished }}></div>

    {
        //button
        outputConnectionEstablished !== 1 &&
        <div style={{ marginBottom: "20px" }}>
            <button style={{ width: "164px", height: "53px", backgroundColor: "#FF3939", border: "none", borderRadius: "4px", cursor: "pointer", flex: 1 }} onClick={openConnectNowModal}>
                <span style={{ color: "white" }}>Connect Now</span>
            </button>
        </div>
    }
    {showoutputOptions && (
        <div ref={outputOptionsRef}>
            <OutputOptionsMenu
                posX={outputOptionsPosition.x}
                posY={outputOptionsPosition.y}
                setshowoutputOptions={setshowoutputOptions}
                setoutputConnectionEstablished={setoutputConnectionEstablished}
                setisLive={setisLive}
                showoutputOptions={showoutputOptions}
                outputOptionsRef={outputOptionsRef}
                setreconnectingStatus={setreconnectingStatus}
                iconRef={iconRef}

            />
        </div>
    )}
</div> */}