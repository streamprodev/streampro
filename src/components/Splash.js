

import { useState } from 'react';
import logo from '../assets/Frame 38.png';
import wifi from '../assets/wifi.png';
import { useRegistrationInfo } from '../context/RegistrationInfoContext';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";


const Splash = () => {
    const navigate = useNavigate();

    const [showSplash, setShowSplash] = useState(true);
    const { userExists } = useRegistrationInfo();

    useEffect(() => {
        setTimeout(() => {
            if (userExists === 1) {
                navigate('/main/song')

            } else if (userExists === 0) {
                navigate('/register')

            }
        }, 2500)
    }, [userExists])

    return (
        <header className="App-header">
            <img src={logo} alt="logo" width={"700vw"} />
            <img src={wifi} alt="logo" style={{ position: "absolute", left: "0", bottom: "15%", height: "60%" }} />
        </header>
    );
};

export default Splash;
