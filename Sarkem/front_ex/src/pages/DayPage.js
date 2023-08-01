/* eslint-disable */

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundDay';

import CamButton from '../components/buttons/CamButton';
import MicButton from '../components/buttons/MicButton';
import SunMoon from '../components/games/SunMoon';
import ScMini from '../components/games/ScMini';
import DayPopup from '../components/games/DayPopup';

import CamCat from '../components/camera/camcat';
import { useNavigate, useLocation } from 'react-router-dom';
import { OpenVidu, Session, Subscriber } from 'openvidu-browser';
import axios from 'axios';
import { useRoomContext } from '../Context';
import ChatButtonAndPopup from '../components/buttons/ChatButtonAndPopup';
import TempButton from '../components/buttons/TempButton';
import DayNightCamera from '../components/camera/DayNightCamera';


const StyledDayPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
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
  const [voteCount, setVoteCount] = useState(0);

  const handleVoteClick = () => {
    setVoteCount((prevCount) => prevCount + 1);
  };

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
   
    return (
    <Background>
      <StyledDayPage>
        <SunMoon alt="SunMoon"></SunMoon>
        <TimeSecond>60s</TimeSecond>
        <CamButton alt="Camera Button" onClick={handleCamButtonClick} isCamOn={isCamOn} />
        <MicButton alt="Mic Button" onClick={handleMicButtonClick} isMicOn={isMicOn}/>
          <DayPopup></DayPopup>
          <DayNightCamera camArray={camArray}/>
          <ScMini alt="ScMini Button" onClick={handleScMiniClick}></ScMini>
        </StyledDayPage>
        <TempButton url="/${roomId}/sunset" onClick={() => navigate(`/${roomId}/sunset`)} alt="Start Game" />
        <ChatButtonAndPopup />
    </Background>
  );
};

export default DayPage;