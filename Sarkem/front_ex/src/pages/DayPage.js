/* eslint-disable */

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundDay';
/* Code generated with AutoHTML Plugin for Figma */
import CamButton from '../components/buttons/CamButton';
import MicButton from '../components/buttons/MicButton';
import SunMoon from '../components/games/SunMoon';
import ScMini from '../components/games/ScMini';
import DayPopup from '../components/games/DayPopup';
// 
import CamCat from '../components/camera/camcat';
import { useNavigate, useLocation } from 'react-router-dom';
import { OpenVidu, Session, Subscriber } from 'openvidu-browser';
import axios from 'axios';
import { useRoomContext } from '../Context';
import ChatButtonAndPopup from '../components/buttons/ChatButtonAndPopup';
//tempbutton
import TempButton from '../components/buttons/TempButton';

const StyledDayPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative; /* position을 relative로 설정합니다. */
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const TimeSecond = styled.text`
    color: #000000;
    text-align: left;
    font: 400 42px "ONE Mobile POP", sans-serif;
    position: absolute; /* position을 absolute로 설정합니다. */
    left: 22px; /* 원하는 위치 값을 지정합니다. */
    top: 90px; /* 원하는 위치 값을 지정합니다. */
`;





const DayPage = () => {

  const { roomId, setRoomId, isHost, setIsHost, nickName, setNickName,
    publisher, setPublisher, subscribers, setSubscribers, camArray, setCamArray,
    session, setSession, token, setToken, OV, joinSession, connectSession, leaveSession, isCamOn, setIsCamOn, isMicOn, setIsMicOn} = useRoomContext(); 
  const navigate = useNavigate();
  const location = useLocation();

  const handleCamButtonClick = () => {
    const camOn = !isCamOn;
    setIsCamOn(camOn);
    if (publisher) {
      publisher.publishVideo(camOn);
    }
  };
  
  
  const handleMicButtonClick = () => {
    const micOn = !isMicOn;
    setIsMicOn(micOn);
    if (publisher) {
      publisher.publishAudio(micOn);
    }
  };
  
  
  const handleScMiniClick = () => {
      // 버튼이 클릭되었을 때 실행되어야 할 작업을 여기에 정의
      console.log('ScMini clicked!');
  };


  useEffect(() => {
    console.log(roomId);
    if (roomId === ''){
      console.log("세션 정보가 없습니다.")
      navigate("/");
      return;
    }
    window.addEventListener("popstate", () => leaveSession);
    window.addEventListener('beforeunload', onbeforeunload);
  }, [])



  const CamCatGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 10px;
    justify-items: center;
    align-items: center;
    width: 100%;
    max-height: 80vh; /* Set a maximum height to adjust to the available space */
    overflow: auto; /* Add overflow property to handle overflow if needed */
  `;



  const calculateCamCatHeight = () => {
    const leftSectionHeight = leftSectionRef.current.offsetHeight;
    const maxCamCatCount = 10; 
    const camCatCount = Math.min(camArray.length, maxCamCatCount);
    return `${leftSectionHeight / camCatCount}px`;
  };

  const leftSectionRef = useRef(null);

    
    return (
    <Background>
        <StyledDayPage>
            <SunMoon alt="SunMoon"></SunMoon>
            <TimeSecond>60s</TimeSecond>
            <CamButton alt="Camera Button" onClick={handleCamButtonClick} isCamOn={isCamOn} />
            <MicButton alt="Mic Button" onClick={handleMicButtonClick} isMicOn={isMicOn}/>
            <DayPopup></DayPopup>
            <div ref={leftSectionRef}>
              <CamCatGrid camCount={camArray.length}>
                {camArray.map((user, index) => (
                  <CamCat key={index} props={user}/>
                ))}
              </CamCatGrid>
            </div>
            <ScMini alt="ScMini Button" onClick={handleScMiniClick}></ScMini>
            <TempButton url="/${roomId}/sunset" onClick={() => navigate(`/${roomId}/sunset`)} alt="Start Game" />
            <ChatButtonAndPopup />
        </StyledDayPage>
    </Background>
  );
};

export default DayPage;