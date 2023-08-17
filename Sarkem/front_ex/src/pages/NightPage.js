/* eslint-disable */

import React, { useState, useEffect } from 'react';
import '../index.css';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundNight';
/* Code generated with AutoHTML Plugin for Figma */
import CamButton from '../components/buttons/CamButton';
import NoCamButton from '../components/buttons/NoCamButton';
import MicButton from '../components/buttons/MicButton';
import NoMicButton from '../components/buttons/NoMicButton';
import SunMoon from '../components/games/SunMoon';
import ScMini from '../components/games/ScMini';
import NightPopup from '../components/games/NightPopup';
import { useRoomContext } from '../Context';
import { useGameContext } from '../GameContext';
import { useNavigate } from 'react-router-dom';
import DayNightCamera from '../components/camera/DayNightCamera';
import LogButton from '../components/buttons/LogButton';
import Log from '../components/games/Log';
import Sound from '../sound/nightstart.mp3';

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
    font: 400 42px "RixInooAriDuriR", sans-serif;
    position: absolute; /* position을 absolute로 설정합니다. */
    left: 22px; /* 원하는 위치 값을 지정합니다. */
    top: 90px; /* 원하는 위치 값을 지정합니다. */
`;


const NightPage = () => {
  const { roomSession, player, setPlayer, players } = useRoomContext(); 
  const { currentSysMessage, dayCount, chatVisible, remainTime, getAlivePlayers, onbeforeunload } = useGameContext();
  const navigate = useNavigate();
  const audio = new Audio(Sound);
  

  useEffect(() => {
    
    if (roomSession == undefined || roomSession.current.roomId == undefined){
      console.log("세션 정보가 없습니다.")
      navigate("/");
      return;
    }

    window.addEventListener("mousemove", playBGM);
    remainTime.current = 30;
    turnOffCams();
    

    // 윈도우 객체에 화면 종료 이벤트 추가
    window.addEventListener('beforeunload', onbeforeunload);
    window.history.pushState(null, "", location.href);
    window.addEventListener("popstate", onbeforeunload);
    return () => {
      window.removeEventListener('beforeunload', onbeforeunload);
      window.removeEventListener('popstate', onbeforeunload);
    }
  }, []);

  const playBGM = () => {
  
    // Play the audio when the component mounts
    audio.play();
    audio.playbackRate = 0.9;
    audio.volume = 0.7;
  
    // Update state to track audio playback
    window.removeEventListener("mousemove", playBGM);
    return () => {
      console.log('멈춰');
      audio.pause();
      audio.currentTime = 0;
    };
  }


  const handleCamButtonClick = () => {
    const camOn = !player.current.isCamOn;
    setPlayer([{key: 'isCamOn', value: camOn}]);
    if (player.current.stream) {
      player.current.stream.publishVideo(camOn);
    }
  };
  
  const handleMicButtonClick = () => {
    const micOn = !player.current.isMicOn;
    setPlayer([{key: 'isMicOn', value: micOn}]);
    if (player.current.stream) {
      player.current.stream.publishAudio(micOn);
    }
  };

  const turnOffCams = () =>{
    if (player.current.role === 'SARK' || player.current.role === 'OBSERVER') return;
    player.current.stream.publishVideo(false);
    player.current.stream.publishAudio(false);
  };
  
  const [isLogOn, setIsLogOn] = useState(true);
  const handleLogButtonClick = () => {
    setIsLogOn((prevIsLogOn) => !prevIsLogOn);
  };
  

    return (   
    <Background>
      <StyledNightPage>
        {!isLogOn && <Log />}
        {players.current && <DayNightCamera players={getAlivePlayers()} />}
        <SunMoon alt="SunMoon"></SunMoon>
        <TimeSecond>{remainTime.current}s</TimeSecond>
        {player.current.role === 'SARK' ? (
          <CamButton alt="Camera Button" onClick={handleCamButtonClick} isCamOn={player.current.isCamOn} />
        ) : (
          <NoCamButton alt="Cam Button" />
        )}
        {player.current.role === 'SARK' ? (
          <MicButton alt="Mic Button" onClick={handleMicButtonClick} isMicOn={player.current.isMicOn}/>
        ) : (
          <NoMicButton alt="Mic Button" />
        )}
        <LogButton alt="Log Button"onClick={handleLogButtonClick} isLogOn={isLogOn}></LogButton>
          {currentSysMessage && <NightPopup sysMessage={currentSysMessage} dayCount={dayCount}/>}
        <ScMini />
        {chatVisible()}
      </StyledNightPage>
    </Background>
  );
};

export default NightPage;
