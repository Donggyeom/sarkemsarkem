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

//켜기
const faceMyDetect = (videoRef, setBoxPosition, running, setRunning) => {
    if (!running) {
        const id = setInterval(async () => {
            const detectionsWithExpressions = await faceapi
                .detectSingleFace(videoRef)
                .withFaceLandmarks()
                .withFaceExpressions();
            console.log(detectionsWithExpressions);
            // console.log("여기");
            // console.log(detectionsWithExpressions.detection.box);
            if (detectionsWithExpressions && detectionsWithExpressions.detection) {
                const { x, y, width, height } = detectionsWithExpressions.detection.box;
                const containerWidth = videoRef.clientWidth; // Adjust to your container width
                console.log(containerWidth);
                const newX = containerWidth - x - width;
                setBoxPosition({ x: newX, y, width, height });
                console.log(setBoxPosition.x);
            } else {
                setBoxPosition({ x: 0, y: 0, width: 0, height: 0 });
            }
        }, 1000);
        setRunning(true);
        return id;
    }
};
//끄기
const stopFace = (intervalId, setRunning, setBoxPosition) => {
    if (intervalId) {
        clearInterval(intervalId);
        setRunning(false);
    }
    setBoxPosition({ x: 0, y: 0, width: 0, height: 0 });
}
export { loadModels, faceMyDetect, stopFace };


