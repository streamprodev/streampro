import { useBible } from "../context/BibleContext";
import { useSong } from "../context/SongContext";



const SelectNumber = ({ value, type }) => {

    const { bibleView, setbibleView, selectedChapter, setselectedChapter, selectedBook, setselectedBook, chapters, activeChapterContent, setactiveChapterContent, setChapterContent, setsearchVerse, setsearchBookObj, setsearchChapter, setsearchBook, contentChapterRef } = useBible()
    const { setactiveLine } = useSong()


    const handleClick = () => {
        // console.log(value, type)
        if (type == 'chapter') {
            setbibleView('select-verse')
            setselectedChapter(chapters.find(({ book_id, chapter_number }) => (book_id == selectedBook.book_id && chapter_number == value)))
        } else if (type == 'verse') {
            // setactiveLine(value - 1)
            setsearchBookObj(selectedBook)
            setsearchBook(selectedBook.label)
            setsearchChapter(selectedChapter.chapter_number)
            setsearchVerse(value)
            setTimeout(() => {
                setChapterContent(selectedBook.book_number, selectedChapter.chapter_number)
            }, 20);

            setTimeout(() => {
                if (contentChapterRef.current) {
                    contentChapterRef.current.focus()
                }
            }, 1000);

            setTimeout(() => {
                setbibleView('view-verses')
            }, 40);
        }
    }
    return (
        <div style={{ height: "40px", borderRadius: "4px", width: "40px", backgroundColor: "black", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }} onClick={handleClick}>
            <span style={{ fontSize: '14px', fontWeight: "700", color: "#B1B1B1", cursor: "pointer", textAlign: "center" }} >{value}</span>
        </div>

    );
};

export default SelectNumber;
