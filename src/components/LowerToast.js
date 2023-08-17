import { CloseCircle, TickCircle, Refresh } from 'iconsax-react';
import React from 'react';

function LowerToast({ status, message }) {


    return (
        <div style={{ display: "flex", flexDirection: "row", backgroundColor: status === 'success' ? "#A7FFB5" : "#FF3939", width: "60vw", alignItems: "center", gap: 8 }}>
            {
                status === 'success' && <TickCircle size="24" color="#111111" />}
                    
            {status === 'error' &&<CloseCircle size="24" color="#ffffff" />}
            {status === 'sync' && <Refresh size="22" color="#ffffff" />}

            {/* <Refresh
                size="32"
                color="#FF8A65"
            /> */}
            <span style={{ color: status === 'success' ? "#111111" : "#ffffff", fontSize: "16px", fontWeight: "600px" }}>{message ?  message : "Song added successfully"}</span>

        </div>
    )
}

export default LowerToast;