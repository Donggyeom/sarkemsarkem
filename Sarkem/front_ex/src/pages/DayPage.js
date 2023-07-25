import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundDay';
import CamButton from '../components/buttons/CamButton';
import MicButton from '../components/buttons/MicButton';
import SunMoon from '../components/games/SunMoon';
import ScMini from '../components/games/ScMini';
import DayPopup from '../components/games/DayPopup';
import CamCat from '../components/camera/camcat';

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledDayPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const TimeSecond = styled.text`
  color: #000000;
  text-align: left;
  font: 400 42px "ONE Mobile POP", sans-serif;
  position: absolute;
  left: 22px;
  top: 90px;
`;

const CamCatContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 60%;
`;

const CamCatItem = styled.div`
  width: 30%;
  margin-bottom: 20px;
`;

const handleScMiniClick = () => {
  console.log('ScMini clicked!');
};

const DayPage = () => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    getUserCamera();
    getUserAudio();
  }, []);

  const getUserCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCamOn(true);

      videoRef.current.style.transform = 'scaleX(-1)';
    } catch (error) {
      console.error("Failed to start video: ", error);
    }
  };

  const getUserAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRef.current.srcObject = stream;
      setIsMicOn(true);
    } catch (error) {
      console.error("Failed to start audio: ", error);
    }
  };

  const handleMicButtonClick = () => {
    console.log('Mic Button clicked!');
    // const micOn = !isMicOn;
    // setIsMicOn(micOn)
    // const tracks = audioRef.current.srcObject.getTracks();
    // tracks.forEach((track) => {
    // 	track.enabled = micOn;
    // });
  };

  const handleCamButtonClick = () => {
    console.log('Cam Button clicked!');
    const camOn = !isCamOn;
    setIsCamOn(camOn);
    const tracks = videoRef.current.srcObject.getTracks();
    tracks.forEach((track) => {
      track.enabled = camOn;
    });
  };

  return (
    <Background>
      <CenteredContainer>
        <StyledDayPage>
          {/* <DayPopup style={{ zIndex: 1 }} /> */}
          <SunMoon alt="SunMoon" />
          <TimeSecond>60s</TimeSecond>
          <CamButton alt="Camera Button" onClick={handleCamButtonClick} />
          <MicButton alt="Mic Button" onClick={handleMicButtonClick} />
          <ScMini alt="ScMini Button" onClick={handleScMiniClick} />

          <CamCatContainer>
            <CamCatItem><CamCat /></CamCatItem>
            <CamCatItem><CamCat /></CamCatItem>
            <CamCatItem><CamCat /></CamCatItem>
            <CamCatItem><CamCat /></CamCatItem>
            <CamCatItem><CamCat /></CamCatItem>
            <CamCatItem><CamCat /></CamCatItem>
          </CamCatContainer>
        </StyledDayPage>
      </CenteredContainer>
    </Background>
  );
};

export default DayPage;
