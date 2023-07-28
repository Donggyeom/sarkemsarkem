/* eslint-disable */

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundNight';
/* Code generated with AutoHTML Plugin for Figma */
import CamButton from '../components/buttons/CamButton';
import MicButton from '../components/buttons/MicButton';
import SunMoon from '../components/games/SunMoon';
import ScMini from '../components/games/ScMini';
import NightPopup from '../components/games/NightPopup';
import TempButton from '../components/buttons/TempButton';
import { useRoomContext } from '../Context';
import { useNavigate, useLocation } from 'react-router-dom';
import CamCat from '../components/camera/camcat';

const StyledNightPage = styled.div`
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
    color: #FFFFFF;
    text-align: left;
    font: 400 42px "ONE Mobile POP", sans-serif;
    position: absolute; /* position을 absolute로 설정합니다. */
    left: 22px; /* 원하는 위치 값을 지정합니다. */
    top: 90px; /* 원하는 위치 값을 지정합니다. */
`;

const handleCamButtonClick = () => {
    // 버튼이 클릭되었을 때 실행되어야 할 작업을 여기에 정의
    console.log('Cam Button clicked!');
};

const handleMicButtonClick = () => {
    // 버튼이 클릭되었을 때 실행되어야 할 작업을 여기에 정의
    console.log('Mic Button clicked!');
};

const handleScMiniClick = () => {
    // 버튼이 클릭되었을 때 실행되어야 할 작업을 여기에 정의
    console.log('ScMini clicked!');
};

const NightPage = () => {
    const { roomId, setRoomId, isHost, setIsHost, nickName, setNickName,
        publisher, setPublisher, subscribers, setSubscribers, camArray, setCamArray,
        session, setSession, token, setToken, OV, joinSession, connectSession, leaveSession, isCamOn, setIsCamOn, isMicOn} = useRoomContext(); 
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log(roomId);
        if (roomId === undefined){
          console.log("세션 정보가 없습니다.")
          navigate("/");
          return;
        }
        window.history.pushState(null, "", location.href);
        window.addEventListener("popstate", () => window.history.pushState(null, "", location.href));
        window.addEventListener('beforeunload', (event) => {
          // 표준에 따라 기본 동작 방지
          event.preventDefault();
          // Chrome에서는 returnValue 설정이 필요함
          event.returnValue = '';
        });
      }, [])
    
    return (
    <Background>
        <SunMoon alt="SunMoon"></SunMoon>
        <TimeSecond>60s</TimeSecond>
        <CamButton alt="Camera Button" onClick={handleCamButtonClick} />
        <MicButton alt="Mic Button" onClick={handleMicButtonClick} />
        <ScMini alt="ScMini Button" onClick={handleScMiniClick}></ScMini>
        <NightPopup></NightPopup>
        <TempButton url="/${roomId}/result" onClick={() => navigate(`/${roomId}/result`)} />
        
    </Background>
  );
};

export default NightPage;
