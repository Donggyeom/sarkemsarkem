import React, { useEffect, useRef, useState } from 'react';
import { GestureRecognizer, FilesetResolver, DrawingUtils, HAND_CONNECTIONS, drawConnectors, drawLandmarks } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0';

const GestureRecognitionExample = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [gestureRecognizer, setGestureRecognizer] = useState(null);
    const [webcamRunning, setWebcamRunning] = useState(false);
  
    useEffect(() => {
      const loadGestureRecognizer = async () => {
        const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm');
        const recognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
        });
        setGestureRecognizer(recognizer);
      };
      loadGestureRecognizer();
    }, []);
  
    const enableWebcam = async () => {
      if (!gestureRecognizer) {
        alert('Please wait for GestureRecognizer to load.');
        return;
      }
  
      if (!webcamRunning) {
        setWebcamRunning(true);
        
      } else {
        setWebcamRunning(false);
        const stream = webcamRef.current.srcObject;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      }
    };
  
    useEffect(()=> {
        if(webcamRunning) {

            async function asd() {
                const constraints = { video: true };
                try {
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    webcamRef.current.srcObject = stream;
                    webcamRef.current.addEventListener('loadeddata', predictWebcam);
                } catch (err) {
                    console.error('Error accessing webcam:', err);
                    setWebcamRunning(false);
                }
            }
            asd();
            
        }
    }, [webcamRunning])

    const predictWebcam = async () => {
        console.log(webcamRunning, gestureRecognizer)
      if (webcamRunning && gestureRecognizer) {
        const videoElement = webcamRef.current;
        const canvasElement = canvasRef.current;
        const ctx = canvasElement.getContext('2d');
        const nowInMs = Date.now();
        const results = await gestureRecognizer.recognizeForVideo(videoElement, nowInMs);
  
        ctx.save();
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        
        if (results.landmarks) {
          for (const landmarks of results.landmarks) {
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
              color: '#00FF00',
              lineWidth: 5,
            });
            drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 1 });
          }
        }
        ctx.restore();
  
        // Process the detected gestures here
        console.log('Detected Gestures:', results);
  
        // Continue predicting frames from webcam
        requestAnimationFrame(predictWebcam);
      }
    };
  
    return (
      <div>
        <h1>Gesture Recognition with MediaPipe</h1>
        <button onClick={enableWebcam}>
          {webcamRunning ? 'Disable Webcam' : 'Enable Webcam'}
        </button>
        <div>
          <video ref={webcamRef} autoPlay playsInline style={{ transform: 'rotateY(180deg)', width: '640px', height: '480px' }} />
        <canvas ref={canvasRef} width="640" height="480" style={{ position: 'absolute', left: 0, top: "150px" }} />
      </div>
    </div>
  );
};

export default GestureRecognitionExample;
