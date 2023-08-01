// import { useRef, useEffect, useState } from 'react'

import * as faceapi from 'face-api.js'

//켜고끄기
// const [running, setRunning] = useState(false); // running state 추가
// const [intervalId, setIntervalId] = useState(null); // 변수 추가


//faceapi model
const loadModels = () => {
    Promise.all([
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
        faceapi.nets.mtcnn.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    ])
}

//켜기
const faceMyDetect = (videoRef, running, setRunning) => {
    if (!running) {
        const id = setInterval(async () => {
            const detectionsWithExpressions = await faceapi
                .detectSingleFace(videoRef)
                .withFaceLandmarks()
                .withFaceExpressions();
            console.log(detectionsWithExpressions);
            // console.log(videoRef.current);
        }, 1000);
        setRunning(true);
        return id;
    }
};
//끄기
const stopFace = (intervalId, setRunning) => {
    if (intervalId) {
        clearInterval(intervalId);
        setRunning(false);
    }
    
}
export { loadModels, faceMyDetect, stopFace };


