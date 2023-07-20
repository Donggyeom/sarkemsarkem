import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";

function Welcome() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const goToCreateRoom = () => {
        navigate(`/G${Math.floor(Math.random() * 100)}`);
    }
    return (
        <>
            <div>Welcome</div>
            
            <button onClick={goToCreateRoom}>createRoom</button>
        </>
    )
}

export default Welcome;