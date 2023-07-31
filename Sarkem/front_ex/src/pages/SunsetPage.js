import React, { useState, useEffect, useRef }  from 'react';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundSunset';
import CamButton from '../components/buttons/CamButton';
import MicButton from '../components/buttons/MicButton';
import SunMoon from '../components/games/SunMoon';
import ScMini from '../components/games/ScMini';
import CamCat from '../components/camera/camcat';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRoomContext } from '../Context';
import TempButton from '../components/buttons/TempButton';
import ChatButtonAndPopup from '../components/buttons/ChatButtonAndPopup';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative; /* position을 relative로 설정합니다. */
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const CamCatGrid = styled.div`
  // position : absolute;
  display: grid;
  // align-items: center;
  justify-items: center;
  overflow: hidden;
  ${({ style }) =>
    style && `
    width: ${style.width};
    height : ${style.height};
    max-height: ${style.maxHeight};
    left : ${style.left};
    top : ${style.top};
  `}
`;

const calculateGrid = (camCount) => {

  if (camCount === 1) {
    return {
      width: '100%',
    };
  } else if (camCount === 2) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr 1fr',
      width: '100%',
      left: '2%',
    };
  } else if (camCount === 3) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      left: '2%',
    };
  } else if (camCount === 4) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
    };
  } else if (camCount === 5) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    };
} else if (camCount === 6) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
    };
  } else if (camCount === 7) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
    };
  } else if (camCount === 8) {
    return {
      gridTemplateRows: '1fr 1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
    };
  } else if (camCount === 9) {
    return {
      width: '95%',
      height : '70%',
    };
  } else if (camCount === 10) {
    return {
      left : '5%',
      width: '90%',
      height : '70%',
    };
  } else {
    return {
    };
  }
};
const CamCatWrapper = styled.div`
  ${({ camCount, index }) =>

  camCount === 2 && index === 0
  ? `
    position: relative;
    left : 5%;
  `
  :
  camCount === 2 && index === 1
  ? `
    position: relative;
    right : 5%;
  `
  :

  camCount === 3 && index === 0
  ? `
    position: relative;
    width : 70%;
    top : 22.5%;
  `
  :
  camCount === 3 && index === 1
  ? `
    position: relative;
    width : 150%;
  `
  :
  camCount === 3 && index === 2
  ? `
    position: relative;
    width : 70%;
    top : 22.5%;
  `
  :
  camCount === 4 && index === 0
  ? `
    position: relative;
    width : 70%;
    left : 20%;
  `
  :
  camCount === 4 && index === 1
  ? `
    position: relative;
    width : 70%;
    right : 80%;
    top : 55%;
  `
  :
  camCount === 4 && index === 2
  ? `
    position: relative;
    width : 170%;
    right : 40%;

  `
  :
  camCount === 4 && index === 3
  ? `
    position: relative;
    width : 70%;
    right : 10%;
  `
  :
  camCount === 5 && index === 0
  ? `
    position: relative;
    width : 90%;
    left : 45%;
  `
  :
  camCount === 5 && index === 1
  ? `
    position: relative;
    width : 90%;
    right : 55%;
    top : 50%;
  `
  :
  camCount === 5 && index === 2
  ? `
    position: relative;
    width : 250%;
    left : center;
  `
  :
  camCount === 5 && index === 3
  ? `
    position: relative;
    width : 90%;
    left : 45%;
  `
  :
  camCount === 5 && index === 4
  ? `
    position: relative;
    width : 90%;
    right : 55%;
    top : 50%;
  `
  :
  camCount === 6 && index === 0
  ? `
    position: relative;
    left : 75%;
  `
  :
  camCount === 6 && index === 1
  ? `
    position: relative;
    right : 25%;
    top : 55%;
  `
  :
  camCount === 6 && index === 2
  ? `
    position: relative;
    width : 300%;
    left : 55%;
  `
  :
  camCount === 6 && index === 3
  ? `
    position: relative;
    left : 125%;
    top : 55%;
  `
  :
  camCount === 6 && index === 4
  ? `
    position: relative;
    left : 25%;
  `
  :
  camCount === 6 && index === 5
  ? `
    position: relative;
    top : 25%;
  `
  :
  camCount === 7 && index === 0
  ? `
    position: relative;
    left : 100%;

  `
  :
  camCount === 7 && index === 1
  ? `
    position: relative;
    top : 30%;
    right : 100%;

  `
  :
  camCount === 7 && index === 2
  ? `
    position: relative;
    right : 100%;
    top : 60%;

  `
  :
  camCount === 7 && index === 3
  ? `
    position: relative;
    width : 300%;
    left : 5%;
  `
  :
  camCount === 7 && index === 4
  ? `
    position: relative;
    left : 100%;

  `
  :
  camCount === 7 && index === 5
  ? `
    position: relative;
    left : 100%;
    top : 30%;

  `
  :
  camCount === 7 && index === 6
  ? `
    position: relative;
    right : 100%;
    top : 60%;
  `
  :
  camCount === 8 && index === 0
  ? `
    position: relative;
    width : 40%;
    right : 30%;

  `
  :
  camCount === 8 && index === 1
  ? `
    position: relative;
    width : 40%;
    left : 27.5%;

  `
  :
  camCount === 8 && index === 2
  ? `
    position: relative;
    width : 40%;
    right : 10%;

  `
  :
  camCount === 8 && index === 3
  ? `
    position: relative;
    width : 40%;
    left : 50%;

  `
  :
  camCount === 8 && index === 4
  ? `
    position: relative;
    width : 110%;
    bottom : 60%;
    left : 50%;

  `
  :
  camCount === 8 && index === 5
  ? `
    position: relative;
    width : 40%;
    left : 30%;
    bottom : 3%;

  `
  :
  camCount === 8 && index === 6
  ? `
    position: relative;
    width : 40%;
    bottom : 220%;
    right : 50%;

  `
  :
  camCount === 8 && index === 7
  ? `
    position: relative;
    width : 40%;
    bottom : 200%;

  `
  :
  camCount === 9 && index === 0
  ? `
    position: relative;

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

  const TimeSecond = styled.text`
  color: #FFFFFF;
  text-align: left;
  font: 400 42px "ONE Mobile POP", sans-serif;
  position: absolute; /* position을 absolute로 설정합니다. */
  left: 22px; /* 원하는 위치 값을 지정합니다. */
  top: 90px; /* 원하는 위치 값을 지정합니다. */
`;

