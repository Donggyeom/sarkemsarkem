import * as faceapi from 'face-api.js'

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


const faceMyDetect = (videoRef, running, setRunning, setDetectExpressions) => {
    if (!running) {
        const id = setInterval(async () => {
            const detectionsWithExpressions = await faceapi
                .detectSingleFace(videoRef.stream.videos[videoRef.stream.videos.length-1].video)
                .withFaceLandmarks()
                .withFaceExpressions();
            setDetectExpressions(detectionsWithExpressions);
        }, 2000);
        setRunning(true);
        return id;
    }
};
//끄기
const stopFace = (intervalId, setIntervalId, setRunning) => {
    console.log("꺼짐?");
    if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
        setRunning(false);
      }
}
export { loadModels, faceMyDetect, stopFace};


