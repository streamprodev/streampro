import BookmarkXSongs from "../SongBody/BookmarkXSongs";
import Song from "../SongBody/Song";
import ControlBoard from '../EWGraberBody/ControlBoard';
import ImageOutputXGrabPanel from "./ImageOutputXGrabPanel";

const { ipcRenderer } = window.require('electron');

function EWGraberBody() {
    return (
        <>
            <ControlBoard />
            <ImageOutputXGrabPanel />
        </>
        // <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'red' }}>
        //     <div style={{ flex: 1 }}>
        //         <BookmarkXSongs />
        //     </div>
        //     <div style={{ flex: 1 }}>
        //         <ControlBoard />
        //     </div>

        // </div>
    );
}

export default EWGraberBody;
