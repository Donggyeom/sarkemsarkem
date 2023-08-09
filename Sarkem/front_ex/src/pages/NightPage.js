/* eslint-disable */

import React, { useState, useEffect, useRef } from 'react';
import '../index.css';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundNight';
/* Code generated with AutoHTML Plugin for Figma */
import CamButton from '../components/buttons/CamButton';
import MicButton from '../components/buttons/MicButton';
import SunMoon from '../components/games/SunMoon';
import ScMini from '../components/games/ScMini';
import NightPopup from '../components/games/NightPopup';
import ChatButtonAndPopup from '../components/buttons/ChatButtonAndPopup';
import { useRoomContext } from '../Context';
import { useGameContext } from '../GameContext';
import { useNavigate } from 'react-router-dom';
import DayNightCamera from '../components/camera/DayNightCamera';
import LogButton from '../components/buttons/LogButton';
import Log from '../components/games/Log';


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

const handleScMiniClick = () => {
    // 버튼이 클릭되었을 때 실행되어야 할 작업을 여기에 정의
    console.log('ScMini clicked!');
};

const NightPage = () => {
  const { roomSession, player, setPlayer, players } = useRoomContext(); 
  const { myRole, currentSysMessage, dayCount} = useGameContext();
  const [ mafiaButton, setMafiaButton ] = useState(true);
  const navigate = useNavigate();
  

  const handleCamButtonClick = () => {
    const camOn = !player.isCamOn;
    setPlayer((prevState) => {
      return {...prevState,
        isCamOn: camOn,
      };
    });
    if (player.stream) {
      player.stream.publishVideo(camOn);
    }
  };
  
    const getMyRole = () => {
    if (myRole === 'SARK' || myRole === 'CITIZEN' || myRole === 'DOCTOR' || myRole === 'POLICE' || myRole === 'OBSERVER' || myRole === 'PSYCHO' || myRole === 'BULLY' || myRole === 'DETECTIVE' ) {
      return (
        <>
          <ScMini alt="ScMini" role={myRole} />
        </>
      );
    } else {
      return <ScMini alt="ScMini" role={'CITIZEN'} />
    }
  };
  
  const nightstatus = () =>{
    if(myRole === 'CITIZEN' || myRole === 'DOCTOR' || myRole === 'POLICE' || myRole === 'PSYCHO'|| myRole === 'BULLY' || myRole === 'DETECTIVE'){
      console.log("꺼졌니?")
      publisher.publishVideo(false);
      publisher.publishAudio(false);
      setMafiaButton(false);
    }
  };
  
  
  
  const chatVisible = () =>{
    if (myRole === 'OBSERVER'){
      return (
        <>
          <ChatButtonAndPopup />
        </>
      )
    }
  }
  
  const handleMicButtonClick = () => {
    const micOn = !player.isMicOn;
    setPlayer((prevState) => {
      return {...prevState,
        isMicOn: micOn,
      };
    });
    if (player.stream) {
      player.stream.publishAudio(micOn);
    }
  };
  
  const [isLogOn, setIsLogOn] = useState(true);
  const handleLogButtonClick = () => {
    setIsLogOn((prevIsLogOn) => !prevIsLogOn);
  };
  
  

    useEffect(() => {
        console.log(roomSession.roomId);
        nightstatus();
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

    return (   
    <Background>
      <StyledNightPage>
         {!isLogOn && <Log top="60%" left="26%" />}
        {players && <DayNightCamera ids={Array.from(players.keys())} />}
        <SunMoon alt="SunMoon"></SunMoon>
        <TimeSecond>60s</TimeSecond>
        {/* {mafiaButton && <CamButton alt="Camera Button" onClick={handleCamButtonClick} isCamOn={isCamOn} />} */}
        {<CamButton alt="Camera Button" onClick={handleCamButtonClick} isCamOn={player.isCamOn} />}
        {/* {mafiaButton && <MicButton alt="Mic Button" onClick={handleMicButtonClick} isMicOn={isMicOn}/>} */}
        {<MicButton alt="Mic Button" onClick={handleMicButtonClick} isMicOn={player.isMicOn}/>}
        <LogButton alt="Log Button"onClick={handleLogButtonClick} isLogOn={isLogOn}></LogButton>
          {/* <NightPopup></NightPopup> */}
          {currentSysMessage && <NightPopup sysMessage={currentSysMessage} dayCount={dayCount}/>}
        {getMyRole()}
        <ChatButtonAndPopup />
      </StyledNightPage>
        
    </Background>
  );
};

export default NightPage;
