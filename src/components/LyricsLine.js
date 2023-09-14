import { useEffect } from "react";



const LyricsLine = ({ line, index, activeLine, setactiveLine, parentRef, ownRef }) => {
    // console.log(ownRef)

    function checkInView(container, element, partial) {

        //Get container properties
        let cTop = container.scrollTop + 270;
        let cBottom = cTop + container.clientHeight -30;
        //Get element properties
        let eTop = element.offsetTop;
        let eBottom = eTop + element.clientHeight;
        let scrollDirection = null;
        // console.log(eTop , cTop,'top')
        // console.log(eBottom, cBottom,'bottom')
        if ((eTop < cTop)) {
            scrollDirection = "end"
        }
        if ((eBottom > cBottom)) {
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
           
            if (ownRef.current[index] && parentRef) {
                if (ownRef.current[index] && parentRef.current) {
                    if (!checkInView(parentRef.current, ownRef.current[index], true).isInViewPort) {

                        ownRef.current[index].scrollIntoView({
                            behavior: "smooth",
                            block: checkInView(parentRef.current, ownRef.current[index], false).scrollDirection || 'start',
                            inline: "nearest"
                        })
                        // console.log(`Hidden element is now hidden`);
                    }

                }
            }
        }
    }, [activeLine, ownRef])



    return (
        // <div style={{ display: "flex", alignItems: "center", flexDirection:"column" }}>
        <p style={{ listStyleType: "none", paddingLeft: "90px", fontSize: '14px', fontWeight: "500", color: activeLine == index ? "#FF3939" : "#B1B1B1", cursor: "pointer", paddingRight: "90px", textAlign: "left", marginBottom: "0px" }} onClick={() => setactiveLine(index)} ref={ref=>ownRef.current[index]=ref}>{line}</p>
        // </div>

    );
};

export default LyricsLine;
