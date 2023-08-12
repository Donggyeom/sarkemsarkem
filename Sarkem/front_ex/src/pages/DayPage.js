import React, { useState, useEffect } from 'react';
import '../index.css';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundDay';

import CamButton from '../components/buttons/CamButton';
import MicButton from '../components/buttons/MicButton';
import SunMoon from '../components/games/SunMoon';
import ScMini from '../components/games/ScMini';
import DayPopup from '../components/games/DayPopup';
import SarkMission from '../components/job/SarkMission';
import PsychologistBox from '../components/job/PsychologistBox';

import { useNavigate, useLocation } from 'react-router-dom';
import { useRoomContext } from '../Context';
import { useGameContext } from '../GameContext';
import DayNightCamera from '../components/camera/DayNightCamera';

// log
import LogButton from '../components/buttons/LogButton';
import Log from '../components/games/Log';

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
  font: 400 42px "RixInooAriDuriR", sans-serif;
  position: absolute;
  left: 22px;
  top: 90px;
`;

const DayPage = () => {

  const { roomSession, player, setPlayer, players, leaveSession } = useRoomContext();
  const { gameSession, Roles, threatedTarget, currentSysMessage, dayCount, 
    chatVisible, systemMessages, voteSituation, remainTime, scMiniPopUp, getAlivePlayers } = useGameContext();
  const [ meetingTime, setMeetingTime ] = useState(gameSession?.gameOption?.meetingTime);
  const navigate = useNavigate();
  const [voteCount, setVoteCount] = useState(0);
  const [isLogOn, setIsLogOn] = useState(true);
  const [currentHandNumber, setCurrentHandNumber] = useState(1); //삵 미션!


  const handleLogButtonClick = () => {
    setIsLogOn((prevIsLogOn) => !prevIsLogOn);
  };

  
  useEffect((currentSysMessage) => {
    if (roomSession.roomId === undefined){
      console.log("세션 정보가 없습니다.")
      navigate("/");
      return;
    }
    
    if(player.current.isCamOn){
      daystatus();
    }
    threated();
    
    // 윈도우 객체에 화면 종료 이벤트 추가
    window.addEventListener('beforeunload', onbeforeunload);
    return () => {
        window.removeEventListener('beforeunload', onbeforeunload);
    }
  }, [currentSysMessage]);


  const threated = () =>{
    console.log(threatedTarget);
    if(threatedTarget){
      player.current.stream.publishAudio(false);
      // player.current.stream.publishVideo(false);
    }

  }

  const handleCamButtonClick = () => {
    const camOn = !player.current.isCamOn;
    if (player.current.stream) {
      player.current.stream.publishVideo(camOn);
    }
    // setPlayer((prev) => {
    //   return ({
    //     ...prev,
    //     isCamOn: camOn
    //   });
    // });
    setPlayer([{key: 'isCamOn', value: camOn}]);
  };

  const handleMicButtonClick = () => {
    const micOn = !player.current.isMicOn;
    if (player.current.stream) {
      player.current.stream.publishAudio(micOn);
      // 버튼 클릭 이벤트를 threatedTarget이 못하게
      console.log('냥아치 협박 대상인가?');
      if (player.current.stream !== threatedTarget) {
        player.current.stream.publishAudio(micOn);
        console.log('냥아치 협박 대상 아님! 마이크 버튼 클릭!');
      }
      // setPlayer((prev) => {
      //   return ({
      //     ...prev,
      //     isMicOn: micOn
      //   });
      // });
      setPlayer([{key: 'isMicOn', value: micOn}]);
    };
  }

  // const handleScMiniClick = () => {
  //   console.log('ScMini clicked!');
  // };

  // 화면을 새로고침 하거나 종료할 때 발생하는 이벤트
  const onbeforeunload = (event) => {
    leaveSession();
  }
  
  const daystatus = () =>{
    if(player.current.role !== 'OBSERVER') {
      player.current.stream.publishVideo(true);
      player.current.stream.publishAudio(true);
    }
  };

  return (
    <Background>
      <StyledDayPage>
        {!isLogOn && <Log />}
        <SunMoon alt="SunMoon" />
        <TimeSecond>{remainTime}s</TimeSecond>
        <CamButton alt="Camera Button" onClick={handleCamButtonClick} isCamOn={player.current.isCamOn} />
        <MicButton alt="Mic Button" onClick={handleMicButtonClick} isMicOn={player.current.isMicOn}/>
        <LogButton alt="Log Button" onClick={handleLogButtonClick} isLogOn={isLogOn} />
        {currentSysMessage && <DayPopup sysMessage={currentSysMessage}  dayCount={dayCount}/>} {/* sysMessage를 DayPopup 컴포넌트에 prop으로 전달 */}
        {players.current && <DayNightCamera players={getAlivePlayers()} />}
        <ScMini />
        <SarkMission handNumber={currentHandNumber} />
        <PsychologistBox></PsychologistBox>
        </StyledDayPage>
        <TempButton url={`/${roomSession.roomId}/sunset`} onClick={() => navigate(`/${roomSession.roomId}/sunset`)} alt="Start Game" />
        {chatVisible()}
      </Background>
      );
  };

export default DayPage;
