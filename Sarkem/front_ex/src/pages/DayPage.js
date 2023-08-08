import React, { useState, useEffect } from 'react';
import '../index.css';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundDay';

import CamButton from '../components/buttons/CamButton';
import MicButton from '../components/buttons/MicButton';
import SunMoon from '../components/games/SunMoon';
import ScMini from '../components/games/ScMini';
import DayPopup from '../components/games/DayPopup';

import { useNavigate } from 'react-router-dom';
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
  const { roomId, publisher, camArray, leaveSession, isCamOn, setIsCamOn, isMicOn, setIsMicOn, } = useRoomContext();
  const { myRole, peopleCount, systemMessages, threatedTarget, voteSituation, dayCount, currentSysMessage  } = useGameContext();
  const [meetingTime, setMeetingTime] = useState(peopleCount.meetingTime);

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
  }, [meetingTime, roomId]);
  
  useEffect(() => {
    daystatus();
  },[])
  const navigate = useNavigate();
  const [voteCount, setVoteCount] = useState(0);


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
    // 버튼 클릭 이벤트를 threatedTarget이 못하게
    console.log('냥아치 협박 대상인가?');
    if (publisher !== threatedTarget) {
      publisher.publishAudio(micOn);
      console.log('냥아치 협박 대상 아님! 마이크 버튼 클릭!');
    }
  };
  
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
    console.log(roomId);
    if (roomId === '') {
      console.log("세션 정보가 없습니다.");
      navigate("/");
      return;
    }
    window.addEventListener("popstate", () => leaveSession);
    window.addEventListener('beforeunload', onbeforeunload);
  }, []);

  const [isLogOn, setIsLogOn] = useState(true);
  const handleLogButtonClick = () => {
    setIsLogOn((prevIsLogOn) => !prevIsLogOn);
  };

  const daystatus = () =>{
    if(myRole === 'CITIZEN' || myRole === 'DOCTOR' || myRole === 'POLICE' || myRole === 'PSYCHO'|| myRole === 'BULLY'|| myRole === 'DETECTIVE'){
      publisher.publishVideo(true);
      publisher.publishAudio(true);
    }
  };

  // const sysMessage = systemMessages.find((message) => message.code === 'NOTICE_MESSAGE'); // sysMessage 변수 추가
  // console.log(currentSysMessage);
  return (
    <Background>
      <StyledDayPage>
        {!isLogOn && <Log top="60%" left="26%" />}
        <SunMoon alt="SunMoon" />
        <TimeSecond>{meetingTime}s</TimeSecond>
        <CamButton alt="Camera Button" onClick={handleCamButtonClick} isCamOn={isCamOn} />
        <MicButton alt="Mic Button" onClick={handleMicButtonClick} isMicOn={isMicOn} />
        <LogButton alt="Log Button" onClick={handleLogButtonClick} isLogOn={isLogOn} />
        {currentSysMessage && <DayPopup sysMessage={currentSysMessage}  dayCount={dayCount}/>} {/* sysMessage를 DayPopup 컴포넌트에 prop으로 전달 */}
        <DayNightCamera camArray={camArray} />
        {getMyRole(dayCount)}
      </StyledDayPage>
      <TempButton url={`/${roomId}/sunset`} onClick={() => navigate(`/${roomId}/sunset`)} alt="Start Game" />
      {chatVisible()}
    </Background>
  );
};

export default DayPage;
