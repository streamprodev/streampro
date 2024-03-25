import React, { useEffect } from 'react'
import xsplit from '../../../assets/xsplit.png';
import { useEwGrabber } from '../../../context/EwGrabberContext';
import { useBible } from '../../../context/BibleContext';
import { useSong } from '../../../context/SongContext';
const { ipcRenderer } = window.require('electron');

function ImageOutputXGrabPanel() {


    const { ewGrabbedText, setEwGrabberText, ewGrabbedImage, setEwGrabberImage, ewGrabbedScreen, setEwGrabberScreen, isEwGrabberConnected, setIsEwGrabberConnected, ewGrabbedBibleName, setEwGrabberBibleName, ewGrabbedBibleChapter, setEwGrabberBibleChapter, ewGrabbedBibleVerse, setEwGrabberBibleVerse, ewGrabbedBibleVersion, setEwGrabberBibleVersion } = useEwGrabber();
    const { activeId, setactiveId, setactiveLine, activeLine } = useSong()

    const { setselectedBook, setChapterContent, searchBook, setsearchBook, books, chapters, NewTestamentBooks, OldTestamentBooks, searchChapter, setsearchChapter, searchVerse, setsearchVerse, searchBookObj, setsearchBookObj, searchChapterObj, setsearchChapterObj, searchBookTemp, setsearchBookTemp, showSelectVersionMenu, setshowSelectVersionMenu, setshowSelectVersionMenuPosition, selectActiveVersionName, handleKeyPress, searchTerm, setSearchTerm, contentChapterRef, detectKeyDown, bookmarkopen, setbookmarkOPen, deleteBookmark, addBookmark, bookmarkedData, setbookmarkedData, setsearchData, inputBookRef, setselectedVerseArray, activeBook, bookmarkRef, inputVerseRef, searchResultRef, setsearchResultRef, multipleselectedVerseArray, setmultipleselectedVerseArray, bookmarkView, setbookmarkView, historyData, sethistoryData } = useBible()

    // const [ewGrabbedBibleName, setEwGrabberBibleName] = React.useState('')
    // const [ewGrabbedBibleChapter, setEwGrabberBibleChapter] = React.useState('')
    // const [ewGrabbedBibleVerse, setEwGrabberBibleVerse] = React.useState('')
    // const [ewGrabbedBibleVersion, setEwGrabberBibleVersion] = React.useState('')

    const updateGrabbedText = (event, text) => {
        setEwGrabberText(text)
        // setEwGrabberImage(ewGrabbedImage)
    }

    const updateGrabbedImage = (event, arrayBuffer) => {

        setEwGrabberImage(btoa(String.fromCharCode(...new Uint8Array(arrayBuffer))))
    }

    const updateGrabbedScreen = (event, screens) => {
        // console.log(screens)
        setEwGrabberScreen(screens.length)
    }

    const updateGrabbedTest = (event, text) => {
        console.log(text)
    }
    useEffect(() => {
        ipcRenderer.on('grabber-finished-test', updateGrabbedTest)
        ipcRenderer.on('grabber-finished', updateGrabbedText)
        ipcRenderer.on('grabber-finished-image', updateGrabbedImage)
        ipcRenderer.on('grabber-finished-screen', updateGrabbedScreen)

        return () => {
            ipcRenderer.removeListener('grabber-finished-test', updateGrabbedTest)
            ipcRenderer.removeListener('grabber-finished', updateGrabbedText);
            ipcRenderer.removeListener('grabber-finished-image', updateGrabbedImage);
            ipcRenderer.removeListener('grabber-finished-screen', updateGrabbedScreen);
        }
    }, []);


    useEffect(() => {
        console.log(ewGrabbedText)
        if (ewGrabbedText?.length == 0) {
            setEwGrabberBibleName('')
            setEwGrabberBibleChapter('')
            setEwGrabberBibleVerse('')
            setEwGrabberBibleVersion('')
        } else {
            // const splitted = ewGrabbedText.match(/\w+|\d+|(\d+-\d+)|\(\w+\)/g);
            const splitted = ewGrabbedText.replace(/\(([^)]+)\)/, '$1').match(/\w+|\d+/g);
            console.log(splitted)
            if (splitted.length == 6) {
            } else if (splitted.length == 5) {
                const bibleName = splitted[0];
                const chapter = splitted[1];
                const verseStart = splitted[2];
                const verseEnd = splitted[3];
                const version = splitted[4];
                setEwGrabberBibleName(bibleName)
                setEwGrabberBibleChapter(chapter)
                setEwGrabberBibleVerse(verseStart + '-' + verseEnd)
                setEwGrabberBibleVersion(version)

                const book = books.find(user => user.label === splitted[0]);
                if (book) {
                    setselectedBook(book)
                    setsearchBookObj(book)
                    setsearchBook(book.label)
                    setsearchChapter(splitted[1])
                    setTimeout(() => {
                        setChapterContent(book.book_number, splitted[1])
                    }, 20);
                    setTimeout(() => {
                        setsearchVerse(splitted[2])
                    }, 30);

                    setactiveLine(splitted[2] + 1);

                    // console.log(verseStart, verseEnd);
                    // console.log(activeBook.filter(({ book_number, chapter_number, verse_number }) => (chapter_number == parseInt(chapter)) && (book_number == book.book_number) && (verse_number >= parseInt(verseStart) && verse_number <= parseInt(verseEnd))))
                    setmultipleselectedVerseArray(activeBook.filter(({ book_number, chapter_number, verse_number }) => (chapter_number == parseInt(chapter)) && (book_number == book.book_number) && (verse_number >= parseInt(verseStart) && verse_number <= parseInt(verseEnd))))

                }
            } else if (splitted.length == 4) {
                setEwGrabberBibleName(splitted[0])
                setEwGrabberBibleChapter(splitted[1])
                setEwGrabberBibleVerse(splitted[2])
                setEwGrabberBibleVersion(splitted[3])

                const book = books.find(user => user.label === splitted[0]);
                if (book) {
                    setselectedBook(book)
                    setsearchBookObj(book)
                    setsearchBook(book.label)
                    setsearchChapter(splitted[1])
                    setTimeout(() => {
                        setChapterContent(book.book_number, splitted[1])
                    }, 20);
                    setTimeout(() => {
                        // setChapterContent(book.book_number, splitted[1])
                        setsearchVerse(splitted[2])
                    }, 30);

                    setactiveLine(splitted[2] + 1);
                    setmultipleselectedVerseArray([])
                    setselectedVerseArray(activeBook.find(({ book_number, chapter_number, verse_number }) => verse_number == splitted[2] && chapter_number == parseInt(splitted[1]) && book_number == book.book_number))

                }
            }

        }
    }, [ewGrabbedText])

    useEffect(() => {
        if (isEwGrabberConnected) {
            setEwGrabberBibleName('')
            setEwGrabberBibleChapter('')
            setEwGrabberBibleVerse('')
            setEwGrabberBibleVersion('')
        }

    }, [isEwGrabberConnected])




    return (
        <div className='ImageOutputXGrabPanel' >




            <div className='songsList' style={{ borderRadius: "10px", flex: "1", paddingLeft: "24px", overflow: "scroll", }} >


                <div style={{ display: 'flex', alignItems: "center", gap: "12px", flexDirection: "column", paddingTop: "20px" }}>
                    <div style={{ display: 'flex', alignSelf: "flex-start", gap: "12px", }}><span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Easy Worship Output</span></div>
                    <div style={{ flex: 1 }}>
                        {
                            (ewGrabbedImage && isEwGrabberConnected) &&
                            <img src={`data:image/png;base64,${ewGrabbedImage}`} alt="logo" height={250} width={"100%"} />
                        }
                    </div>

                </div>
            </div>
            <div className='songsList' style={{ borderRadius: "10px", flex: "1", paddingLeft: "24px", overflow: "scroll", }} >


                <div style={{ display: 'flex', alignItems: "center", gap: "12px", flexDirection: "column", justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignSelf: "flex-start", gap: "12px", paddingTop: "20px" }}><span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Grab Type: {isEwGrabberConnected && "Bible"}</span></div>


                    {
                        isEwGrabberConnected &&
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: -1 }} >
                                <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}> Book Name</span>
                                <p style={{ fontWeight: "400", color: "#B1B1B1", fontSize: "14px", paddingTop: "-10px" }}> {ewGrabbedBibleName}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}> Bible Chapter</span>
                                <p style={{ fontWeight: "400", color: "#B1B1B1", fontSize: "14px", paddingTop: "-10px" }}> {ewGrabbedBibleChapter}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}> Bible Verse</span>
                                <p style={{ fontWeight: "400", color: "#B1B1B1", fontSize: "14px", paddingTop: "-10px" }}> {ewGrabbedBibleVerse}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Bible Version</span>
                                <p style={{ fontWeight: "400", color: "#B1B1B1", fontSize: "14px", paddingTop: "-10px" }}> {ewGrabbedBibleVersion}</p>
                            </div>
                        </div>
                    }


                </div>

                <div className='' style={{ overflow: "scroll", height: "100%" }}>



                </div>
            </div>
        </div>


    );
}

export default ImageOutputXGrabPanel