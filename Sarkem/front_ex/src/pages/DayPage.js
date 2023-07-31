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
    position : absolute;
    display: grid;
    // grid-gap: 10px;
    align-items: center;
    justify-items: center;
    overflow: hidden;
    ${({ style }) =>
      style && `
      width: ${style.width};
      height : ${style.height};
      max-height: ${style.maxHeight};
      left : ${style.left};

  `}
`;

const calculateGrid = (camCount) => {
  const positions = [
  ];
  if (camCount === 6) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      top : '7.5%',
      width : '80%',
    };
  } else if (camCount === 7) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: 'repeat(4, 1fr)',
      width : '90%',
    };
  } else if (camCount === 8) {
    return {
      gridTemplateRows: 'repeat(2, 1fr)',
      gridTemplateColumns: 'repeat(4, 1fr)',
      width: '85%',
    };
  } else if (camCount === 9) {
    return {
      gridTemplateRows: 'repeat(2, 1fr)',
      gridTemplateColumns: 'repeat(5, 1fr)',
      width: '95%',
      height : '70%',
    };
  } else if (camCount === 10) {
    return {
      gridTemplateRows: 'repeat(2, 1fr)',
      gridTemplateColumns: 'repeat(5, 1fr)',
      left : '5%',
      width: '90%',
      height : '70%',
    };
  } else {
    // Add more cases as needed
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
    };
  }
};

const CamCatWrapper = styled.div`
  ${({ camCount, index }) =>
  
  camCount === 4 && index === 0
  ? `
    position: relative;
    left: 45%;
  `
  :
  camCount === 7 && index === 0
  ? `
    position: relative;
    left : 50%;
  `
  :
  camCount === 7 && index === 1
  ? `
    position: relative;
    left : 50%;
  `
  :
  camCount === 7 && index === 2
  ? `
    position: relative;
    left : 50%;
  `

  :
  camCount === 7 && index === 3
  ? `
    position: relative;
    top : 100%;
  `
  :
  camCount === 9 && index === 0
  ? `
    position: relative;
    left : 50%;
  `
  :
  camCount === 9 && index === 1
  ? `
    position: relative;
    left : 50%;
  `
  :
  camCount === 9 && index === 2
  ? `
    position: relative;
    left : 50%;
  `
  :
  camCount === 9 && index === 3
  ? `
    position: relative;
    left : 50%;
  `
  :
  camCount === 9 && index === 4
  ? `
    position: relative;
    top : 100%;
  `
  : ''};
  `;
  

  const camCount = camArray.length; // camCount를 SunsetPage 내부에서 계산
  const gridStyles = calculateGrid(camCount);
  const leftSectionRef = useRef(null);

    
    return (
    <Background>
        <StyledDayPage>
            <SunMoon alt="SunMoon"></SunMoon>
            <TimeSecond>60s</TimeSecond>
            <CamButton alt="Camera Button" onClick={handleCamButtonClick} isCamOn={isCamOn} />
            <MicButton alt="Mic Button" onClick={handleMicButtonClick} isMicOn={isMicOn}/>
            <DayPopup></DayPopup>
              <CamCatGrid style={gridStyles}>
                {camArray.slice().reverse().map((user, index) => ( // Using slice() to create a copy and then reversing it
                  <CamCatWrapper key={index} camCount={camCount} index={index}>
                    <CamCat props={camArray[index]} />
                  </CamCatWrapper>
                ))}
              </CamCatGrid>
            <ScMini alt="ScMini Button" onClick={handleScMiniClick}></ScMini>
            <TempButton url="/${roomId}/sunset" onClick={() => navigate(`/${roomId}/sunset`)} alt="Start Game" />
            <ChatButtonAndPopup />
        </StyledDayPage>
    </Background>
  );
};

export default DayPage;