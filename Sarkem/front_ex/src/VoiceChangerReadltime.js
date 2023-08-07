import React, { useRef, useEffect, useState } from 'react';
import Jungle from './Jungle.js'; // Jungle.js 파일 경로를 적절하게 수정해주세요.

const VoiceChanger = () => {
  const audioRef = useRef(null);
  const jungleRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [pitchOffset, setPitchOffset] = useState(1);

  useEffect(() => {
    let context;
    let jungle = jungleRef.current;

    if (isRunning) {
      if (!jungle) {
        context = new (window.AudioContext || window.webkitAudioContext)();
        jungle = new Jungle(context);
        jungleRef.current = jungle;
      }

      const mediaStreamSource = context.createMediaStreamSource(audioRef.current.srcObject);
      console.log(audioRef.current.srcObject);
      mediaStreamSource.connect(jungle.input);
      jungle.output.connect(context.destination);
      jungle.isConnected = true;
    } else {
      if (jungle && jungle.isConnected) {
        context = jungle.context;
        jungle.output.disconnect(context.destination);
        jungle.isConnected = false;
      }
    }

    return () => {
      if (jungle && jungle.isConnected) {
        context = jungle.context;
        jungle.output.disconnect(context.destination);
        jungle.isConnected = false;
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
    setIsRunning(false); 
  };

  const handlePitchChange = (event) => {
    setPitchOffset(parseFloat(event.target.value));
    console.log(pitchOffset);
  };

  return (
    <div>
      <h1>음성 변조기</h1>
      <p>음성 변조를 시작하려면 아래 버튼을 클릭하세요.</p>
      <button onClick={handleStartRecording}>시작</button>
      <button onClick={handleStopRecording}>중지</button>
      <br />
      <label>
        음 높이 변경:
        <input type="range" min="-1" max="1" step="0.1" defaultValue="0" onChange={handlePitchChange} />
      </label>
      <audio ref={audioRef} controls />
    </div>
  );
};

export default VoiceChanger;
