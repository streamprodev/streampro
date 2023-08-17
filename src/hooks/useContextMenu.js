import { useEffect, useCallback, useState } from "react";

const useContextMenu = (type) => {
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [show, setShow] = useState(false);

    const handleContextMenu = useCallback(
        (event) => {
            event.preventDefault();

            if (type === "bookmark") {
                return
            }

            const clickX = event.clientX;
            const clickY = event.clientY;
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;
            const menuW = 151;
            const menuH = 148;

            const posX = clickX + menuW > screenW ? screenW - menuW : clickX;
            const posY = clickY + menuH > screenH ? screenH - menuH : clickY;

            setAnchorPoint({ x: posX, y: posY });
            setShow(true);
        },
        [setShow, setAnchorPoint]
    );

    // const handleContextMenu = (e) => {
    //     e.preventDefault();
    //     if (type === "bookmark") {
    //         return
    //     }
    //     // setActiveItem(itemId);
    //     if (showContextMenu) {
    //         setShowContextMenu(false);
    //         return

    //     }

    //     const newContextMenuKey = contextMenuKey + 1;
    //     setContextMenuKey(newContextMenuKey);

    //     const clickX = e.clientX;
    //     const clickY = e.clientY;
    //     const screenW = window.innerWidth;
    //     const screenH = window.innerHeight;
    //     const menuW = 180;
    //     const menuH = 190;

    //     const posX = clickX + menuW > screenW ? screenW - menuW : clickX;
    //     const posY = clickY + menuH > screenH ? screenH - menuH : clickY;

    //     setContextMenuPos({ x: posX, y: posY });
    //     setShowContextMenu(true);

    // };

    const handleClick = useCallback(() => show && setShow(false), [show]);

    useEffect(() => {
        document.addEventListener("click", handleClick);
        document.addEventListener("contextmenu", handleContextMenu);
        return () => {
            document.removeEventListener("click", handleClick);
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    });

    return { anchorPoint, show };
};

export default useContextMenu;