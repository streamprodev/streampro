
import React, { useContext, useState, useEffect, useMemo } from 'react'
import MiniSearch from 'minisearch'
import { useRef } from 'react';
import { toast } from 'react-toastify';
import LowerToast from '../components/LowerToast';
import { useRegistrationInfo } from './RegistrationInfoContext';

import { initializeApp } from "firebase/app"
import { deleteDoc, doc, query, where, getFirestore } from "@firebase/firestore"

import { useSong } from './SongContext';
import { useLocation } from 'react-router-dom';
const { books } = require("../bibles/books")
const { Kjv } = require("../bibles/Kjv")
const { chapters } = require("../bibles/chapters")
// const {books} = require("../bibles/books")
const { Nkjv } = require("../bibles/Nkjv")
const { ipcRenderer } = window.require('electron');

export const BibleContext = React.createContext({})



export function useBible() { return useContext(BibleContext) }

export function BibleContextProvider({ children }) {
    // console.log(chapters)

    const { outPutType, setoutPutType } = useSong()

    const NewTestamentBooks = books.filter(item => {
        if (item.testament !== "Old Testament") {
            return item
        }
    })
    const OldTestamentBooks = books.filter(item => {
        if (item.testament === "Old Testament") {
            return item
        }
    })


    useEffect(() => {

    }, [])
    // useEffect(() => {
    //     if (selectedVerse > 0) {
    //         setactiveChapterContent
    //     }

    // }, [selectedVerse])



    const [inputType, setinputType] = useState('scripture')
    const [searchBook, setsearchBook] = useState('Genesis')
    const [searchChapter, setsearchChapter] = useState(1)
    const [searchBookObj, setsearchBookObj] = useState(books[0])
    const [searchChapterObj, setsearchChapterObj] = useState(chapters[0])
    const [searchVerse, setsearchVerse] = useState(1)
    const [bibleView, setbibleView] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedBook, setselectedBook] = useState({})
    const [selectedChapter, setselectedChapter] = useState({})
    const [selectedVerse, setselectedVerse] = useState({})
    const [activeBook, setactiveBook] = useState([])
    const [activeBookTemp, setactiveBookTemp] = useState([])
    const [searchData, setsearchData] = useState([])
    const [showSelectVersionMenu, setshowSelectVersionMenu] = useState(false)
    const [showSelectVersionMenuPosition, setshowSelectVersionMenuPosition] = useState({ x: 0, y: 0 })
    const [activeChapterContent, setactiveChapterContent] = useState({})
    const [selectActiveVersion, setselectActiveVersion] = useState('kjv')
    const [selectActiveVersionName, setselectActiveVersionName] = useState('King James Version (KJV)')
    const [searchBookTemp, setsearchBookTemp] = useState(books[0].label);
    const [selectedVerseArray, setselectedVerseArray] = useState({});
    const [activeBookPart1, setactiveBookPart1] = useState([]);
    const [activeBookPart2, setactiveBookPart2] = useState([]);
    const [activeBookPart3, setactiveBookPart3] = useState([]);
    const [activeBookPart4, setactiveBookPart4] = useState([]);
    const [activeBookPart5, setactiveBookPart5] = useState([]);
    const [bookmarkedData, setbookmarkedData] = useState([]);
    const [bookmarkopen, setbookmarkOPen] = useState(false);
    const [showOneLine, setshowOneLine] = useState(true)
    const [showHilighted, setshowHilighted] = useState(false)
    const [expandedView, setexpandedView] = useState(false)
    const [searchResultRef, setsearchResultRef] = useState(useRef(null))
    const { activeId, setactiveId, setactiveLine, activeLine } = useSong()

    const bookmarkRef = useRef(null)
    const inputVerseRef = useRef(null);



    const location = useLocation();

    const setChapterContent = (book_number, chapter_number) => {
        const versess = activeBook.filter(item => {
            if ((item.book_number == book_number) && (item.chapter_number == chapter_number)) {
                return item;
            }
        })
        versess.forEach((item) => {
            item['ref'] = React.createRef()
        })
        setactiveChapterContent(versess)
    }

    useEffect(() => {
        setChapterContent(selectedBook.book_number, selectedChapter.chapter_number)

        setTimeout(() => {
            if (bibleView == 'search-result') {
                handleKeyPress()
            }

        }, 60);

    }, [activeBook])

    useEffect(() => {
        if (selectActiveVersion == 'kjv') {
            setactiveBook(Kjv)
            setactiveBookTemp(Kjv)
        } else if (selectActiveVersion == 'nkjv') {
            setactiveBook(Nkjv)
            setactiveBookTemp(Nkjv)
        }

    }, [selectActiveVersion])

    useEffect(() => {

        miniSearchbible1.removeAll()
        miniSearchbible2.removeAll()
        miniSearchbible3.removeAll()
        miniSearchbible4.removeAll()
        miniSearchbible5.removeAll()
        setTimeout(() => {
            const fivePartIndex = Math.ceil(activeBookTemp.length / 5);
            const list = activeBookTemp;
            setactiveBookPart5(list.slice(0, fivePartIndex));
            setactiveBookPart4(list.slice(fivePartIndex * 1, fivePartIndex * 2));
            setactiveBookPart3(list.slice((fivePartIndex * 2) + 1, fivePartIndex * 3));
            setactiveBookPart2(list.slice((fivePartIndex * 3) + 1, fivePartIndex * 4));
            setactiveBookPart1(list.slice((fivePartIndex * 4) + 1, fivePartIndex * 5));
        }, 20);
    }, [activeBookTemp])





    useEffect(() => {
        if (selectActiveVersion) {
            if (selectActiveVersion == 'kjv') {
                setselectActiveVersionName('King James Version (KJV)')
            }
            else if (selectActiveVersion == 'niv') {
                setselectActiveVersionName('New International Version (NIV)')
            }
            else if (selectActiveVersion == 'nlt') {
                setselectActiveVersionName('New Living Translation (NLT)')
            }
            else if (selectActiveVersion == 'csb') {
                setselectActiveVersionName('Christian Standard Bible (CSB)')
            }
            else if (selectActiveVersion == 'nkjv') {
                setselectActiveVersionName('New King James Version (NKJV)')
            }
        }

        // if (activeChapterContent.length > 0) {
        //     setChapterContent(selectedBook.book_number, selectedChapter.chapter_number)
        // }
    }, [selectActiveVersion])

    useEffect(() => {
        miniSearchbible1.addAll(activeBookPart1)
    }, [activeBookPart1])

    useEffect(() => {
        miniSearchbible2.addAll(activeBookPart2)
    }, [activeBookPart2])

    useEffect(() => {
        miniSearchbible3.addAll(activeBookPart3)
    }, [activeBookPart3])

    useEffect(() => {
        miniSearchbible4.addAll(activeBookPart4)
    }, [activeBookPart4])

    useEffect(() => {
        miniSearchbible5.addAll(activeBookPart5)
    }, [activeBookPart5])

    useEffect(() => {
        setselectedChapter(chapters.find(({ chapter_number, book_number }) => chapter_number == 1 && searchBookObj.book_number == book_number))
        setselectedBook(searchBookObj)
        setsearchChapter(1)
        setsearchVerse(1)
    }, [searchBookTemp])

    useEffect(() => {
        // setactiveLine(searchVerse - 1)
        setactiveLine(parseInt(searchVerse) - 1)

        setbibleView('view-verses')
    }, [searchVerse])



    useEffect(() => {
        setsearchChapterObj(chapters.find(({ chapter_number, book_number }) => chapter_number == searchChapter && searchBookObj.book_number == book_number))
    }, [searchBookObj])

    useEffect(() => {
        if (searchChapterObj) {
            setselectedChapter(chapters.find(({ chapter_number, book_number }) => chapter_number == searchChapterObj.chapter_number && searchBookObj.book_number == book_number))
            setChapterContent(searchBookObj.book_number, searchChapterObj.chapter_number)
        }
    }, [searchChapterObj])


    // useEffect(() => {
    //     setsearchChapterObj(chapters.find(({ chapter_number, book_number }) => chapter_number == searchChapter && searchBookObj.book_number == book_number))
    //     console.log(searchChapterObj, searchBookObj)
    //     if (searchChapterObj) {
    //         setselectedChapter(chapters.find(({ chapter_number, book_number }) => chapter_number == searchChapterObj.chapter_number && searchBookObj.book_number == book_number))
    //         setChapterContent(searchBookObj.book_number, searchChapterObj.chapter_number)
    //     }
    //     if (searchVerse > 1) {

    //     }
    //     setactiveLine(searchVerse - 1)
    //     console.log(searchVerse)

    //     setbibleView('view-verses')
    // }, [searchBookObj, searchChapterObj, searchVerse])

    const detectKeyDown = (e) => {

        if (e.key === "ArrowUp") {
            e.preventDefault();


            if (activeChapterContent && activeChapterContent.length > 0) {
                setsearchVerse(prev => {
                    var nextPos = -1
                    var done = false
                    while (!done) {
                        if (activeChapterContent[parseInt(prev) + nextPos - 1]) {
                            done = true
                        } else if ((parseInt(prev) + nextPos - 1) < -1) {
                            nextPos = 0;
                            done = true
                        } else {
                            nextPos = nextPos - 1
                        }
                    }
                    // setsearchVerse(parseInt(prev) + nextPos)
                    setselectedVerseArray(activeChapterContent[parseInt(prev) + nextPos - 1])
                    return parseInt(prev) + nextPos
                })
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (activeChapterContent && activeChapterContent.length > 0) {
                setsearchVerse(prev => {
                    var nextPos = 1
                    var done = false
                    while (!done) {
                        if (activeChapterContent[parseInt(prev) + nextPos - 1]) {
                            done = true
                        } else if ((parseInt(prev) + nextPos - 1) > activeChapterContent.length) {
                            nextPos = 0;
                            done = true
                        } else {

                            nextPos++
                        }
                    }
                    setselectedVerseArray(activeChapterContent[parseInt(prev) + nextPos - 1])
                    return parseInt(prev) + nextPos
                })
            }
        } else if (e.key === "Escape") {
            e.preventDefault();
            setactiveLine(-1)
        } if (e.key === "b" || e.key === "B") {
            // setactiveLine(-1)
            console.log(document.activeElement)
            if (document.activeElement === contentChapterRef.current || document.activeElement === inputVerseRef.current) {
                addBookmark(selectedVerseArray)
            }
        }
    }

    const handleKeyPress = async (event) => {
        if (event) {
            event.stopPropagation()
        }

        if (miniSearchbible1.documentCount === 0) {
            console.log('loading')
            miniSearchbible1.addAll(activeBookPart1)
        }
        if (miniSearchbible2.documentCount === 0) {
            console.log('loading')
            miniSearchbible2.addAll(activeBookPart2)
        }
        if (miniSearchbible3.documentCount === 0) {
            console.log('loading')
            miniSearchbible3.addAll(activeBookPart3)
        }
        if (miniSearchbible4.documentCount === 0) {
            console.log('loading')
            miniSearchbible4.addAll(activeBookPart4)
        }
        if (miniSearchbible5.documentCount === 0) {
            console.log('loading')
            miniSearchbible5.addAll(activeBookPart5)
        }
        // if (miniSearchbible.documentCount === 0) {
        //     console.log('loading')
        //     miniSearchbible5.addAll(Test5)
        // }

        const result = await Promise.allSettled([
            getSearchResult(miniSearchbible1),
            getSearchResult(miniSearchbible2),
            getSearchResult(miniSearchbible3),
            getSearchResult(miniSearchbible4),
            getSearchResult(miniSearchbible5),
        ])

        setsearchData(() => {
            return result.map(item => {
                if (item.status == 'fulfilled') {
                    return item.value
                }

            }).flat(1).sort((b, a) => (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0));
        })
        setbibleView("search-result")
        if (searchResultRef.current) {
            searchResultRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const inputBookRef = useRef(null);

    // useEffect(() => {
    //     console.log(searchData)
    // }, [searchData])


    function getSearchResult(miniSearchbible) {
        return new Promise(function (resolve, reject) {
            resolve(miniSearchbible.search(searchTerm).slice(0, 10));
        });
    }


    let miniSearchbible = useMemo(
        () =>
            new MiniSearch({
                fields: ['text'],
                storeFields: ['text', 'book_number', 'verse_number', 'chapter_number', 'book_name'],
            }),
        []
    );
    let miniSearchbible1 = useMemo(
        () =>
            new MiniSearch({
                fields: ['text'],
                storeFields: ['text', 'book_number', 'verse_number', 'chapter_number', 'book_name'],
            }),
        []
    );
    let miniSearchbible2 = useMemo(
        () =>
            new MiniSearch({
                fields: ['text'],
                storeFields: ['text', 'book_number', 'verse_number', 'chapter_number', 'book_name'],
            }),
        []
    );
    let miniSearchbible3 = useMemo(
        () =>
            new MiniSearch({
                fields: ['text'],
                storeFields: ['text', 'book_number', 'verse_number', 'chapter_number', 'book_name'],
            }),
        []
    );
    let miniSearchbible4 = useMemo(
        () =>
            new MiniSearch({
                fields: ['text'],
                storeFields: ['text', 'book_number', 'verse_number', 'chapter_number', 'book_name'],
            }),
        []
    );
    let miniSearchbible5 = useMemo(
        () =>
            new MiniSearch({
                fields: ['text'],
                storeFields: ['text', 'book_number', 'verse_number', 'chapter_number', 'book_name'],
            }),
        []
    );

    const deleteBookmark = (song) => {
        setbookmarkedData(prev => {
            return prev.filter(object => {
                return object.id !== song.id;
            })
        })
    }

    const addBookmark = (object) => {

        setbookmarkOPen(true)
        var index = bookmarkedData.findIndex(x => x.id == object.id);
        if (index === -1) {
            setbookmarkedData((prev) => {
                return prev.concat(object)

            })

        }
    }



    useEffect(() => {
        console.log(bookmarkedData)

        if (bookmarkRef.current) {
            bookmarkRef.current.scrollTo({
                top: bookmarkRef.current.scrollHeight,
                behavior: 'smooth',
            })

        }

    }, [bookmarkedData])


    const contentChapterRef = useRef(null)


    return (
        <BibleContext.Provider value={{ inputType, setinputType, searchBook, setsearchBook, books, chapters, NewTestamentBooks, OldTestamentBooks, bibleView, setbibleView, selectedBook, setselectedBook, selectedChapter, setselectedChapter, activeChapterContent, setactiveChapterContent, setChapterContent, selectActiveVersion, searchChapter, setsearchChapter, searchVerse, setsearchVerse, searchBookObj, setsearchBookObj, searchChapterObj, setsearchChapterObj, searchBookTemp, setsearchBookTemp, showSelectVersionMenu, setshowSelectVersionMenu, showSelectVersionMenuPosition, setshowSelectVersionMenuPosition, setselectActiveVersion, selectActiveVersionName, handleKeyPress, searchTerm, setSearchTerm, searchData, setsearchData, detectKeyDown, selectedVerseArray, setselectedVerseArray, contentChapterRef, bookmarkopen, setbookmarkOPen, bookmarkedData, setbookmarkedData, addBookmark, deleteBookmark, inputBookRef, activeBook, bookmarkRef, inputVerseRef, showOneLine, setshowOneLine, showHilighted, setshowHilighted, expandedView, setexpandedView, searchResultRef, setsearchResultRef }}>
            {children}
        </BibleContext.Provider>
    )
}