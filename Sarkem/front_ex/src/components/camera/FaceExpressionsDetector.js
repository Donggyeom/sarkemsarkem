import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";

const FaceExpressionsDetector = () => {
  const videoRef = useRef(null);
  const [detections, setDetections] = useState(null);
  const [emotions, setEmotions] = useState({});

  useEffect(() => {
    let isMounted = true;

    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    };

    loadModels();

    const startFaceDetection = async () => {
      if (isMounted && videoRef.current) {
        const detections = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceExpressions();
        if (detections) {
          setDetections(detections);
          setEmotions(detections.expressions);
        }
      }
    };

    const intervalId = setInterval(startFaceDetection, 500); // 원하는 간격으로 조정

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      {detections && (
        <div>
          <h2>검출된 감정:</h2>
          <ul>
            {Object.entries(emotions).map(([emotion, probability]) => (
              <li key={emotion}>
                {emotion}: {Math.round(probability * 100)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FaceExpressionsDetector;
