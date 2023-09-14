
import { useEffect, useMemo, useState, useRef } from 'react';
import SideBar from '../../SideBar';
import CreateSongModal from '../../CreateSongModal';
import { Copy, Edit2, ProfileCircle, SearchNormal, Setting2, ArrowDown2, ArrowUp2, Book1, Book } from 'iconsax-react';
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
import { StyledBibleInput, StyledBibleInputVerse } from '../../FormComponents';
import { useBible } from '../../../context/BibleContext';
import { Hint } from 'react-autocomplete-hint';
import BooksListItem from '../../BooksListItem';
import SelectVersionMenu from './SelectVersionMenu';
import BibleBookmarkItem from './BibleBookmarkItem';
const { ipcRenderer } = window.require('electron');

function BookmarkXBooks() {



    const songListRef = useRef(null);
    const [oldTestamentSectionOpen, setoldTestamentSectionOpen] = useState(false)
    const [newTestamentSectionOpen, setnewTestamentSectionOpen] = useState(false)
    const [showVersionOption, setshowVersionOption] = useState(false)
    const [searchBookObjTemp, setsearchBookObjTemp] = useState([])
    const [lastSuggestion, setlastSuggestion] = useState([])

    const { activeId, setactiveId, setBody, setTitle, activeSongArray, menuEditId, setmenuEditId, setactiveLine, activeLine, displayData, openModal, setisDeleteModalOpen, deleteSong, setdeleteSong } = useSong()

    const { inputType, setinputType, searchBook, setsearchBook, books, chapters, NewTestamentBooks, OldTestamentBooks, searchChapter, setsearchChapter, searchVerse, setsearchVerse, searchBookObj, setsearchBookObj, searchChapterObj, setsearchChapterObj, searchBookTemp, setsearchBookTemp, showSelectVersionMenu, setshowSelectVersionMenu, setshowSelectVersionMenuPosition, selectActiveVersionName, handleKeyPress, searchTerm, setSearchTerm, contentChapterRef, detectKeyDown, bookmarkopen, setbookmarkOPen, deleteBookmark, addBookmark, bookmarkedData, setbookmarkedData, setsearchData, inputBookRef, setselectedVerseArray, activeBook, bookmarkRef, inputVerseRef, searchResultRef, setsearchResultRef, multipleselectedVerseArray, setmultipleselectedVerseArray } = useBible()

    // const [searchBookTemp, setsearchBookTemp] = useState(searchBookObj.label);
    const [searchChapterTemp, setsearchChapterTemp] = useState();
    const [bookChapters, setbookChapters] = useState([]);
    const [spaceCount, setspaceCount] = useState(0);

    // console.log(NewTestamentBooks)

    function capitalize(str) {
        const lower = str.toLowerCase();
        return str.charAt(0).toUpperCase() + lower.slice(1);
    }

    const searchFieldRef = useRef(null)

    useEffect(() => {
        const inputBookElement = inputBookRef.current;
        if ((inputBookElement) && document.activeElement !== inputBookElement) {
            if (searchBook.length) {
                inputBookElement.style.width = getTextWidth(searchBook);

            } else {
                inputBookElement.style.width = `${7.7}px`;
            }
        }


    }, [searchBook])

    useEffect(() => {

        setTimeout(() => {

        }, 100);
        const inputBookElement = inputBookRef.current;
        if ((inputBookElement) && document.activeElement !== inputBookElement) {
            if (searchBook.length) {
                inputBookElement.style.width = getTextWidth(searchBook);

            } else {
                inputBookElement.style.width = `${7.7}px`;
            }
        }

        const inputChapterElement = inputChapterRef.current;
        if (inputChapterElement) {
            inputChapterElement.style.width = 'auto';
            if (searchChapter.toString().length) {
                inputChapterElement.style.width = `${searchChapter.toString().length * 7.7 ?? 7.7}px`;
            } else {
                inputChapterElement.style.width = `${7.7}px`;
            }
        }

        const inputVerseElement = inputVerseRef.current;
        if (inputVerseElement) {
            inputVerseElement.style.width = 'auto';
            if (searchVerse.toString().length) {
                inputVerseElement.style.width = `${searchVerse.toString().length * 7.7 ?? 7.7}px`;
            } else {
                inputVerseElement.style.width = `${7.7}px`;
            }
        }
    }, [inputType]);

    useEffect(() => {
        const inputChapterElement = inputChapterRef.current;
        if (inputChapterElement) {
            inputChapterElement.style.width = 'auto';
            if (searchChapter.toString().length) {
                inputChapterElement.style.width = `${searchChapter.toString().length * 7.7 ?? 7.7}px`;
            } else {
                inputChapterElement.style.width = `${7.7}px`;
            }
        }
    }, [searchChapter]);

    useEffect(() => {
        const inputVerseElement = inputVerseRef.current;
        if (inputVerseElement) {
            inputVerseElement.style.width = 'auto';
            if (searchVerse.toString().length) {
                inputVerseElement.style.width = `${searchVerse.toString().length * 7.7 ?? 7.7}px`;
            } else {
                inputVerseElement.style.width = `${7.7}px`;
            }


        }

    }, [searchVerse]);

    useEffect(() => {
        setsearchChapterObj(chapters.find(({ chapter_number, book_number }) => chapter_number == searchChapter && book_number == searchBookObj.book_number))

    }, [searchChapter]);



    function getTextWidth(inputText) {

        const font = "15.2px times new roman";
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = font;
        const width = context.measureText(inputText).width;
        return Math.ceil(width) + "px";


    }


    const songDisplayRef = useRef(null);
    const outputOptionsRef = useRef(null);

    // const inputBookRef = useRef(null);
    const inputChapterRef = useRef(null);
    // const inputVerseRef = useRef(null);

    // Function to handle the input change and update the width
    const handleInputBookChange = (event) => {
        const inputElement = inputBookRef.current;
        if (inputElement) {

            // inputElement.style.width = 'auto';
            // inputElement.style.width = `${inputElement.value.length*7.7 ?? 10}px`;
        }
        if (event.code == 'Space') {
            setspaceCount(prev => prev + 1)
            if (countWords(searchBookTemp) == countWords(searchBook) || spaceCount == 1) {
                // console.log(event)
                setsearchBook(searchBookTemp)
                const inputElement = inputBookRef.current;
                inputElement.style.width = 'auto';
                inputElement.style.width = getTextWidth(searchBookTemp);
                setsearchChapter(1)
                const inputChapterElement = inputChapterRef.current;
                setTimeout(() => {
                    inputChapterElement.select();
                }, 70);
                setspaceCount(0)

                contentChapterRef.current.scrollTo({ top: 0, behavior: 'smooth' });

            }
        } else {
            setspaceCount(0)
        }
    };

    const handleInputChapterKeyDown = (event) => {
        if (event.code == 'Space') {
            const inputElement = inputVerseRef.current;
            inputElement.focus()
        }
    }

    const handleInputChapterChange = (event) => {
        const inputElement = inputChapterRef.current;
        if (inputElement && document.activeElement === inputElement) {
            if (inputElement.value < 0 || !inputElement.value) {
                setsearchChapter(1)
                // setselectedVerseArray(activeBook.find(({ book_number, chapter_number, verse_number }) => verse_number == 1 && chapter_number === 1 && book_number == searchBookObj.book_number))
                setTimeout(() => {
                    inputElement.select();
                }, 50);
            } else if (inputElement.value > parseInt(searchBookObj.chapter_count)) {
                // setsearchChapter(inputElement.value)
                inputElement.select();
                // inputElement.style.width = `${inputElement.value.length * 7.7 ?? 7.7}px`;
            }
            else {
                setsearchChapter(inputElement.value)
                // setselectedVerseArray(activeBook.find(({ book_number, chapter_number, verse_number }) => verse_number == 1 && chapter_number === inputElement.value && book_number == searchBookObj.book_number))
                inputElement.style.width = 'auto';
                inputElement.style.width = `${inputElement.value.length * 7.7 ?? 7.7}px`;
            }
            // setsearchVerse(1)
            // setactiveLine(-1)

        } else {
            inputElement.style.width = 'auto';
            if (inputElement.value.length) {
                inputElement.style.width = `${inputElement.value.length * 7.7 ?? 7.7}px`;
            } else {
                inputElement.style.width = `${7.7}px`;
            }
        }
    };
    const handleInputVerseChange = (event) => {
        const inputElement = inputVerseRef.current;
        if (inputElement && document.activeElement === inputElement) {
            if (inputElement.value < 0 || !inputElement.value) {
                setsearchVerse(1)

                // setselectedVerseArray(activeBook.find(({ book_number, chapter_number, verse_number }) => verse_number == 1 && chapter_number === searchChapter && book_number == searchBookObj.book_number))
                setTimeout(() => {
                    inputElement.select();
                }, 200);
            } else if (inputElement.value > parseInt(searchChapterObj.verses_count)) {
                inputElement.select();
                // inputElement.style.width = 'auto';
                // inputElement.style.width = `${inputElement.value.length * 7.7 ?? 7.7}px`;
            }
            else {
                setsearchVerse(inputElement.value)
                console.log(inputElement.value, searchChapter, searchBookObj.book_number)
                console.log(activeBook.find(({ book_number, chapter_number, verse_number }) => verse_number == inputElement.value && chapter_number == searchChapter && book_number == searchBookObj.book_number), inputElement.value, searchChapter, searchBookObj)
                setselectedVerseArray(activeBook.find(({ book_number, chapter_number, verse_number }) => verse_number == inputElement.value && chapter_number == parseInt(searchChapter) && book_number == searchBookObj.book_number))
                inputElement.style.width = 'auto';
                inputElement.style.width = `${inputElement.value.length * 7.7 ?? 7.7}px`;
            }

        } else {
            // console.log(inputElement.value)
            inputElement.style.width = 'auto';
            if (inputElement.value.length) {
                inputElement.style.width = `${inputElement.value.length * 7.7 ?? 7.7}px`;
            } else {
                inputElement.style.width = `${7.7}px`;
            }
        }

    };
    const handleInputVerseKeyDown = (event) => {
        // console.log(event)
        if (!event.shiftKey) {
            setmultipleselectedVerseArray([])
        } else {
            const inputElement = inputVerseRef.current;
            if (inputElement) {
                if (inputElement.value == event.key) {
                    setselectedVerseArray(activeBook.find(({ book_number, chapter_number, verse_number }) => verse_number == event.key && chapter_number == searchChapter && book_number == searchBookObj.book_number))

                }
            }

        }


    };

    const handleShowAccountMenu = (e) => {

        // setActiveItem(itemId);
        if (showSelectVersionMenu) {
            setshowSelectVersionMenu(false);
            return
        }
        const clickX = e.clientX;
        const clickY = e.clientY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const menuW = 350;
        const menuH = 270;

        const posX = clickX + menuW > screenW ? screenW - menuW : clickX;
        const posY = clickY;

        setshowSelectVersionMenuPosition({ x: 239, y: 420 });
        setTimeout(() => {
            setshowSelectVersionMenu(true);
        }, 100);
    }

    function countWords(str) {
        let counts = {};
        let number = 0
        let words = str.split(' ');
        for (let word of words) {
            if (word.length > 0) {
                if (!(word in counts)) {
                    counts[word] = 0;
                }
                counts[word] += 1;
                number += 1;
            }
        }
        return number;
    }




    return (
        <div className='bookmarkXbooks' style={{}} onKeyDown={detectKeyDown}>
            <div className={bookmarkopen ? 'bible-bookmarks bookmark-show' : 'bible-bookmarks bookmark-hide'} >
                <div className='' style={{ width: "90%", alignItems: "center", textAlign: "left", fontSize: "14px", paddingLeft: "24px", display: "flex", flexDirection: "row", paddingTop: "5px", justifyContent: "space-between" }}>
                    <p style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Bookmarks</p>
                    {
                        bookmarkopen ?
                            <ArrowUp2 size="20" color="#d9e3f0" onClick={() => { setbookmarkOPen(false) }} style={{ cursor: 'pointer', paddingRight: "13px" }} />
                            :
                            <ArrowDown2 size="20" color="#d9e3f0" onClick={() => { setbookmarkOPen(true) }} style={{ cursor: 'pointer', paddingRight: "13px" }} />
                    }
                </div>
                <div className='' style={{ overflow: "scroll", height: "100%", paddingLeft: "24px", width: "90%", }} ref={bookmarkRef}>
                    {
                        bookmarkedData.length > 0 &&
                        bookmarkedData.map((item) => (
                            <BibleBookmarkItem key={item.id} verse={item} type={'bookmark'} />
                        ))
                    }

                    {/* <ToastContainer/> */}
                </div>
            </div>





            <div className='BooksList' style={{ borderRadius: "10px", flex: "1", paddingLeft: "24px", paddingRight: "24px", overflow: "hidden" }} >
                <div style={{ background: "#15181C", alignItems: "flex-start", textAlign: "left", fontSize: "14px", borderTopRightRadius: "4px", borderTopLeftRadius: "4px", }}>
                    <p style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", paddingTop: "18px", background: "#15181C" }}>Scriptures</p>
                </div>
                {
                    inputType == "search" ?
                        <div style={{ position: "sticky", background: "#15181C", alignItems: "center", fontSize: "14px", display: "flex", flexDirection: "row", justifyContent: "space-between", width: "106.3%" }}>
                            {/* <div className='' style={{ width: "90%",height:"100%" }}>
                            </div> */}
                            <input type="text" placeholder="Search Scripture" className="search-input-bible" onKeyUp={handleKeyPress} onChange={(event) => setSearchTerm(event.target.value)} value={searchTerm} ref={searchFieldRef} />
                            <SearchNormal size={20} style={{ position: "relative", left: "-33", top: "0", cursor: "pointer" }} onClick={() => setinputType('scripture')} />

                        </div>
                        :
                        <div style={{ textAlign: "left", fontSize: "14px", borderRadius: "4px", display: "flex", justifyContent: "space-between", border: "1px solid var(--low-emphasis, #B1B1B1)", paddingRight: "21px", height: "33px", width: "90%", gap: "1px", padding: "6px 16px", alignItems: "center" }}>
                            <div style={{ textAlign: "left", fontSize: "14px", display: "flex", justifyContent: "flex-start", paddingRight: "22px", flex: "9", alignItems: "center", gap: "15px" }}>

                                <div style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}>

                                    {/* <p style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Book:</p> */}
                                    <div style={{}} onClick={() => {
                                        const inputElement = inputBookRef.current;
                                        if (inputElement) {
                                            setTimeout(() => {
                                                inputElement.select();

                                            }, 100);
                                        }
                                    }}>
                                        <Hint options={books} allowTabFill className="hint-body"
                                            onFill={value => {
                                                const inputElement = inputChapterRef.current;
                                                setsearchBookObj(value)
                                                // setselectedVerseArray(activeBook.find(({ book_number, chapter_number, verse_number }) => verse_number == 1 && chapter_number == 1 && book_number == value.book_number))
                                                setspaceCount(0)
                                                setTimeout(() => {
                                                    inputElement.select();
                                                }, 70);
                                                // setactiveLine(-1)
                                                // inputElement.select()
                                            }}
                                            onHint={value => {

                                                const inputElement = inputBookRef.current;
                                                if (value) {
                                                    inputElement.style.width = 'auto';
                                                    inputElement.style.width = getTextWidth(value.label);
                                                    // inputElement.style.width = `${value.label.length * 7}px`;
                                                    setsearchBookObj(value)
                                                    // console.log(value.book_number)
                                                    // setselectedVerseArray(activeBook.find(({ book_number, chapter_number, verse_number }) => verse_number == 1 && chapter_number == 1 && book_number == value.book_number))
                                                    setsearchBookTemp(value.label)
                                                    if (inputElement.value) {
                                                        setsearchBook(capitalize(inputElement.value))
                                                    } else {
                                                        setsearchBook(value.label.charAt(0).toUpperCase())
                                                    }
                                                    setsearchChapter(1)
                                                    // setactiveLine(-1)
                                                    // setTimeout(() => {
                                                    //     setsearchVerse(1)
                                                    // }, 10);
                                                } else if (inputElement.value.length < 1 && searchBookTemp) {

                                                    setsearchBook(searchBookTemp)
                                                    setsearchChapter(1)
                                                    // setactiveLine(-1)
                                                    setTimeout(() => {
                                                        inputElement.select();
                                                    }, 50);
                                                } else if ((searchBookTemp) && (inputElement.value.length > 2) && (searchBookTemp.toUpperCase() == inputElement.value.toUpperCase())) {

                                                    setsearchBook(capitalize(inputElement.value))
                                                    if (document.activeElement === inputElement) {
                                                        setTimeout(() => {
                                                            inputElement.select();

                                                        }, 50);

                                                    }
                                                } else if (!isNaN(inputElement.value.charAt(0)) && inputElement.value.length == 2) {
                                                    if (countWords(searchBookTemp) == 2) {
                                                        console.log(inputElement.value)
                                                        console.log(inputElement.value.split(""))
                                                        const strings = inputElement.value.split("")
                                                        if (!isNaN(strings[0])) {
                                                            setsearchBook(strings[0] + " " + strings[1].toUpperCase())
                                                        }
                                                        // setsearchBook(searchBookTemp.substring(0, 3))
                                                    }
                                                } else {

                                                    inputElement.select()
                                                }
                                            }}
                                        >
                                            <input type="text" ref={inputBookRef} className='scripture-input-book' value={searchBook} onBlur={() => {
                                                setsearchBook(searchBookTemp)
                                                const inputElement = inputBookRef.current;
                                                inputElement.style.width = 'auto';
                                                inputElement.style.width = getTextWidth(searchBookTemp);
                                                setsearchChapter(1)
                                                // setactiveLine(-1)
                                                setTimeout(() => {
                                                    // setsearchVerse(1)
                                                }, 10);

                                                if (contentChapterRef.current) {

                                                    contentChapterRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                                                }
                                                // contentChapterRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                                                // contentChapterRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                                                // inputElement.style.width = `${searchBookTemp.length * 7}px`;
                                            }} onFocus={(e) => e.target.select()} onKeyDown={handleInputBookChange} onClick={(e) => {
                                                const inputElement = inputBookRef.current;
                                                if (inputElement) {
                                                    setTimeout(() => {
                                                        inputElement.select();
                                                    }, 100);
                                                }
                                            }} />
                                        </Hint>

                                    </div>

                                </div>
                                <span >:</span>
                                <div style={{ display: "flex", justifyContent: "center", cursor: "pointer", paddingTop: "4px" }}>

                                    {/* <p style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Chapter:</p> */}
                                    <div style={{ display: "flex", justifyContent: "center", alignSelf: "center" }}>
                                        <StyledBibleInput type="number" ref={inputChapterRef} onChange={handleInputChapterChange} value={searchChapter} onFocus={(e) => e.target.select()} onKeyDown={handleInputChapterKeyDown}
                                            onClick={(e) => {
                                                const inputElement = inputChapterRef.current;
                                                if (inputElement) {
                                                    setTimeout(() => {
                                                        inputElement.select();
                                                    }, 100);
                                                }
                                            }}
                                        />
                                    </div>

                                </div>
                                <span>:</span>
                                <div style={{ display: "flex", justifyContent: "center", cursor: "pointer", paddingTop: "4px" }}>

                                    {/* <p style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", }}>Verse:</p> */}
                                    <StyledBibleInputVerse type="number" ref={inputVerseRef} onChange={handleInputVerseChange} value={searchVerse} onFocus={(e) => {
                                        setTimeout(() => {
                                            e.target.select();
                                        }, 30)
                                    }} onKeyDown={handleInputVerseKeyDown}
                                        onClick={(e) => {
                                            const inputElement = inputVerseRef.current;
                                            if (inputElement) {
                                                setTimeout(() => {
                                                    inputElement.select();
                                                }, 100);
                                            }
                                        }}
                                    />

                                </div>
                            </div>
                            <div>
                                <Book1 size={20} style={{ position: "relative", left: "17%", top: "2", cursor: "pointer" }} onClick={() => {
                                    setinputType('search'); setSearchTerm(''); setsearchData([]);
                                    setTimeout(() => {

                                        searchFieldRef.current.focus()
                                    }, 50);
                                }} />

                            </div>
                        </div>
                }
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <p style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", textAlign: "left" }}>Versions</p>
                    <div className='' style={{ width: "100%", alignItems: "center", textAlign: "left", fontSize: "14px", display: "flex", flexDirection: "row", justifyContent: "space-between", cursor: "pointer" }} onClick={handleShowAccountMenu}>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Book size="20" color="#d9e3f0" onClick={() => { }} style={{ cursor: 'pointer', paddingRight: "13px" }} />
                            <span style={{ fontWeight: "600", color: "#B1B1B1", fontSize: "14px", }}>{selectActiveVersionName}</span>
                        </div>
                        {
                            showVersionOption ?
                                <ArrowUp2 size="20" color="#d9e3f0" onClick={() => { }} style={{ cursor: 'pointer', paddingRight: "13px" }} />
                                :
                                <ArrowDown2 size="20" color="#d9e3f0" onClick={() => { }} style={{ cursor: 'pointer', paddingRight: "13px" }} />
                        }
                    </div>
                    <SelectVersionMenu />
                    <p style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px", textAlign: "left", alignSelf: "flex-start", marginTop: "24px" }}>Books</p>
                    <div className={oldTestamentSectionOpen ? 'books books-show' : 'books books-hide'} style={{ marginBottom: "10px" }}>
                        <div className='' style={{ width: "100%", alignItems: "center", textAlign: "left", fontSize: "14px", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <Book size="20" color="#d9e3f0" onClick={() => { }} style={{ cursor: 'pointer', paddingRight: "13px" }} />
                                <span style={{ fontWeight: "600", color: "#B1B1B1", fontSize: "14px", }}>Old Testament</span>
                            </div>
                            {
                                oldTestamentSectionOpen ?
                                    <ArrowUp2 size="20" color="#d9e3f0" onClick={() => { setoldTestamentSectionOpen(false) }} style={{ cursor: 'pointer', paddingRight: "13px" }} />
                                    :
                                    <ArrowDown2 size="20" color="#d9e3f0" onClick={() => { setnewTestamentSectionOpen(false); setoldTestamentSectionOpen(true) }} style={{ cursor: 'pointer', paddingRight: "13px" }} />
                            }
                        </div>
                        <div className='' style={{ overflow: "scroll", height: "100%", paddingLeft: "32px", width: "90%", }}>
                            {
                                OldTestamentBooks.length > 0 &&
                                OldTestamentBooks.map((item) => (
                                    <BooksListItem key={item.book_id} book={item} type={'bookmark'} />
                                ))
                            }
                        </div>
                    </div>
                    <div className={newTestamentSectionOpen ? 'books books-show' : 'books books-hide'} >
                        <div className='' style={{ width: "100%", alignItems: "center", textAlign: "left", fontSize: "14px", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <Book size="20" color="#d9e3f0" onClick={() => { }} style={{ cursor: 'pointer', paddingRight: "13px" }} />
                                <span style={{ fontWeight: "600", color: "#B1B1B1", fontSize: "14px", }}>New Testament</span>
                            </div>
                            {
                                newTestamentSectionOpen ?
                                    <ArrowUp2 size="20" color="#d9e3f0" onClick={() => { setnewTestamentSectionOpen(false) }} style={{ cursor: 'pointer', paddingRight: "13px" }} />
                                    :
                                    <ArrowDown2 size="20" color="#d9e3f0" onClick={() => { setoldTestamentSectionOpen(false); setnewTestamentSectionOpen(true) }} style={{ cursor: 'pointer', paddingRight: "13px" }} />
                            }
                        </div>
                        <div className='' style={{ overflow: "scroll", height: "100%", paddingLeft: "32px", width: "90%", }}>
                            {
                                NewTestamentBooks.length > 0 &&
                                NewTestamentBooks.map((item) => (
                                    <BooksListItem key={item.id} book={item} type={'bookmark'} />
                                ))
                            }

                            {/* <ToastContainer/> */}
                        </div>
                    </div>
                </div >
            </div >
        </div >


    );
}

export default BookmarkXBooks;
