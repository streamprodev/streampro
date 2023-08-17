import { useEffect, useState } from "react";
import { useBible } from "../context/BibleContext";
import { useSong } from "../context/SongContext";



const BibleLine = ({ line, index, search, parentRef }) => {
    const { selectActiveVersion, setsearchVerse, selectedVerseArray, setselectedVerseArray, setChapterContent, setsearchBookObj, setsearchBook, setsearchChapter, setbibleView, books, setselectedChapter, chapters, setselectedBook, setinputType, contentChapterRef, inputBookRef, showOneLine, setshowOneLine, showHilighted, setshowHilighted } = useBible();

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
                            behavior: "smooth",
                            block: checkInView(parentRef.current, line.ref.current, true).scrollDirection,
                            inline: "nearest"
                        })
                        // console.log(`Hidden element is now hidden`);
                    }
                }
            }
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





    return (
        search ?
            <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column", paddingLeft: "17px", paddingRight: "19px", gap: "5px", marginBottom: "24px" }} tabIndex={0} onClick={() => handleSearchToScripture(line)}>
                <span style={{ listStyleType: "none", fontSize: '14px', fontWeight: "500", color: activeLine == "#B1B1B1", cursor: "pointer", textAlign: "left" }} onClick={() => { }}>{line.book_name + " " + line.chapter_number + ":" + line.verse_number} ({selectActiveVersion.toUpperCase()})</span>
                <span style={{ listStyleType: "none", fontSize: '14px', fontWeight: "500", color: "#B1B1B1", cursor: "pointer", textAlign: "left", lineHeigt: "20" }} onClick={() => { }} dangerouslySetInnerHTML={{ __html: showHilighted ? getHighlightedText(line.text, line.terms) : line.text }} className={showOneLine ? "search-one-line" : ""}></span>
            </div>
            :
            <div ref={line.ref} style={{ display: "flex", alignItems: "flex-start", flexDirection: "column", paddingLeft: "17px", paddingRight: "19px", gap: "5px", marginBottom: "24px", cursor: "pointer" }} onClick={() => { setactiveLine(index); setsearchVerse(index + 1); setselectedVerseArray(line) }}>
                <span style={{ listStyleType: "none", fontSize: '14px', fontWeight: "500", color: activeLine == index ? "#FF3939" : "#B1B1B1", cursor: "pointer", textAlign: "left" }} onClick={() => { }}>{line.book_name + " " + line.chapter_number + ":" + line.verse_number} ({selectActiveVersion.toUpperCase()})</span>
                <span style={{ listStyleType: "none", fontSize: '14px', fontWeight: "500", color: activeLine == index ? "#FF3939" : "#B1B1B1", cursor: "pointer", textAlign: "left", lineHeigt: "20" }}  >{line.text}</span>
            </div>


    );
};

export default BibleLine;
