import React, { useState, useEffect } from 'react';
import '../index.css';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundDay';

import CamButton from '../components/buttons/CamButton';
import MicButton from '../components/buttons/MicButton';
import SunMoon from '../components/games/SunMoon';
import ScMini from '../components/games/ScMini';
import DayPopup from '../components/games/DayPopup';

import CamCat from '../components/camera/camcat';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
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
  font: 400 42px "RixInooAriDuriR", sans-serif;
  position: absolute;
  left: 22px;
  top: 90px;
`;

const DayPage = () => {

  const { roomSession, player, setPlayer, players, roomId, camArray, leaveSession } = useRoomContext();
  const { gameSession, myRole, threatedTarget, currentSysMessage, dayCount } = useGameContext();
  const [ meetingTime, setMeetingTime ] = useState(gameSession?.gameOption?.meetingTime);
  const navigate = useNavigate();
  const [voteCount, setVoteCount] = useState(0);
  const [isLogOn, setIsLogOn] = useState(true);
  const handleLogButtonClick = () => {
    setIsLogOn((prevIsLogOn) => !prevIsLogOn);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (meetingTime > 0) {
        setMeetingTime((prevTime) => prevTime - 1);
      } else {
        clearInterval(timer);
      }
    }, 1000); // 1초마다 실행
    daystatus();
    return () => {
      clearInterval(timer);
    };
  }, [meetingTime, roomId]);

  const daystatus = () => {
    if(myRole === 'CITIZEN' || myRole === 'DOCTOR' || myRole === 'POLICE' || myRole === 'PSYCHO'|| myRole === 'BULLY'){
      player.stream.publishVideo(true);
      player.stream.publishAudio(true);
    }
  };

  const handleCamButtonClick = () => {
    const camOn = !player.isCamOn;
    setPlayer((prev) => {
      return ({
        ...prev,
        isCamon: camOn
      });
    });
    if (player.stream) {
      player.stream.publishVideo(camOn);
    }
  };

  const handleMicButtonClick = () => {
    const micOn = !player.isMicOn;
    setPlayer((prev) => {
      return ({
        ...prev,
        isMicOn: micOn
      });
    });
    if (player.stream) {
      player.stream.publishAudio(micOn);
    // 버튼 클릭 이벤트를 threatedTarget이 못하게
    console.log('냥아치 협박 대상인가?');
    if (player.stream !== threatedTarget) {
      player.stream.publishAudio(micOn);
      console.log('냥아치 협박 대상 아님! 마이크 버튼 클릭!');
    }
  };
}
  const handleScMiniClick = () => {
    console.log('ScMini clicked!');
  };

  const getMyRole = (dayCount) => {
    if (myRole === 'SARK' || myRole === 'CITIZEN' || myRole === 'DOCTOR' || myRole === 'POLICE' || myRole === 'OBSERVER' || myRole === 'PSYCHO' || myRole === 'BULLY' || myRole === 'DETECTIVE') {
      return (
        <>
          <ScMini alt="ScMini" role={myRole} dayCount={dayCount}/>
        </>
      );
    }
  };

  const chatVisible = () =>{
    if (myRole === 'OBSERVER' || myRole === 'CITIZEN'){
      return (
        <>
          <ChatButtonAndPopup roomId={roomId}/>;
        </>
      );
    }
  };

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

  

  // const sysMessage = systemMessages.find((message) => message.code === 'NOTICE_MESSAGE'); // sysMessage 변수 추가
  // console.log(currentSysMessage);
  return (
    <Background>
      <StyledDayPage>
        {!isLogOn && <Log top="60%" left="26%" />}
        <SunMoon alt="SunMoon" />
        <TimeSecond>{meetingTime}s</TimeSecond>
        <CamButton alt="Camera Button" onClick={handleCamButtonClick} isCamOn={player.isCamOn} />
        <MicButton alt="Mic Button" onClick={handleMicButtonClick} isMicOn={player.isMicOn}/>
        <LogButton alt="Log Button"onClick={handleLogButtonClick} isLogOn={isLogOn}></LogButton>
        {currentSysMessage && <DayPopup sysMessage={currentSysMessage}  dayCount={dayCount}/>} {/* sysMessage를 DayPopup 컴포넌트에 prop으로 전달 */}
          <DayNightCamera camArray={camArray}/>
          {getMyRole()}
        </StyledDayPage>
        <TempButton url="/${roomId}/sunset" onClick={() => navigate(`/${roomId}/sunset`)} alt="Start Game" />
          {chatVisible()}
    </Background>
  );
};

export default DayPage;
