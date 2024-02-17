import React, { useEffect } from 'react'
import xsplit from '../../../assets/xsplit.png';
import { useEwGrabber } from '../../../context/EwGrabberContext';
import { useBible } from '../../../context/BibleContext';
const { ipcRenderer } = window.require('electron');

function ImageOutputXGrabPanel() {


    const { ewGrabbedText, setEwGrabberText, ewGrabbedImage, setEwGrabberImage } = useEwGrabber();

    const { setselectedBook, setChapterContent, searchBook, setsearchBook, books, chapters, NewTestamentBooks, OldTestamentBooks, searchChapter, setsearchChapter, searchVerse, setsearchVerse, searchBookObj, setsearchBookObj, searchChapterObj, setsearchChapterObj, searchBookTemp, setsearchBookTemp, showSelectVersionMenu, setshowSelectVersionMenu, setshowSelectVersionMenuPosition, selectActiveVersionName, handleKeyPress, searchTerm, setSearchTerm, contentChapterRef, detectKeyDown, bookmarkopen, setbookmarkOPen, deleteBookmark, addBookmark, bookmarkedData, setbookmarkedData, setsearchData, inputBookRef, setselectedVerseArray, activeBook, bookmarkRef, inputVerseRef, searchResultRef, setsearchResultRef, multipleselectedVerseArray, setmultipleselectedVerseArray, bookmarkView, setbookmarkView, historyData, sethistoryData } = useBible()

    const [ewGrabbedBibleName, setEwGrabberBibleName] = React.useState('')
    const [ewGrabbedBibleChapter, setEwGrabberBibleChapter] = React.useState('')
    const [ewGrabbedBibleVerse, setEwGrabberBibleVerse] = React.useState('')
    const [ewGrabbedBibleVersion, setEwGrabberBibleVersion] = React.useState('')

    const updateGrabbedText = (event, text) => {
        setEwGrabberText(text)
        // setEwGrabberImage(ewGrabbedImage)
    }

    const updateGrabbedImage = (event, arrayBuffer) => {

        const base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        setEwGrabberImage(base64String)
    }
    useEffect(() => {
        ipcRenderer.on('grabber-finished', updateGrabbedText)
        ipcRenderer.on('grabber-finished-image', updateGrabbedImage)

        return () => {
            ipcRenderer.removeListener('grabber-finished', updateGrabbedText);
            ipcRenderer.removeListener('grabber-finished-image', updateGrabbedImage);
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
            if (splitted.length == 5) {
                setEwGrabberBibleName(splitted[0])
                setEwGrabberBibleChapter(splitted[1])
                setEwGrabberBibleVerse(splitted[2])
                setEwGrabberBibleVersion(splitted[4])

                const book = books.find(user => user.label === splitted[0]);
                console.log(book)
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

                }
                // setselectedChapter(chapters.find(({ book_id, chapter_number }) => (book_id == selectedBook.book_id && chapter_number == value)))
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

                }
            }

        }
    }, [ewGrabbedText])




    return (
        <div className='ImageOutputXGrabPanel' >




            <div className='songsList' style={{ borderRadius: "10px", flex: "1", paddingLeft: "24px", overflow: "scroll", }} >


                <div style={{ display: 'flex', alignItems: "center", gap: "12px", flexDirection: "column", paddingTop: "20px" }}>
                    <div style={{ display: 'flex', alignSelf: "flex-start", gap: "12px", }}><span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Easy Worship Output</span></div>
                    <div style={{ flex: 1 }}>
                        <img src={`data:image/png;base64,${ewGrabbedImage}`} alt="logo" height={250} />
                    </div>

                </div>
            </div>
            <div className='songsList' style={{ borderRadius: "10px", flex: "1", paddingLeft: "24px", overflow: "scroll", }} >


                <div style={{ display: 'flex', alignItems: "center", gap: "12px", flexDirection: "column" }}>
                    <div style={{ display: 'flex', alignSelf: "flex-start", gap: "12px", paddingTop: "20px" }}><span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Grab Type: Bible</span></div>

                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }} >
                            <span> Book Name</span>
                            <p> {ewGrabbedBibleName}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span> Bible Chapter</span>
                            <p> {ewGrabbedBibleChapter}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span> Bible Verse</span>
                            <p> {ewGrabbedBibleVerse}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>Bible Version</span>
                            <p> {ewGrabbedBibleVersion}</p>
                        </div>
                    </div>


                </div>

                <div className='' style={{ overflow: "scroll", height: "100%" }}>



                </div>
            </div>
        </div>


    );
}

export default ImageOutputXGrabPanel