import BookmarkXSongs from "../SongBody/BookmarkXSongs";
import Song from "../SongBody/Song";
import ControlBoard from '../EWGraberBody/ControlBoard';
import ImageOutputXGrabPanel from "./ConnectionTypes";
import ControlSummary from "./ControlSummary";
import ConnectionTypes from "./ConnectionTypes";

const { ipcRenderer } = window.require('electron');

function SPControlBody() {
    return (
        <>
            <ControlSummary />
            <ConnectionTypes />
        </>
    );
}

export default SPControlBody;
