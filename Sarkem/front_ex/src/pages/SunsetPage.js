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

const StyledContent = styled.div`
  display : flex;
  height : 100%;
  width : 100%;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  position: relative;
`

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
   if (camCount === 1) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr',
      positions: [{ row: 1, col: 1 }],
      height : '100%',
      width: '100%',
    };
  } else if (camCount === 2) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr 1fr',
      positions: [
        { row: 1, col: 1 },
        { row: 1, col: 2 },
      ],
      width: '100%',
      height : '100%'
    };
  } else if (camCount === 3) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr 2.8fr 1fr',
      positions: [
        { row: 1, col: 1 },
        { row: 2, col: 1 },
        { row: 2, col: 2 },
      ],
      left : '5%',
      height : '100%',
      width: '90%',
    };
  } else if (camCount === 4) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 2.5fr 1fr',
      positions:
      [
        { row: 1, col: 1 },
        { row: 1, col: 3 },
        { row: 2, col: 1 },
        { row: 2, col: 3 },
      ],
      width : '100%',
      height : '100%',
    };
  } else if (camCount === 5) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 2.5fr 1fr',
      positions:
      [
        { row: 1, col: 1 },
        { row: 1, col: 2 },
        { row: 1, col: 3 },
        { row: 2, col: 1 },
        { row: 2, col: 3 },
      ],
      width : '100%',
      height : '100%',
    };
  } else if (camCount === 6) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 3fr 1fr',
      positions:
      [
        { row: 1, col: 1 },
        { row: 1, col: 2 },
        { row: 1, col: 3 },
        { row: 2, col: 1 },
        { row: 2, col: 3 },
        { row: 3, col: 1 },
      ],
      width : '100%',
      height : '100%',
    };
  } else if (camCount === 7) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      positions:
      [
        { row: 1, col: 1 },
        { row: 1, col: 2 },
        { row: 1, col: 3 },
        { row: 2, col: 1 },
        { row: 2, col: 3 },
        { row: 3, col: 1 },
        { row: 3, col: 3 }, 
      ],
      width : '100%',
      height : '100%',
    };
  } else if (camCount === 8) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      positions: positions.slice(0, camCount),
      width: '92%',
    };
  } else if (camCount === 9) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      positions: positions.slice(0, camCount),
      width: '92%',
    };
  } else if (camCount === 10) {
    return {
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      positions: positions.slice(0, camCount),
      width: '92%',
    };
  } else {
    // Add more cases as needed
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      positions: positions.slice(0, camCount),
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
  camCount === 4 && index === 1
  ? `
    position: relative;
    top: 35%;
    left : 1%;
  `
  :
  camCount === 4 && index === 2
  ? `
    position: relative;
    right : 45%;
  `
  
  : camCount === 4 && index === 3
  ? `
    position: relative;
    top: -25%; 
    left: 45%;
  `
  : camCount === 5 && index === 0
  ? `
    position: relative;
    left: 25%;
  `
  : camCount === 5 && index === 1
  ? `
    position : relative;
    top : 30%;
  `
  : camCount === 5 && index === 2
  ? `
    position : relative;
    right : 32.5%;

  `
  : camCount === 5 && index === 3
  ? `
    position: relative;
    left: 25%;
    bottom : 25%;
  `
  : camCount === 5 && index === 4
  ? `
    position: relative;
    width : 40%;
    left: 57%;
    bottom : 25%;
  `
  : camCount === 6 && index === 0
  ? `
    position: relative;
    left: 55%;
    bottom : 25%;
    width : 90%;
  `
  : camCount === 6 && index === 1
  ? `
    position: relative;
    top : 35%;
    left : 3%;
  `
  : camCount === 6 && index === 2
  ? `
    position: relative;
    right : 35%;
    width : 90%;
  `
  : camCount === 6 && index === 3
  ? `
    position: relative;
    left: 25%;
    bottom : 103%;
    width : 90%;
  `
  : camCount === 6 && index === 4
  ? `
    position: relative;
    width : 30%;
    top : 6%;
    right : 50%;
  `
  : camCount === 6 && index === 5
  ? `
    position: relative;
    right : 35%;
    bottom : 15%;
    width : 90%;
  `
  : camCount === 7 && index === 0
  ? `
    position: relative;
  `
  : camCount === 7 && index === 1
  ? `
    position: relative;
  `
  : camCount === 7 && index === 2
  ? `
    position: relative;
  `
  : camCount === 7 && index === 3
  ? `
    position: relative;
  `
  : camCount === 7 && index === 4
  ? `
    position: relative;
  `
  : camCount === 7 && index === 5
  ? `
    position: relative;
  `
  : camCount === 7 && index === 6
  ? `
    position: relative;
  `
  : ''};
`;

  const TimeSecond = styled.text`
  /* 스타일 내용 동일 */
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
      <TimeSecond>60s</TimeSecond>
      <CamButton alt="Camera Button" onClick={handleCamButtonClick} isCamOn={isCamOn} />
      <MicButton alt="Mic Button" onClick={handleMicButtonClick} isMicOn={isMicOn}/>
      <ScMini alt="ScMini Button" onClick={handleScMiniClick}></ScMini>
        <SunMoon alt="SunMoon"></SunMoon>
        
        <CamCatGrid style={gridStyles}>
          {gridStyles.positions.map(({ row, col }, index) => (
            <CamCatWrapper key={index} camCount={camCount} index={index}>
              <CamCat props={camArray[index]} style={{ gridRow: row, gridColumn: col }} />
            </CamCatWrapper>
          ))}
        </CamCatGrid>
      </StyledContent>
      {/* </CamCatGridContainer> */}

      <TempButton url="/${roomId}/night" onClick={() => navigate(`/${roomId}/night`)}/>
      </Background>
  );
};

export default SunsetPage;
