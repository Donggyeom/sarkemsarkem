import React, { useRef, useEffect, useState } from 'react';
import Jungle from './Jungle.js'; // Jungle.js 파일 경로를 적절하게 수정해주세요.

const VoiceChanger = () => {
  const audioRef = useRef(null);
  const jungleRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [pitchOffset, setPitchOffset] = useState(0);

  useEffect(() => {
    if (isRunning) {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const jungle = new Jungle(context);
      jungleRef.current = jungle;

      const mediaStreamSource = context.createMediaStreamSource(audioRef.current.srcObject);
      mediaStreamSource.connect(jungle.input);
      jungle.output.connect(context.destination);
    } else {
      if (jungleRef.current) {
        const context = jungleRef.current.context;
        const mediaStreamSource = context.createMediaStreamSource(audioRef.current.srcObject);
        mediaStreamSource.disconnect(jungleRef.current.input);
        jungleRef.current.output.disconnect(context.destination);
        jungleRef.current = null;
      }
    }

    return () => {
      if (jungleRef.current) {
        const context = jungleRef.current.context;
        const mediaStreamSource = context.createMediaStreamSource(audioRef.current.srcObject);
        mediaStreamSource.disconnect(jungleRef.current.input);
        jungleRef.current.output.disconnect(context.destination);
        jungleRef.current = null;
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (jungleRef.current) {
      jungleRef.current.setPitchOffset(pitchOffset);
    }
  }, [pitchOffset]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRef.current.srcObject = stream;
      setIsRunning(true);
    } catch (error) {
      console.error('오디오 스트림을 가져오는 중 오류:', error);
    }
  };

  const handleStopRecording = () => {
    const tracks = audioRef.current.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    setIsRunning(false);
  };

  const handlePitchChange = (event) => {
    setPitchOffset(parseFloat(event.target.value));
  };

  return (
    <div>
      <h1>Voice Changer</h1>
      <p>Click the button below to start voice changer</p>
      <button onClick={handleStartRecording}>Start</button>
      <button onClick={handleStopRecording}>Stop</button>
      <br />
      <label>
        Pitch Change:
        <input type="range" min="-1" max="1" step="0.1" defaultValue="0" onChange={handlePitchChange} />
      </label>
      <audio ref={audioRef} controls />
    </div>
  );
};

export default VoiceChanger;
