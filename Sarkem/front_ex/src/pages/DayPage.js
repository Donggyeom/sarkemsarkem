/* eslint-disable */

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundDay';

import CamButton from '../components/buttons/CamButton';
import MicButton from '../components/buttons/MicButton';
import SunMoon from '../components/games/SunMoon';
import ScMini from '../components/games/ScMini';
import DayPopup from '../components/games/DayPopup';

import { useNavigate, useLocation } from 'react-router-dom';
import { useRoomContext } from '../Context';
import { useGameContext } from '../GameContext';
import ChatButtonAndPopup from '../components/buttons/ChatButtonAndPopup';
import TempButton from '../components/buttons/TempButton';
import DayNightCamera from '../components/camera/DayNightCamera';

// log
import LogButton from '../components/buttons/LogButton';
import Log from '../components/games/Log';


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

  const { roomSession, player, players, leaveSession } = useRoomContext();
  const { gameSession, myRole } = useGameContext();
  const [ meetingTime, setMeetingTime ] = useState(gameSession?.gameOption?.meetingTime);
  
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      if (meetingTime > 0) {
        setMeetingTime((prevTime) => prevTime - 1);
      } else {
        clearInterval(timer);
      }
    }, 1000); // 1초마다 실행

    return () => {
      clearInterval(timer);
    };
  }, [meetingTime]);


  const handleVoteClick = () => {
    setVoteCount((prevCount) => prevCount + 1);
  };

  const handleCamButtonClick = () => {
    const camOn = !player.isCamOn;
    setIsCamOn(camOn);
    if (player.stream) {
      player.stream.publishVideo(camOn);
    }
  };
  
  
  const handleMicButtonClick = () => {
    const micOn = !player.isMicOn;
    setIsMicOn(micOn);
    if (player.stream) {
      player.stream.publishAudio(micOn);
    }
  };
  
  
  const handleScMiniClick = () => {
      // 버튼이 클릭되었을 때 실행되어야 할 작업을 여기에 정의
      console.log('ScMini clicked!');
  };

  const getMyRole = () => {
    if (myRole === 'SARK' || myRole === 'CITIZEN' || myRole === 'DOCTOR' || myRole === 'POLICE' || myRole === 'OBSERVER' || myRole === 'PSYCHO' || myRole === 'BULLY' || myRole === 'DETECTIVE' ) {
      return (
        <>
          <ScMini alt="ScMini" role={myRole} />
        </>
      );
      }
  };

  const chatVisible = () =>{
    if (myRole === 'OBSERVER' || myRole === 'SARK'){
      return (
        <>
          <ChatButtonAndPopup />
        </>
      )
    }
  }


  useEffect(() => {
    if (roomSession.roomId === undefined){
      console.log("세션 정보가 없습니다.")
      navigate("/");
      return;
    }
    // 윈도우 객체에 화면 종료 이벤트 추가
    window.addEventListener('beforeunload', onbeforeunload);
    return () => {
        window.removeEventListener('beforeunload', onbeforeunload);
    }
  }, [])
  // 화면을 새로고침 하거나 종료할 때 발생하는 이벤트
  const onbeforeunload = (event) => {
    leaveSession();
  }

  const [isLogOn, setIsLogOn] = useState(true);
  const handleLogButtonClick = () => {
    setIsLogOn((prevIsLogOn) => !prevIsLogOn);
  };
   
    return (
    <Background>
      <StyledDayPage>
        {!isLogOn && <Log top="60%" left="26%" />}
        <SunMoon alt="SunMoon"></SunMoon>
        <TimeSecond>{meetingTime}s</TimeSecond>
        <CamButton alt="Camera Button" onClick={handleCamButtonClick} isCamOn={player.isCamOn} />
        <MicButton alt="Mic Button" onClick={handleMicButtonClick} isMicOn={player.isMicOn}/>
        <LogButton alt="Log Button"onClick={handleLogButtonClick} isLogOn={isLogOn}></LogButton>
          <DayPopup></DayPopup>
          <DayNightCamera players={players} />
          {getMyRole()}
        </StyledDayPage>

          {chatVisible()}
    </Background>
  );
};

export default DayPage;