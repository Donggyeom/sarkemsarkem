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


const CamCatGrid = styled.div`
  display: grid;
  grid-template-rows: ${({ camCount }) => `repeat(${camCount / 2}, 1fr)`};
  gap: 10px;
  justify-items: center;
  align-items: center;
  width: 100%;
  max-height: 80vh;
  overflow: auto;
`;


const StyledDayPage = styled.div`
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

const DayPage = () => {

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


    const handleGamePageClick = () => {
      // Logic to navigate to the GamePage when the user is a host
      // Replace the following line with the actual logic to navigate to the GamePage
      console.log('Navigate to the GamePage');
    };

    // Function to handle the click event when the user wants to invite others
    const handleInviteClick = async () => {
      await navigator.clipboard.writeText("localhost:3000/"+roomId).then(alert("게임 링크가 복사되었습니다."));
      console.log('Invite functionality for hosts');
    };

    // const renderCamCats = () => {
    //   const camCats = [];
    //   for (let i = 0; i < userCount; i++) {
        
    //     camCats.push(<CamCat key={i}/>);
    //   }
    //   return camCats;
    // };

  const CamCatGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 10px;
    justify-items: center;
    align-items: center;
    width: 100%;
    max-height: 80vh; /* Set a maximum height to adjust to the available space */
    overflow: auto; /* Add overflow property to handle overflow if needed */
  `;

  // const LeftSection = styled.div`
  // flex: 4.5;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // max-height: 80vh; /* Set a maximum height to adjust to the available space */
  // overflow: hidden; /* Hide any overflow content if needed */
  // `;

  const calculateCamCatHeight = () => {
    const leftSectionHeight = leftSectionRef.current.offsetHeight;
    const maxCamCatCount = 10; 
    const camCatCount = Math.min(camArray.length, maxCamCatCount);
    return `${leftSectionHeight / camCatCount}px`;
  };

  const leftSectionRef = useRef(null);

    
    return (
    <Background>
        <StyledDayPage>
            <SunMoon alt="SunMoon"></SunMoon>
            <TimeSecond>60s</TimeSecond>
            <CamButton alt="Camera Button" onClick={handleCamButtonClick} />
            <MicButton alt="Mic Button" onClick={handleMicButtonClick} />
            
            <DayPopup></DayPopup>
            <div ref={leftSectionRef}>
              <CamCatGrid camCount={camArray.length}>
                {camArray.map((user, index) => (
                  <CamCat key={index} props={user}/>
                ))}
              </CamCatGrid>
            <ScMini alt="ScMini Button" onClick={handleScMiniClick}></ScMini>
            </div>
            <ChatButtonAndPopup />
        </StyledDayPage>
    </Background>
  );
};

export default DayPage;