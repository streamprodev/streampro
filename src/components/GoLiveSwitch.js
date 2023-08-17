import * as React from 'react';
import Switch, { switchClasses } from '@mui/joy/Switch';
import Typography from '@mui/joy/Typography';

export default function GoLiveSwitch({ isLive, setisLive }) {
    return (
        <Switch
            slotProps={{
                track: {
                    children: (
                        <React.Fragment>
                            <Typography component="span" level="inherit" sx={{ ml: '15px' }}>
                                {isLive ? "Live" : ""}
                            </Typography>
                            <Typography component="span" level="inherit" sx={{ mr: '10px' }}>
                                {isLive ? "" : "Offline"}
                            </Typography>
                        </React.Fragment>
                    ),
                },
            }}
            sx={{
                '--Switch-thumbSize': '20px',
                '--Switch-trackWidth': '80px',
                '--Switch-trackHeight': '27px',
                '--Switch-trackBackground': '#FF3939',
                '&:hover': {
                    '--Switch-trackBackground': '#FF3939',
                },
                [`&.${switchClasses.checked}`]: {
                    '--Switch-trackBackground': '#5CB176',
                    '&:hover': {
                        '--Switch-trackBackground': '#5CB176',
                    },
                },
            }}
            onChange={() => setisLive(prev => !prev)} checked={isLive}
            color={isLive ? 'success' : 'danger'}

        />
    );
}


                    // <div>
                    // </div>
                    // <div style={{ backgroundColor: "yellow" }}>
                    // </div>


// <Typography component="span" level="inherit" sx={{ margin: 'auto', fontSize: "14px" }} >
//     {isLive ? "Live" : "Offline"}
// </Typography>

// <React.Fragment>
//     {
//         isLive ?
//             <Typography component="span" level="inherit" sx={{ ml: '10px', fontSize: "14px", }} >
//                 Live
//             </Typography>
//             :
//             <Typography component="span" level="inherit" sx={{ marginLeft: 'auto', fontSize: "14px", }} >
//                 Offline
//             </Typography>
//     }
// </React.Fragment>