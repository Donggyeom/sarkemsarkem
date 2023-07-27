import React, {useEffect, useRef, useState} from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import * as canvas from 'canvas';

import * as faceapi from 'face-api.js';

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement, additionally an implementation
// of ImageData is required, in case you want to use the MTCNN
const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

function Join() {
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [userName, setUserName] = useState('이름모를유저' + Math.floor(Math.random() * 100));
    const [isHost, setIsHost] = useState(false);
    const videoRef = useRef(null);
    const audioRef = useRef(null);
    
    const navigate = useNavigate();
    const location = useLocation();
    
    const sessionId = useLocation().pathname.slice(1);

    const getUserCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            await faceapi.loadSsdMobilenetv1Model('/models')
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error('Failed to start video:', error);
        }
    }
    
    const getUserAudio = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const input = audioRef.current.srcObject;
            await faceapi.detectSingleFace(input)
            await faceapi.detectSingleFace(input).withFaceExpressions()
            await faceapi.detectSingleFace(input).withFaceLandmarks()
            await faceapi.detectSingleFace(input).withFaceExpressions().withFaceLandmarks()
            await faceapi.detectSingleFace(input).withFaceExpressions().withFaceLandmarks().withFaceDescriptor()
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
            navigate("/lobby", {state: {sessionId: sessionId, userName: userName, videoEnabled: videoEnabled, audioEnabled: audioEnabled, isHost: isHost}});
            
        }
        
        const changeUser = (event) => {
            setUserName(event.target.value);
        }

    useEffect(()=>{
        if(location.state && location.state.host) setIsHost(true);
        getUserCamera();
        getUserAudio();
    }, [videoRef])
    
    return (
        <>
        <div className='joinContainer'>
            <video ref={videoRef} autoPlay/>
            <audio ref={audioRef} autoPlay/>
            <input onChange={changeUser} placeholder='이름' value={userName}/>
            <button onClick={toggleVideo}>카메라 {videoEnabled ? "Off" : "On"}</button>
            <button onClick={toggleAudio}>마이크 {audioEnabled ? "Off" : "On"}</button>
            <button id="joinButton" onClick={joinRoom} >{isHost ? "방 만들기" : "입장하기"}</button>
            
        </div>
        </>
    )
}

export default Join;