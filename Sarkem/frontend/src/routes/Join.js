import React, {useEffect, useRef, useState} from 'react'
import { useNavigate, useLocation } from "react-router-dom";


function Join() {
    
    
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [userName, setUserName] = useState("유저 이름");
    const [sessionId, setSessionId] = useState(useLocation().pathname.slice(1));

    const videoRef = useRef(null);
    const audioRef = useRef(null);
    
    const navigate = useNavigate();
    const location = useLocation();
    
    const getUserCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error('Failed to start video:', error);
        }
    }
    
    const getUserAudio = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioRef.current.srcObject = stream;
        } catch (error) {
            console.error('Failed to start audio:', error);
        }
    }
    
    const toggleVideo = () => {
        const enabled = !videoEnabled;
        setVideoEnabled(enabled);
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => {
            track.enabled = enabled;
        });
    }
    
    const toggleAudio = () => {
        const enabled = !audioEnabled;
        setAudioEnabled(enabled);
        const tracks = audioRef.current.srcObject.getTracks();
        tracks.forEach((track) => {
            track.enabled = enabled;
        });
    }
    
    const joinRoom = async() => {
            console.log(sessionId);
            navigate("/lobby", {state: {sessionId: sessionId, userName: userName, videoEnabled: videoEnabled, audioEnabled, audioEnabled}});
            
        }
        
        const changeUser = (event) => {
            setUserName(event.target.value);
        }

    useEffect(()=>{
        getUserCamera();
        getUserAudio();
    }, [videoRef])
    
    return (
        <>
        <div>Join</div>
        <div className='joinContainer'>
            <video ref={videoRef} autoPlay/>
            <audio ref={audioRef} autoPlay/>
            <input onChange={changeUser} placeholder='이름'/>
            <button onClick={toggleVideo}>카메라 on/off</button>
            <button onClick={toggleAudio}>마이크 on/off</button>
            <button onClick={joinRoom}>join</button>
            
        </div>
        </>
    )
}

export default Join;