import React, { useEffect, useRef, useState } from 'react';
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';
const GestureRecognition = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [gestureRecognizer, setGestureRecognizer] = useState(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState('');

  useEffect(() => {
    const loadGestureRecognizer = async () => {
      const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm');
      const recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
          delegate: 'GPU',
          numHands: 2
        },
        runningMode: 'VIDEO',
      });
      setGestureRecognizer(recognizer);
    };
    loadGestureRecognizer();
  }, []);

  useEffect(()=> {
    if(gestureRecognizer !== null) {
      console.log(gestureRecognizer);
      enableWebcam();
    }
  }, [gestureRecognizer])

  useEffect(() => {
    if (webcamRunning) {
      webcamRef.current.addEventListener('loadeddata', predictWebcam);
    }
  }, [webcamRunning]);

  const enableWebcam = async () => {
    if (!gestureRecognizer) {
      alert('Please wait for GestureRecognizer to load.');
      return;
    }

    if (!webcamRunning) {
      setWebcamRunning(true);
      const constraints = { video: true };
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        webcamRef.current.srcObject = stream;
        
      } catch (err) {
        console.error('Error accessing webcam:', err);
        setWebcamRunning(false);
      }
    } else {
      setWebcamRunning(false);
      const stream = webcamRef.current.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const predictWebcam = async () => {
    if (webcamRunning && gestureRecognizer) {
      const videoElement = webcamRef.current;
      const nowInMs = Date.now();
      const results = await gestureRecognizer.recognizeForVideo(videoElement, nowInMs);

      if (results.gestures.length > 0) {
        const detectedGestureName = results.gestures[0][0].categoryName;
        setDetectedGesture(detectedGestureName);
      } else {
        setDetectedGesture('');
      }
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
      </div>
      <p>Detected Gesture: {detectedGesture}</p>
    </div>
  );
};

export default GestureRecognition;
