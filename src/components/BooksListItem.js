import { useEffect, useRef, useState } from "react";
import CustomContextMenu from "./CustomContextMenu";
import { Trash } from "iconsax-react";
import { useSong } from "../context/SongContext";
import { useBible } from "../context/BibleContext";
const { ipcRenderer } = window.require('electron');



const BooksListItem = ({ book }) => {

    const { bibleView, setbibleView, selectedChapter, setselectedChapter, selectedBook, setselectedBook } = useBible()

    // console.log(book)



    return (
        <div className="SongListItem" style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center", width: "100%", textAlign: "left", marginBottom: "3px", }} onClick={() => {
            setbibleView('select-chapter')
            setselectedBook(book)
        }}>
            <p style={{ listStyleType: "none", fontSize: '12px', fontWeight: "500   ", color: selectedBook.book_id == book.book_id ? "" : "#B1B1B1", cursor: "pointer" }} onClick={() => { }} >{book.label}</p>


            {/* {
                type === 'bookmark' &&
                <Trash size={16} color={"white"} style={{ marginLeft: "auto", cursor: "pointer", alignSelf: "center", paddingRight: "10px" }} onClick={() => { }} />
            } */}

        </div >
    );
};

export default BooksListItem;
