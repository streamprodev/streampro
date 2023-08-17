

import { Wifi } from 'iconsax-react';


const EstablishingConnection = ({ outputConnectionEstablished }) => {

    return (
        <>
            <div style={{ paddingRight: '10vw', paddingLeft: '10vw', paddingTop: "70px", }}>

                <h2 style={{ color: '#FFFFFF', textAlign: "center", fontSize: '24px', fontWeight: "500px" }}>{outputConnectionEstablished === 0 ? "Establishing Connection" : "Connection Establisd"}</h2>
                {
                    outputConnectionEstablished !== 0 ?
                        <span style={{ color: '#FFFFFF', textAlign: "center", fontSize: '14px', fontWeight: "500px" }}>Connection has been established successfully to Vmix</span>
                        :
                        <span style={{ color: '#FFFFFF', textAlign: "center", fontSize: '14px', fontWeight: "500px" }}>Please wait while we stablish connection to Vmix</span>
                }
                <br />
                <Wifi size="201" color={outputConnectionEstablished === 0 ? "#FF0E48" : "#3EDB57"} style={{ marginTop: "10vh" }} />


            </div>
        </>
    );
};

export default EstablishingConnection;
