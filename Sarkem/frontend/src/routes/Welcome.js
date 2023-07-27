import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import createSessionId from '../Utils';
function Welcome() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const goToCreateRoom = () => {
        navigate(`/${createSessionId()}`, {state: {host: true}});
    }
    return (
        <>
            <div>Welcome</div>
            
            <button onClick={goToCreateRoom}>createRoom</button>
        </>
    )
}

export default Welcome;