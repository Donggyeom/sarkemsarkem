import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
// import { FaceDetection } from 'face-api.js/dist/face-api';
import * as faceapi from 'face-api.js';

function Join() {
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [userName, setUserName] = useState('이름모를유저' + Math.floor(Math.random() * 100));
    const [isHost, setIsHost] = useState(false);
    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const canvasRef = useRef();

    const navigate = useNavigate();
    const location = useLocation();

    const sessionId = useLocation().pathname.slice(1);


    const loadModels = () => {
        Promise.all([
            faceapi.loadTinyFaceDetectorModel('/models'),
            faceapi.loadFaceLandmarkModel('/models'),
            faceapi.loadFaceRecognitionModel('/models'),
            faceapi.loadFaceExpressionModel('/models'),

            faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
            faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
            faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
            faceapi.nets.faceExpressionNet.loadFromUri("/models")
        ]).then(() => {
            faceMyDetect()
        })
    }

    const faceMyDetect = () => {
        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(videoRef.current,
                new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

            // DRAW YOU FACE IN WEBCAM
            canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current)
            faceapi.matchDimensions(canvasRef.current, {
                width: 940,
                height: 650
            })

            const resized = faceapi.resizeResults(detections, {
                width: 940,
                height: 650
            })

            faceapi.draw.drawDetections(canvasRef.current, resized)
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resized)
            faceapi.draw.drawFaceExpressions(canvasRef.current, resized)


        }, 1000)
    }

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
            const input = audioRef.current.srcObject;
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

    const joinRoom = async () => {
        console.log(sessionId);
        navigate("/lobby", { state: { sessionId: sessionId, userName: userName, videoEnabled: videoEnabled, audioEnabled: audioEnabled, isHost: isHost } });

    }

    const changeUser = (event) => {
        setUserName(event.target.value);
    }

    useEffect(() => {
        if (location.state && location.state.host) setIsHost(true);
        getUserCamera();
        getUserAudio();
        loadModels()
    }, [videoRef])

    return (
        <>
            <div className='joinContainer'>
                <video ref={videoRef} autoPlay />
                <audio ref={audioRef} autoPlay />
                <input onChange={changeUser} placeholder='이름' value={userName} />
                <button onClick={toggleVideo}>카메라 {videoEnabled ? "Off" : "On"}</button>
                <button onClick={toggleAudio}>마이크 {audioEnabled ? "Off" : "On"}</button>
                <button id="joinButton" onClick={joinRoom} >{isHost ? "방 만들기" : "입장하기"}</button>

            </div>
            <canvas ref={canvasRef} width="940" height="650"
                className="appcanvas" />
        </>
    )
}

export default Join;