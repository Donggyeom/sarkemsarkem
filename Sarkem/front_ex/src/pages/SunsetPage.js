/* eslint-disable */

import React, { useState, useEffect, useRef }  from 'react';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundSunset';
/* Code generated with AutoHTML Plugin for Figma */
import CamButton from '../components/buttons/CamButton';
import MicButton from '../components/buttons/MicButton';
import SunMoon from '../components/games/SunMoon';
import ScMini from '../components/games/ScMini';
import CamCat from '../components/camera/camcat';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRoomContext } from '../Context';
import TempButton from '../components/buttons/TempButton';

// const StyledSunsetPage = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   position: relative; /* position을 relative로 설정합니다. */
//   width: 100%;
//   height: 100vh;
//   overflow: hidden;
// `;

// const LeftSection = styled.div`
//   flex: 4.5;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   overflow: hidden;
//   position: relative; /* Add position relative */
// `;

const CamCatGrid = styled.div`
  flex: 1;
  display: grid;
  gap: 3px;
  align-items: center;
  justify-items: center;
  overflow: hidden;
  ${({ style }) => style && `
    grid-template-rows: ${style.gridTemplateRows};
    grid-template-columns: ${style.gridTemplateColumns};
    width: ${style.width};
    max-height: ${style.maxHeight};
    height: auto;
  `}
`;

const calculateGrid = (camCount) => {
    if (camCount === 1) {
      return {
        gridTemplateRows: '1fr',
        gridTemplateColumns: '1fr',
        width: '100%',
      };
    } else if (camCount === 2) {
      return {
        gridTemplateRows: '1fr 1fr',
        gridTemplateColumns: '1fr',
        width: '50%',
      };
    } else if (camCount === 3) {
      return {
        gridTemplateRows: '1fr 1fr',
        gridTemplateColumns: '1fr 1fr',
        width: '100%',
      };
    } else if (camCount === 4) {
      return {
        gridTemplateRows: '1fr 1fr',
        gridTemplateColumns: '1fr 1fr',
      };
    } else if (camCount === 5) {
      return {
        gridTemplateRows: '1fr 1fr 1fr',
        gridTemplateColumns: '1fr 1fr',
        width: '62%',
      };
    } else if (camCount === 6) {
      return {
        gridTemplateRows: '1fr 1fr 1fr',
        gridTemplateColumns: '1fr 1fr',
        width: '62%',
      };
    } else if (camCount === 7) {
      return {
        gridTemplateRows: '1fr 1fr 1fr',
        gridTemplateColumns: '1fr 1fr 1fr',
        width: '92%',
      };
    } else if (camCount === 8) {
      return {
        gridTemplateRows: '1fr 1fr 1fr',
        gridTemplateColumns: '1fr 1fr 1fr',
        width: '92%',
      };
    } else if (camCount === 9) {
      return {
        gridTemplateRows: '1fr 1fr 1fr',
        gridTemplateColumns: '1fr 1fr 1fr',
        width: '92%',
      };
    } else if (camCount === 10) {
      return {
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        /* 4 equal columns */
        width: '92%',
      };
    } else {
      // Add more cases as needed
      return {
        gridTemplateRows: '1fr 1fr',
        gridTemplateColumns: '1fr 1fr',
      };
    }
  };

const TimeSecond = styled.text`
    color: #000000;
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

const SunsetPage = () => {
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
      <CamCatGrid camCount={camArray.length}>
        {camArray.map((user, index) => (
            <CamCat key={index} props={user}/>
        ))}
        </CamCatGrid>

      <TempButton url="/${roomId}/night" onClick={() => navigate(`/${roomId}/night`)}/>
    </Background>
  );
};

export default SunsetPage;