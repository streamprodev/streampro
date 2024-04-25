
import React, { useContext, useState, useEffect, useMemo } from 'react'
const { ipcRenderer } = window.require('electron');

export const EwGrabberContext = React.createContext({})



export function useEwGrabber() { return useContext(EwGrabberContext) }

export function EwGrabberContextProvider({ children }) {
    // console.log(chapters)
    const [isEwGrabberConnected, setIsEwGrabberConnected] = useState(false)
    const [ewGrabbedText, setEwGrabberText] = useState("")
    const [ewGrabbedImage, setEwGrabberImage] = useState("")
    const [ewGrabbedScreen, setEwGrabberScreen] = useState("")

    const [ewGrabbedBibleName, setEwGrabberBibleName] = React.useState('')
    const [ewGrabbedBibleChapter, setEwGrabberBibleChapter] = React.useState('')
    const [ewGrabbedBibleVerse, setEwGrabberBibleVerse] = React.useState('')
    const [ewGrabbedBibleVersion, setEwGrabberBibleVersion] = React.useState('')

    useEffect(() => {
        ipcRenderer.on('grabber-finished-image', updateGrabbedImage)
        return () => {
            ipcRenderer.removeListener('grabber-finished-image', updateGrabbedImage);
        }
    }, [ewGrabbedScreen]);





    const updateGrabbedImage = (event, arrayBuffer) => {
        console.log(ewGrabbedScreen, 'scghg');
        setEwGrabberImage(arrayBuffer)
        if (ewGrabbedScreen > 1) {

        }
        // setEwGrabberImage(btoa(String.fromCharCode(...new Uint8Array(arrayBuffer))))
    }



    return (
        <EwGrabberContext.Provider value={{ isEwGrabberConnected, setIsEwGrabberConnected, ewGrabbedText, setEwGrabberText, ewGrabbedImage, setEwGrabberImage, ewGrabbedScreen, setEwGrabberScreen, ewGrabbedBibleName, setEwGrabberBibleName, ewGrabbedBibleChapter, setEwGrabberBibleChapter, ewGrabbedBibleVerse, setEwGrabberBibleVerse, ewGrabbedBibleVersion, setEwGrabberBibleVersion }}>
            {children}
        </EwGrabberContext.Provider>
    )
}