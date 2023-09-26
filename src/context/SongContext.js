
import React, { useContext, useState, useEffect, useMemo } from 'react'
import MiniSearch from 'minisearch'
import { useRef } from 'react';
import { toast } from 'react-toastify';
import LowerToast from '../components/LowerToast';
import { useRegistrationInfo } from './RegistrationInfoContext';

import { initializeApp } from "firebase/app"
import { deleteDoc, doc, query, where, getFirestore } from "@firebase/firestore"
import { useLocation } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

export const SongContext = React.createContext({})




export function useSong() { return useContext(SongContext) }

export function SongContextProvider({ children }) {

    const { registrationInfo } = useRegistrationInfo();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false);
    const [isUpdateDownloadingModalOpen, setisUpdateDownloadingModalOpen] = useState(false);
    const [isEditModalOpen, setisEditModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [songData, setsongData] = useState([]);
    const [displayData, setdisplayData] = useState([]);
    const [bookmarkedData, setbookmarkedData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSong, setactiveSong] = useState([]);
    const [activeSongArray, setactiveSongArray] = useState([]);
    const [activeId, setactiveId] = useState('');
    const [activeLine, setactiveLine] = useState(-1);
    const [deleteSong, setdeleteSong] = useState('songs');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [menuEditId, setmenuEditId] = useState();
    const [bookmarkopen, setbookmarkOPen] = useState(false);

    let [importing, setimporting] = useState(false);
    let [color, setColor] = useState("#ffffff");
    const [outPutType, setoutPutType] = useState('song');
    const [AllSonggSelectionArray, setAllSonggSelectionArray] = useState([]);
    const [searchAllSongsTerm, setsearchAllSongsTerm] = useState('');

    const location = useLocation();
    const LyricsLineRef = useRef([]);
    const LyricsLineParentRef = useRef();

    useEffect(() => {
        ipcRenderer.invoke('getSongData').then(setsongData)
        ipcRenderer.on('data-loaded', dataLoader)
        ipcRenderer.on('resetSongData', resetSongData);
        ipcRenderer.on('txt-files-listed', handleFolderContents);
        ipcRenderer.on('bulkInsertComplete', bulkInsertCompletef);
        ipcRenderer.on('deleteSong', removedeletedSong);
        ipcRenderer.on('setSongDataEvent', setSongDataEvent);
        ipcRenderer.on('clearDisplayData', clearDisplayData);
        ipcRenderer.on('updateAvailable', updateAvailable);

        return () => {
            ipcRenderer.removeListener('clearDisplayData', clearDisplayData);
            ipcRenderer.removeListener('setSongDataEvent', setSongDataEvent);
            ipcRenderer.removeListener('resetSongData', resetSongData);
            ipcRenderer.removeListener('txt-files-listed', handleFolderContents);
            ipcRenderer.removeListener('deleteSong', removedeletedSong);
            ipcRenderer.on('updateAvailable', updateAvailable);
        }
    }, []);

    const songListRef = useRef(null)
    const songDisplayRef = useRef(null)

    let miniSearch = useMemo(
        () =>
            new MiniSearch({
                fields: ['title', 'body'],
                storeFields: ['title', 'id', 'body', 'uuid'],
            }),
        []
    );

    const updateAvailable = (event, info) => {
        console.log(info);
        setisUpdateDownloadingModalOpen(true);

    }


    useEffect(() => {
        if (songData && songData.length) {
            if (activeId) {
                const active_song = songData.find(song => song.uuid === activeId)
                setactiveSong(active_song)
                if (active_song) {
                    const disDataIndex = displayData.findIndex(x => x.uuid === active_song.uuid);
                    if (disDataIndex > -1) {
                        displayData[disDataIndex]['title'] = active_song.title
                    }

                }
            }

            miniSearch.removeAll()
            // miniSearch.addAll(songData)
            if (searchTerm) {
            } else {
                setdisplayData(songData.slice(0, 20))
            }
        } else {


        }
    }, [songData]);

    const clearDisplayData = () => {
        setSearchTerm('')
        setactiveId(-1)
        setactiveSong({})
        miniSearch.removeAll()
        setdisplayData([])
    }

    useEffect(() => {
        if (activeSong?.body) {
            setactiveSongArray(activeSong?.body?.split(/\r?\n/))
        } else {
            setactiveSongArray([])
        }
    }, [activeSong]);
    // useEffect(() => {
    //     console.log(activeLine)
    // }, [activeLine]);

    useEffect(() => {
        document.addEventListener('keydown', detectKeyDownGeneral);

        return () => {
            document.removeEventListener('keydown', detectKeyDownGeneral)
        }
    }, [])

    const detectKeyDown = (e) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (activeSongArray && activeSongArray.length > 0) {
                setactiveLine(prev => {
                    var nextPos = -1
                    var done = false
                    while (!done) {
                        if (activeSongArray[prev + nextPos] && (activeSongArray[prev + nextPos]).length > 0 && activeSongArray[prev + nextPos] != "  ") {
                            done = true
                        } else if ((prev + nextPos) < -1) {
                            nextPos = 0;
                            done = true
                        } else {
                            nextPos = nextPos - 1
                        }
                    }
                    return prev + nextPos
                })
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (activeSongArray && activeSongArray.length > 0) {
                setactiveLine(prev => {
                    var nextPos = 1
                    var done = false
                    while (!done) {
                        if (activeSongArray[prev + nextPos] && (activeSongArray[prev + nextPos]).length > 0 && activeSongArray[prev + nextPos] != "  ") {
                            done = true
                        } else if ((prev + nextPos) > activeSongArray.length) {
                            nextPos = 0;
                            done = true
                        } else {

                            nextPos++
                        }
                    }
                    return prev + nextPos
                })
            }
        } else if (e.key === "Escape") {
            e.preventDefault();
            setactiveLine(-1)
        }
    }
    const detectKeyDownGeneral = (e) => {
        if (e.key === "Escape") {
            e.preventDefault();
            setactiveLine(-1)
        }
    }
    const handleKeyPress = (event, otherKey) => {

        if (otherKey) {
            setdisplayData(() => { return (miniSearch.search(otherKey)).slice(0, 20) })
            return
        }

        if (!searchTerm) {
            if (songData.length) {
                setdisplayData(songData.slice(0, 20))
            }
            return
        }
        if (miniSearch.documentCount === 0) {
            miniSearch.addAll(songData)
        }
        setdisplayData(() => { return (miniSearch.search(searchTerm)).slice(0, 20) })

        // console.log('end', new Date().toJSON())
    };

    const openModal = (edit) => {
        if (edit) {
            setisEditModalOpen(true)
        } else {
            setIsModalOpen(true);
        }
    };

    const deleteBookmark = (song) => {
        setbookmarkedData(prev => {
            return prev.filter(object => {
                return object.uuid !== song.uuid;
            })
        })
    }
    const removedeletedSong = async (event, song) => {


        // Remove the item from the display list

        setsongData(prev => {
            return prev.filter(object => {
                return object.uuid !== song.uuid;
            })
        })
        setdisplayData(prev => {
            return prev.filter(object => {
                return object.uuid !== song.uuid;
            })
        })
        deleteBookmark(song)

        if (registrationInfo.auto_sync == 1) {
            const firebaseConfig = {
                apiKey: registrationInfo.firestore_apikey,
                projectId: registrationInfo.firestore_projectid,
                appId: registrationInfo.firestore_appid,
            };
            const collection_name = registrationInfo.license_key + "_songs"

            // Initialize Firebase
            const firestore = getFirestore(initializeApp(firebaseConfig, new Date().toJSON()))

            await deleteDoc(doc(firestore, collection_name, song.uuid));

        }

    }
    const addBookmark = (object) => {
        var index = bookmarkedData.findIndex(x => x.uuid == object.uuid);
        if (index === -1) {
            setbookmarkedData((prev) => {
                return prev.concat(object)
            })

        }
    }

    useEffect(() => {
        if (songData && songData.length) {
            setactiveSong(songData.find(song => song.uuid === activeId))
        }
    }, [activeId]);


    const closeModal = (edit) => {
        if (edit) {
            setBody('')
            setTitle('')
            setisEditModalOpen(false)
        } else {
            setIsModalOpen(false);
        }
    };

    const handleFormSubmitEdit = (formData) => {
        formData.uuid = activeId
        if (menuEditId) {
            formData.uuid = menuEditId
        }
        setsongData(prev => {
            return prev.map(prevItem => {
                if (prevItem.uuid == formData.uuid) {
                    prevItem.body = formData.body
                    prevItem.title = formData.title
                    prevItem.updated = new Date().toJSON()
                } else {
                }
                return prevItem
            })
        })
        const disDataIndex = displayData.findIndex(x => x.uuid === formData.uuid);
        if (disDataIndex > -1) {
            displayData[disDataIndex]['title'] = formData.title
        }

        if (searchTerm) {
            // setdisplayData(displayData)
        }

        //edit bookmarkdata
        ipcRenderer.send('singleEdit', formData)
        const bookmarkdataIndex = bookmarkedData.findIndex(x => x.uuid === formData.uuid);
        if (bookmarkdataIndex >= 0) {
            bookmarkedData[bookmarkdataIndex] = formData;
            setbookmarkedData(bookmarkedData)
        }

        //edit active song
        if (activeId === formData.uuid) {
            setactiveSong(formData)
        }
        closeModal(1);
    };

    const handleFormSubmit = (formData) => {
        ipcRenderer.send('singleInsert', formData)
        // ipcRenderer.invoke('singleInsert', formData).then((res) => console.log(res))

        closeModal();
    };

    const bulkInsertCompletef = (event, contents) => {
        setimporting(false)
        closeImportModal()
    };

    const closeImportModal = () => {
        setIsImportModalOpen(false);
    };

    const setSongDataEvent = (event, data) => {
        setsongData(data)
        // console.log(data)
    }

    const resetSongData = (event, data) => {
        if (data === "delete") {
            toast(<LowerToast status={'success'} message={'Song Deleted Successfully'} />, {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                style: { width: "500px", height: "20px", backgroundColor: "#A7FFB5", textAlign: "left" }
            });

        } else if (data === 'edit') {

            setmenuEditId('')
            // toast(<LowerToast status={'success'} message={'Song edited Successfully'} />, {
            //     position: toast.POSITION.BOTTOM_CENTER
            // });
            setTimeout(() => {
                if (registrationInfo.auto_sync == 1) {
                }
                ipcRenderer.send('syncSongs', { registrationInfo, songData })
            }, 5000);
            toast(<LowerToast status={'success'} message={'Song edited Successfully'} />, {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: { height: "10px", backgroundColor: "#A7FFB5", width: "500px" }
            });

        } else if (data === "add") {
            toast(<LowerToast status={'success'} message={'Song Added Successfully'} />, {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                style: { width: "500px", height: "20px", backgroundColor: "#A7FFB5", textAlign: "left" }
            });
            ipcRenderer.invoke('refreshSongData').then(setsongData)
            setTimeout(() => {
                if (registrationInfo.auto_sync == 1) {
                }
                ipcRenderer.send('syncSongs', { registrationInfo, songData })
            }, 5000);
        } else if (data === "sync") {

            ipcRenderer.invoke('refreshSongData').then(setsongData)
        }


    }

    const handleFolderContents = async (event, contents) => {
        const results = [];
        let fileContents;
        if (contents) {

            const totalcontents = contents.length

            await Promise.all(contents.map(async (element) => {
                fileContents = await readFileContents(element, totalcontents);
                results.push({ title: fileContents.fileName, body: fileContents.data });
            }));

            ipcRenderer.send('bulkInsert', results);
        }
    };

    const readFileContents = async (filePath, index) => {

        try {
            const response = await ipcRenderer.invoke('readFile', filePath);
            return response;
        } catch (error) {
            console.error('Error invoking readFile:', error);
        }

    };

    const dataLoader = async (event, data) => {
        setIsModalOpen(false);
    };

    const closeDeleteModal = () => {
        setisDeleteModalOpen(false);
    };

    const closisUpdateDownloadingModal = () => {
        setisUpdateDownloadingModalOpen(false);
    };

    const openImportModal = () => {
        setIsImportModalOpen(true);
    };

    return (
        <SongContext.Provider value={{ isModalOpen, setIsModalOpen, isDeleteModalOpen, setisDeleteModalOpen, isEditModalOpen, setisEditModalOpen, isImportModalOpen, setIsImportModalOpen, songData, setsongData, displayData, setdisplayData, bookmarkedData, setbookmarkedData, searchTerm, setSearchTerm, activeSong, setactiveSong, activeSongArray, setactiveSongArray, activeId, setactiveId, activeLine, setactiveLine, deleteSong, setdeleteSong, title, setTitle, body, setBody, menuEditId, setmenuEditId, bookmarkopen, setbookmarkOPen, importing, setimporting, songListRef, handleKeyPress, openModal, addBookmark, removedeletedSong, deleteBookmark, closeModal, handleFormSubmitEdit, closeDeleteModal, openImportModal, handleFormSubmit, closeImportModal, songDisplayRef, outPutType, setoutPutType, LyricsLineRef, LyricsLineParentRef, detectKeyDown, AllSonggSelectionArray, setAllSonggSelectionArray, searchAllSongsTerm, setsearchAllSongsTerm, isUpdateDownloadingModalOpen, setisUpdateDownloadingModalOpen, closisUpdateDownloadingModal }}>
            {children}
        </SongContext.Provider>
    )
}