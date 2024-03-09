

import { Wifi } from 'iconsax-react';


const EstablishingConnection = ({ outputConnectionEstablished, connectionEstablished }) => {

    return (
        <>
            <div style={{ paddingRight: '10vw', paddingLeft: '10vw', paddingTop: "70px", }}>

                <h2 style={{ color: '#FFFFFF', textAlign: "center", fontSize: '24px', fontWeight: "500px" }}>{!connectionEstablished ? "Establishing Connection" : "Connection Establisd"}</h2>
                {
                    connectionEstablished ?
                        <span style={{ color: '#FFFFFF', textAlign: "center", fontSize: '14px', fontWeight: "500px" }}>Connection has been established successfully </span>
                        :
                        <span style={{ color: '#FFFFFF', textAlign: "center", fontSize: '14px', fontWeight: "500px" }}>Please wait while we stablish connection </span>
                }
                <br />
                <Wifi size="201" color={!connectionEstablished ? "#FF0E48" : "#3EDB57"} style={{ marginTop: "10vh" }} />


            </div>
        </>
    );
};

export default EstablishingConnection;
