import React, { useState, useEffect }  from 'react';
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
import { useGameContext } from '../GameContext';
import LogButton from '../components/buttons/LogButton';
import Log from '../components/games/Log';
import SunsetPopup from '../components/games/SunsetPopup';
import { AgreeButton, DisagreeButton } from '../components/buttons/agreeDisagreeButtons.js';
import loadingimage from '../img/loading1.jpg';



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
  display: grid;
  justify-items: center;
  margin-bottom : 2%;
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
      width: '100%',
      left: '4%',
      marginTop : '5%',
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
      width : '100%',
    };
  } else if (camCount === 9) {
    return {
      gridTemplateRows: '1fr 1fr 1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      width : '100%',
    };
  } else if (camCount === 10) {
    return {
      gridTemplateRows: '1fr 1fr 1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      width : '100%',
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
    // top : 22.5%;
  `
  :
  camCount === 3 && index === 1
  ? `
    position: relative;
    width : 150%;
    margin-left : 7.5%; 
  `
  :
  camCount === 3 && index === 2
  ? `
    position: relative;
    width : 70%;
    // top : 22.5%;
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
    top : 25%;
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
    left : 55%;
  `
  :
  camCount === 6 && index === 1
  ? `
    position: relative;
    right : 45%;
    top : 55%;
  `
  :
  camCount === 6 && index === 2
  ? `
    position: relative;
    width : 300%;
    left : 45%;
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
    width : 30%;
    top : 40%;
    right : 15%;

  `
  :
  camCount === 8 && index === 1
  ? `
    position: relative;
    width : 30%;
    left : 30%;

  `
  :
  camCount === 8 && index === 2
  ? `
    position: relative;
    width : 30%;
    top : 60%;
    right : 6%;

  `
  :
  camCount === 8 && index === 3
  ? `
    position: relative;
    width : 30%;
    left : 2%;

  `
  :
  camCount === 8 && index === 4
  ? `
    position: relative;
    width : 30%;
    top : 85%;
    right : 15%;

  `
  :
  camCount === 8 && index === 5
  ? `
    position: relative;
    width : 30%;
    left : 2%;

  `
  :
  camCount === 8 && index === 6
  ? `
    position: relative;
    width : 100%;
    left : 50%;
    bottom : 85%;

  `
  :
  camCount === 8 && index === 7
  ? `
    position: relative;
    width : 30%;
    left : 30%;

  `
  :
  camCount === 9 && index === 0
  ? `
    position: relative;
    top : 5.5%;
    right : 20%;
    width : 27.5%;
  `
  :
  camCount === 9 && index === 1
  ? `
    position: relative;
    width : 27.5%;
    left : 15%;
    top : 5.5%;
  `
  :
  camCount === 9 && index === 2
  ? `
    position: relative;
    width : 27.5%;
    top : 5.5%;
    right : 5%;

  `
  :
  camCount === 9 && index === 2
  ? `
    position: relative;
    width : 27.5%;
    top : 5.5%;
  `
  :
  camCount === 9 && index === 3
  ? `
    position: relative;
    width : 27.5%;
    top : 5.5%;
  `
  :
  camCount === 9 && index === 4
  ? `
    position: relative;
    width : 27.5%;
    top : 5.5%;
    right : 5%;
  `
  :
  camCount === 9 && index === 5
  ? `
    position: relative;
    width : 27.5%;
    top : 5.5%;
  `
  :
  camCount === 9 && index === 6
  ? `
    position: relative;
    width : 27.5%;
    top : 5.5%;
    right : 15%;
    right : 20%;
  `
  :
  camCount === 9 && index === 7
  ? `
    position: relative;
    width : 27.5%;
    top : 5.5%;
    left : 15%;
  `
  :
  camCount === 9 && index === 8
  ? `
    position: relative;
    width : 80%;
    left : 50%;
    bottom : 125%;
  `
  :
  camCount === 10 && index === 0
  ? `
    position: relative;
    width : 25%;
    right : 30%;
  `
  :
  camCount === 10 && index === 1
  ? `
    position: relative;
    width : 25%;
    left : 25%;
  `
  :
  camCount === 10 && index === 2
  ? `
    position: relative;
    width : 25%;
  `
  :
  camCount === 10 && index === 3
  ? `
    position: relative;
    width : 25%;
  `
  :
  camCount === 10 && index === 4
  ? `
    position: relative;
    width : 25%;
  `
  :
  camCount === 10 && index === 5
  ? `
    position: relative;
    width : 25%;
    left : 25%;
  `
  :
  camCount === 10 && index === 6
  ? `
    position: relative;
    width : 25%;
    right : 30%;
  `
  :
  camCount === 10 && index === 7
  ? `
    position: relative;
    width : 25%;
  `
  :
  camCount === 10 && index === 8
  ? `
    position: relative;
    width : 80%;
    left : 50%;
    bottom : 100%;
  `
  :
  camCount === 10 && index === 9
  ? `
    position: relative;
    width : 25%;
    left : 25%;
  `
  : ''};
  `;

  const TimeSecond = styled.text`
  color: #FFFFFF;
  text-align: left;
  font: 400 42px "RixInooAriDuriR", sans-serif;
  position: absolute; /* position을 absolute로 설정합니다. */
  left: 22px; /* 원하는 위치 값을 지정합니다. */
  top: 90px; /* 원하는 위치 값을 지정합니다. */
`;

const SunsetPage = () => {

  
   
  const { roomId, publisher, camArray, isCamOn, setIsCamOn, isMicOn, setIsMicOn} = useRoomContext(); 
  
  const { myRole, startVote, agreeExpulsion, disagreeExpulsion, targetId,dayCount, remainTime } = useGameContext();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(targetId, "확인합시다");
  const [targetIndex, setTargetIndex] = useState(null);
  const assignedIndices = [];


  let displayCamCat = false;


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

  const chatVisible = () =>{
  if (myRole === 'OBSERVER'){
    return (
      <>
        <ChatButtonAndPopup />
      </>
    )
  }
}

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

  const [isLogOn, setIsLogOn] = useState(true);
  const handleLogButtonClick = () => {
    setIsLogOn((prevIsLogOn) => !prevIsLogOn);
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
  const generateRandomPositionIndex = (maxIndex) => {
    return Math.floor(Math.random() * maxIndex);
  };



  return (
    <Background>
      <StyledContent>
      {!isLogOn && <Log />}
      <SunMoon alt="SunMoon"></SunMoon>
      <TimeSecond>{remainTime}s</TimeSecond>
      <CamButton alt="Camera Button" onClick={handleCamButtonClick} isCamOn={isCamOn} />
      <MicButton alt="Mic Button" onClick={handleMicButtonClick} isMicOn={isMicOn}/>
      <LogButton alt="Log Button"onClick={handleLogButtonClick} isLogOn={isLogOn}></LogButton>
      <SunsetPopup dayCount={dayCount}></SunsetPopup>

      <CamCatGrid style={gridStyles}>
  {camArray.map((user, index) => {
    const userToken = JSON.parse(user.stream.connection.data).token;

    let targetIndex = null;
    if (userToken === targetId) {
      if (camCount === 3) {
        targetIndex = 1;
      } else if (camCount >= 4 && camCount <= 6) {
        targetIndex = 2;
      } else if (camCount === 7) {
        targetIndex = 3;
      } else if (camCount === 8) {
        targetIndex = 6;
      } else if (camCount === 9) {
        targetIndex = 8;
      } else if (camCount === 10) {
        targetIndex = 8;
      }
    }

    let positionIndex;

    if (targetIndex === null) {
      if (camCount === 3) {
        const availableIndices = [0, 2].filter(i => !assignedIndices.includes(i));
        positionIndex = Math.min(...availableIndices); 

      } else if (camCount === 4) {
        const availableIndices = [0, 1, 3].filter(i => !assignedIndices.includes(i));
        positionIndex = Math.min(...availableIndices); 
        assignedIndices.push(positionIndex);

      }  else if (camCount === 5) {
        const availableIndices = [0, 1, 3, 4].filter(i => !assignedIndices.includes(i));
        positionIndex = Math.min(...availableIndices); 
        assignedIndices.push(positionIndex);

      } else if (camCount === 6) {
        const availableIndices = [0, 1, 3, 4, 5].filter(i => !assignedIndices.includes(i));
        positionIndex = Math.min(...availableIndices); 
        assignedIndices.push(positionIndex);

      } else if (camCount === 7) {
        const availableIndices = [0, 1, 2, 4, 5, 6].filter(i => !assignedIndices.includes(i));
        positionIndex = Math.min(...availableIndices); 
        assignedIndices.push(positionIndex);

      } else if (camCount === 8) {
        const availableIndices = [0, 1, 2, 3, 4, 5, 7].filter(i => !assignedIndices.includes(i));
        positionIndex = Math.min(...availableIndices); 
        assignedIndices.push(positionIndex);

      } else if (camCount === 9) {
        const availableIndices = [0, 1, 2, 3, 4, 5, 6, 7].filter(i => !assignedIndices.includes(i));
        positionIndex = Math.min(...availableIndices); 
        assignedIndices.push(positionIndex);

      } else if (camCount === 10) {
        const availableIndices = [0, 1, 2, 3, 4, 5, 6, 7, 9].filter(i => !assignedIndices.includes(i));
        positionIndex = Math.min(...availableIndices); 
        assignedIndices.push(positionIndex);
    }
    } else {
      positionIndex = targetIndex; 
      assignedIndices.push(positionIndex);
    }

    if (assignedIndices.length === camCount) {
      displayCamCat = true;
    } else {
      displayCamCat = false;
    }

    console.log(`타겟아이디 : ${targetId}, User Token: ${userToken}, Target Index: ${targetIndex}, Position Index: ${positionIndex}`, "확인하세요");

    return (
      <CamCatWrapper
        camCount={camCount}
        // index={user.positionIndex} 이거로 들어가면 균일하게 들어감
        index={positionIndex}
      > 
        <CamCat props={user} />
      </CamCatWrapper>
    );
  })}
</CamCatGrid>

<div>
  <AgreeButton onClick={startVote ? agreeExpulsion : null} disabled={!startVote} />
  <DisagreeButton onClick={startVote ? disagreeExpulsion : null} disabled={!startVote} />
</div>
{getMyRole()}
</StyledContent>
<TempButton url={`/${roomId}/night`} onClick={() => navigate(`/${roomId}/night`)}/>
{chatVisible()}
</Background>
);
};

export default SunsetPage;