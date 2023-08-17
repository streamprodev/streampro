import { useEffect, useRef, useState } from "react";
import CustomContextMenu from "../../CustomContextMenu";
import { Trash } from "iconsax-react";
import { useSong } from "../../../context/SongContext";
import { useBible } from "../../../context/BibleContext";
const { ipcRenderer } = window.require('electron');



const BibleBookmarkItem = ({ verse }) => {

    const { activeId, setactiveId, setactiveLine, songDisplayRef } = useSong()
    const { selectedVerseArray, setselectedChapter, setChapterContent, setsearchBookObj, setsearchBook, setsearchChapter, setsearchVerse, setbibleView, chapters, books, deleteBookmark, contentChapterRef, setinputType, setselectedBook, setselectedVerseArray, bookmarkRef } = useBible()


    const handleSearchToScripture = () => {
        setinputType('scripture')

        if (selectedVerseArray.id === verse.id) {
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



    const removeBookmark = () => {

        deleteBookmark(verse)
    };

    return (
        <div className="SongListItem" style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center", width: "100%", textAlign: "left", }}>
            <p style={{ listStyleType: "none", fontSize: '14px', fontWeight: "600", color: selectedVerseArray.id == verse.id ? "rgb(255, 57, 57)" : "#B1B1B1", cursor: "pointer", lineHeight: "1.5px" }} onClick={() => {
                handleSearchToScripture()
            }}>{verse.book_name + " " + verse.chapter_number + ":" + verse.verse_number}</p>
            <Trash size={16} color={"white"} style={{ marginLeft: "auto", cursor: "pointer", alignSelf: "center", paddingRight: "10px" }} onClick={removeBookmark} />

        </div>
    );
};

export default BibleBookmarkItem;
