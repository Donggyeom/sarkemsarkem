import React, { useState, useEffect, useRef } from 'react';
import camcatImage from '../../img/camcat.png';

const CamCat = () => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    getUserCamera();
    getUserAudio();
    console.log(isCamOn);
  }, [videoRef])

  const getUserCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.style.transform = 'scaleX(-1) translateY(15%)';
    } catch (error) {
      console.error('Failed to start video: ', error);
    }
  };

  const getUserAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRef.current.srcObject = stream;
      setIsMicOn(true);
    }
     catch (error) {
      console.error('Failed to start audio: ', error);
    }

    const handleMicToggle = () => {
      const micOn = !isMicOn;
      setIsMicOn(micOn)
      setIsMicOn((prevIsMicOn) => !prevIsMicOn);
      const tracks = audioRef.current.srcObject.getTracks();
      tracks.forEach((track) => {
        track.enabled = micOn;
      });
    };
  
    const handleCamToggle = () => {
      const camOn = !isCamOn;
      setIsCamOn(camOn);
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => {
        track.enabled = camOn;
      });
    };
    
  };


  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${camcatImage})`,
        backgroundSize: '100% 100%', // Increase the background image size to 120% to make it larger
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        style={{
          width: '95%',
          height: '73%',
          objectFit: 'cover',
          borderRadius: '10%',

        }}
      />
      <audio ref={audioRef} autoPlay />
    </div>
  );
};

export default CamCat;