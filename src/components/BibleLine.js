import { useEffect, useState } from "react";
import { useBible } from "../context/BibleContext";
import { useSong } from "../context/SongContext";
import CustomContextMenu from "./MainBody/BibleBody/CustomContextMenu";
import { Bookmark, Maximize4 } from "iconsax-react";



const BibleLine = ({ line, index, search, parentRef }) => {
    const { selectActiveVersion, setsearchVerse, selectedVerseArray, setselectedVerseArray, setChapterContent, activeChapterContent, setsearchBookObj, setsearchBook, setsearchChapter, setbibleView, books, setselectedChapter, chapters, setselectedBook, selectedChapter, selectedBook, setinputType, contentChapterRef, inputBookRef, showOneLine, setshowOneLine, showHilighted, setshowHilighted, multipleselectedVerseArray, setmultipleselectedVerseArray, setshowBookmarkContext, showBookmarkContext, selectedLine, setselectedLine, addBookmark } = useBible();

    // const [showOneLine, setshowOneLine] = useState(false)
    // const [showHilighted, setshowHilighted] = useState(false)


    var str = '';

    const getHighlightedText = (text, terms) => {
        var re = new RegExp(terms.join("|"), "gi"); // create a a | b | c regex

        return str = text.replace(re, function replace(match) { // wrap the found strings
            return '<span style=color:#FF3939 >' + match + '</span>';
        });
    }
    if (search) {
        var re = new RegExp(line.terms.join("|"), "gi"); // create a a | b | c regex

        var str = line.text.replace(re, function replace(match) { // wrap the found strings
            return '<span style=color:#FF3939 >' + match + '</span>';
        });

    }
    const { activeId, setactiveId, setactiveLine, activeLine } = useSong()
    function checkInView(container, element, partial) {

        //Get container properties
        let cTop = container.scrollTop + 300;
        let cBottom = cTop + container.clientHeight - 160;
        //Get element properties
        let eTop = element.offsetTop;
        let eBottom = eTop + element.clientHeight;
        let scrollDirection = null;
        if ((eTop < cTop)) {
            // console.log('going up')
            scrollDirection = "end"
        }
        if ((eBottom > cBottom)) {
            // console.log('coming down')
            scrollDirection = "start"

        }
        //Check if in view    
        let isTotal = (eTop >= cTop && eBottom <= cBottom)
        let isPartial = partial && (
            (eTop < cTop && eBottom > cTop) ||
            (eBottom > cBottom && eTop < cBottom)
        );
        //Return outcome
        return { isInViewPort: (isTotal || isPartial), scrollDirection };
    }

    useEffect(() => {
        // console.log(multipleselectedVerseArray)
        // console.log(getVerseText(multipleselectedVerseArray))

    }, [multipleselectedVerseArray])




    useEffect(() => {

        if (activeLine == index) {

            if (line.ref && parentRef) {

                if (line.ref.current && parentRef.current) {
                    setTimeout(() => {
                        if (inputBookRef && inputBookRef.current !== document.activeElement) {

                            setselectedVerseArray(line)
                        }
                    }, 150);
                    // console.log(checkInView(parentRef.current, line.ref.current, true))
                    if (!checkInView(parentRef.current, line.ref.current, true).isInViewPort) {

                        line.ref.current.scrollIntoView({
                            behavior: "instant",
                            block: checkInView(parentRef.current, line.ref.current, true).scrollDirection,
                            inline: "nearest"
                        })
                        // console.log(`Hidden element is now hidden`);
                    }
                }
            }
            // setselectedVerseArray(line)
        }
        // setsearchVerse(activeLine + 1)

    }, [activeLine])
    const handleSearchToScripture = (verse) => {
        setinputType('scripture')
        if (selectedVerseArray.id === verse.id) {
            setbibleView('view-verses')
            return
        }
        setselectedVerseArray(verse)


        setselectedChapter(chapters.find(({ book_number, chapter_number }) => (book_number == verse.book_number && chapter_number == verse.chapter_number)))
        setselectedBook(books.find(({ book_number }) => book_number == verse.book_number))


        // setChapterContent(verse.book_number, verse.chapter_number)
        setsearchBookObj(books.find(({ book_number }) => book_number == verse.book_number))
        setsearchBook(verse.book_name)
        setsearchChapter(verse.chapter_number)
        // setsearchVerse(verse.verse_number)

        setChapterContent(verse.book_number, verse.chapter_number)
        setTimeout(() => {
        }, 200);

        setsearchVerse(verse.verse_number);
        setTimeout(() => {
        }, 300);

        setTimeout(() => {
            if (contentChapterRef.current) {
                contentChapterRef.current.focus()
            }
        }, 1000);

        // setTimeout(() => {
        //     setbibleView('view-verses')
        // }, 400);
    }

    // {
    //     "book_number": "66",
    //     "verse_number": "21",
    //     "chapter_number": "22",
    //     "text": "The grace of our Lord Jesus Christ be with you all. Amen.",
    //     "book_name": "Revelation",
    //     "osis_ref": "Rev.22.21",
    //     "new column": "",
    //     "id": 31102
    // }

    useEffect(() => {
        document.addEventListener("click", closeContextMenu);
        return () => {
            document.removeEventListener("click", closeContextMenu);
        };
    });

    const closeContextMenu = () => {
        if (showBookmarkContext) {
            setshowBookmarkContext(false)
        }
    }

    const getTextColor = () => {
        // console.log(selectedChapter, selectedBook, line, activeLine, index, multipleselectedVerseArray)
        // activeLine == index || multipleselectedVerseArray.find(obj => obj.verse_number == index + 1) ? "#FF3939" : "#B1B1B1"
        if (activeLine == index && selectedVerseArray.chapter_number == selectedChapter.chapter_number && selectedVerseArray.
            book_name == selectedBook.label) {
            return "#FF3939";
        } else if (multipleselectedVerseArray.find(obj => obj.verse_number == index + 1 && obj.chapter_number == selectedChapter.chapter_number && obj.book_name == selectedBook.label)) {
            return "#FF3939";

        }
        return "#B1B1B1";
    }

    const [displayBookmark, setdisplayBookmark] = useState(false)







    return (
        search ?
            <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column", paddingLeft: "17px", paddingRight: "19px", gap: "5px", marginBottom: "24px" }} tabIndex={0} onClick={() => { setmultipleselectedVerseArray([]); handleSearchToScripture(line) }} onMouseEnter={()=>setdisplayBookmark(true)} onMouseLeave={()=>setdisplayBookmark(false)}>
                {/* <span style={{ listStyleType: "none", fontSize: '14px', fontWeight: "500", color: "#B1B1B1", cursor: "pointer", textAlign: "left" }} onClick={() => { }}>{line.book_name + " " + line.chapter_number + ":" + line.verse_number} ({selectActiveVersion.toUpperCase()})</span> */}
                <div style={{ gap: "10px", display: "flex", justifyContent: "center", }} title='Bookmark Verse'>

                    <span style={{ listStyleType: "none", fontSize: '14px', fontWeight: "500", color: "#B1B1B1", cursor: "pointer", textAlign: "left" }} onClick={() => { }}>{line.book_name + " " + line.chapter_number + ":" + line.verse_number} ({selectActiveVersion.toUpperCase()})</span>
                    {
                        displayBookmark &&
                        <Bookmark size={15} onClick={(e) => { e.stopPropagation(); addBookmark(line) }} style={{ paddingTop: "2px", zIndex: "10" }} />
                    }
                </div>
                <span style={{ listStyleType: "none", fontSize: '14px', fontWeight: "500", color: "#B1B1B1", cursor: "pointer", textAlign: "left", lineHeigt: "20" }} onClick={() => { }} dangerouslySetInnerHTML={{ __html: showHilighted ? getHighlightedText(line.text, line.terms) : line.text }} className={showOneLine ? "search-one-line" : ""}></span>
            </div>
            :
            <>

                <div onContextMenu={() => { setshowBookmarkContext(true); setselectedLine(line) }} ref={line.ref} style={{ display: "flex", alignItems: "flex-start", flexDirection: "column", paddingLeft: "17px", paddingRight: "19px", gap: "5px", marginBottom: "24px", cursor: "pointer", userSelect: "none" }} onMouseEnter={()=>setdisplayBookmark(true)} onMouseLeave={()=>setdisplayBookmark(false)}
                    onClick={(e) => {
                        // console.log(e)
                        if (e.shiftKey) {
                            if (activeLine == index) {
                            } else if (activeLine == -1) {
                            } else if (activeLine > index) {
                                let multiple = [];
                                for (let start = index; start <= activeLine; start++) {
                                    multiple.push(activeChapterContent[start]);
                                    setmultipleselectedVerseArray(multiple)
                                }
                                return
                            } else if (activeLine < index) {
                                setactiveLine(index);
                                setsearchVerse(index + 1);
                                let multiple = [];
                                for (let start = activeLine; start <= index; start++) {
                                    multiple.push(activeChapterContent[start]);
                                    setmultipleselectedVerseArray(multiple)
                                }
                                return
                            }
                        } else {
                        }
                        setmultipleselectedVerseArray([])
                        setactiveLine(index);
                        setsearchVerse(index + 1);
                        setselectedVerseArray(line);
                    }}>
                    <div style={{ gap: "10px", display: "flex", justifyContent: "center", outline:"none"}} title='Bookmark Verse'>

                        <span style={{ listStyleType: "none", fontSize: '14px', fontWeight: "500", color: getTextColor(), cursor: "pointer", textAlign: "left" }} onClick={() => { }}>{line.book_name + " " + line.chapter_number + ":" + line.verse_number} ({selectActiveVersion.toUpperCase()})</span>
                        {
                            displayBookmark &&
                            <Bookmark size={15} onClick={(e) => { e.stopPropagation(); addBookmark(line) }} style={{ paddingTop: "2px", zIndex: "10" }} />
                        }
                    </div>
                    <span style={{ listStyleType: "none", fontSize: '14px', fontWeight: "500", color: getTextColor(), cursor: "pointer", textAlign: "left", lineHeigt: "20" }}  >{line.text}</span>


                </div>
                <CustomContextMenu
                    line={line}

                />
            </>


    );
};

export default BibleLine;