const handleScMiniClick = () => {
  console.log('ScMini clicked!');
};

const SunsetPage = () => {
   
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

  const camCount = camArray.length; // camCount를 SunsetPage 내부에서 계산
  const gridStyles = calculateGrid(camCount);

  return (
    <Background>
      <StyledContent>
      <SunMoon alt="SunMoon"></SunMoon>
      <TimeSecond>60s</TimeSecond>
      <CamButton alt="Camera Button" onClick={handleCamButtonClick} isCamOn={isCamOn} />
      <MicButton alt="Mic Button" onClick={handleMicButtonClick} isMicOn={isMicOn}/>
        
        <CamCatGrid style={gridStyles}>
            {camArray.slice().reverse().map((user, index) => ( // Using slice() to create a copy and then reversing it
              <CamCatWrapper key={index} camCount={camCount} index={index}>
                <CamCat props={camArray[index]} />
              </CamCatWrapper>
            ))}
          </CamCatGrid>
          <ScMini alt="ScMini Button" onClick={handleScMiniClick}></ScMini>
      </StyledContent>
      <ChatButtonAndPopup />
      {/* </CamCatGridContainer> */}

      <TempButton url="/${roomId}/night" onClick={() => navigate(`/${roomId}/night`)}/>
      </Background>
  );
};

export default SunsetPage;
