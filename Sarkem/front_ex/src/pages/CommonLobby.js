import Background from '../components/backgrounds/BackgroundSunset';
import styled from 'styled-components';
import React, { useState, useEffect, useRef } from 'react';
import boxImage from '../img/box.png';
import sc_police from '../img/sc_경찰.png';
import sc_vet from '../img/sc_수의사.png';
import sc_sark from '../img/sc_삵.png';
import sc_citizen from '../img/sc_시민.png';
import sc_scoop from '../img/sc_탐정.png';
import sc_psychologist from '../img/sc_심리학자.png';
import sc_nyangachi from '../img/sc_냥아치.png';
import timesetting from '../img/timesetting.png';
import settingbuttonImage from '../img/settingbutton.png';
import BackButton from '../components/buttons/backButton';
import CamCat from '../components/camera/camcat';
import { useLocation, useNavigate } from 'react-router-dom';
import StartButton from '../components/buttons/StartButton';
import InviteButton from '../components/buttons/InviteButton';
import { useRoomContext } from '../Context';
import { useGameContext } from '../GameContext';

const StyledContent = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const RightSection = styled.div`
  flex: 5.5;
  background-image: url(${boxImage});
  background-size: 97% 98%;
  background-repeat: no-repeat;
  background-position: center center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px 0px;
  /* 원하는 크기로 설정 */
`;


const DivWrapper = styled.div`
  /* Wrapper for each RightDiv to split into two parts, except for Div 4 */
  display: flex;
  justify-content : space-between;
`;

const LeftPart = styled.div`
  /* Left part of each RightDiv */
  flex: 2.75;
  display: flex;
  justify-content: center;
  align-items: center;
  background-position: center center;
  background-repeat: no-repeat;
`;

const RightPart = styled.div`
  /* Right part of each RightDiv */
  flex: 2.75;
  display: flex;
  justify-content: center;
  align-items: center;
  background-position: center center;
  background-repeat: no-repeat;
`;


const Logo = styled.img`
  /* 로고 이미지 스타일 작성 */
  max-width: 60vw; /* 가로 크기 60% */
  height: auto; /* 세로 크기 자동으로 조정 */
  max-height: 100%; /* 세로 크기 100% */
`;

const LeftSection = styled.div`
  flex: 4.5;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  position: relative; /* Add position relative */
`;

const LeftPartWrapper = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-repeat: no-repeat;
  background-position: center center;
  justify-content: center;
  background-size: contain;
  height: 180%;
  width : 120%;
`;
const RightPartWrapper = styled.div`
  flex: 0.75;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-position : center center;
  padding: 13px;
  height: 100%; /* Adjust the height as needed */
  width : 100%;
  margin-right : 0px;

  button {
    font-size: 18px;
    margin-right: 10px;
    margin-left : 10px;
  }

  div {
    font-size: 20px;
  }

`;

const ButtonContainer = styled.div`
  width: 60%;
  height: 85%;
`;

const CommonLobby = ()=>{
  const {roomId, isHost, camArray, leaveSession, token} = useRoomContext();
  const {peopleCount, setPeopleCount, handleGamePageClick, stompCilent} = useGameContext();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (roomId === ''){
      console.log("세션 정보가 없습니다.")
      navigate("/");
      return;
    }
    window.history.pushState(null, "", location.href);
    window.addEventListener("popstate", () => leaveSession());
    
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

  
  // Function to handle the click event when the user wants to invite others
  const handleInviteClick = async () => {
    await navigator.clipboard.writeText("localhost:3000/"+roomId).then(alert("게임 링크가 복사되었습니다."));
    console.log('Invite functionality for hosts');
  };

  const CamCatGrid = styled.div`
  flex: 1;
  display: grid;
  gap: 3px;
  align-items: center;
  justify-items: center;
  overflow: hidden;
  ${({ style }) => style && `
    grid-template-rows: ${style.gridTemplateRows};
    grid-template-columns: ${style.gridTemplateColumns};
    width: ${style.width};
    max-height: ${style.maxHeight};
    height: auto;
  `}
`;

const calculateGrid = (camCount) => {
  if (camCount === 1) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr',
      width : '100%',
    };
  } else if (camCount === 2) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr',
      width : '50%',
    };
  } else if (camCount === 3) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      width : '100%',
    };
  } else if (camCount === 4) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
    };
  } else if (camCount === 5) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      width : '62%',
    };
  } else if (camCount === 6) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      width : '62%',
    };
  } else if (camCount === 7) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      width : '92%',
    };
  } else if (camCount === 8) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      width : '92%',
    };
  } else if (camCount === 9) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      width : '92%',
    };
  } else if (camCount === 10) {
    return {
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      width : '92%',
    };

  } else {
    // Add more cases as needed
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
    };
  }
};

const camCount = camArray.length;
const gridStyles = calculateGrid(camCount);


  // 변경된 게임 옵션을 redis 토픽에 전달
  const callChangeOption = () => {
    if(stompCilent.current.connected && token !== null) {
      stompCilent.current.send("/pub/game/action", {}, 
          JSON.stringify({
              code:'OPTION_CHANGE', 
              roomId: roomId, 
              playerId: token,
              param: peopleCount
          }))
          console.log(peopleCount)
  }
  }

  // 게임 옵션이 변경되면, callChangeOption 호출
  useEffect(()=> {
   if(!isHost) return;
   callChangeOption();
  }, [peopleCount]);

  // 게임 옵션을 변경처리 하는 함수
  const handlePeopleCountChange = (part, value) => {
    if (!isHost) return;
    if (stompCilent.current.connect === undefined) return;
    setPeopleCount((prevPeopleCount) => ({
      ...prevPeopleCount,
      [part]: value,
    }));
  };

const leftSectionRef = useRef(null);

  return (
    <Background>
      <BackButton/>
      <StyledContent>
        <LeftSection ref={leftSectionRef}>
          <CamCatGrid style={gridStyles}>
            {camArray.map((user, index) => (
              <CamCat key={index} props={user} />
            ))}
          </CamCatGrid>
        </LeftSection>
        <RightSection>
          <DivWrapper
            style={{ backgroundRepeat: 'no-repeat', backgroundPosition : 'center center', backgroundSize: '95% 100%', backgroundImage: `url(${settingbuttonImage})`, width: '100%', height : '15%'}}
          />
        <DivWrapper>
          <LeftPart>
          <LeftPartWrapper style={{ backgroundImage: `url(${sc_sark})` }} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('sarkCount', peopleCount.sarkCount + 1)}>+</button>
                <div>{peopleCount.sarkCount}</div>
                <button onClick={() => handlePeopleCountChange('sarkCount', peopleCount.sarkCount - 1)}>-</button>
              </RightPartWrapper>
            </LeftPart>
            <RightPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_citizen})` }} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('citizenCount', peopleCount.citizenCount + 1)}>+</button>
                <div>{peopleCount.citizenCount}</div>
                <button onClick={() => handlePeopleCountChange('citizenCount', peopleCount.citizenCount - 1)}>-</button>
              </RightPartWrapper>
            </RightPart>
          </DivWrapper>
          <DivWrapper>
            <LeftPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_vet})` }} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('doctorCount', peopleCount.doctorCount + 1)}>+</button>
                <div>{peopleCount.doctorCount}</div>
                <button onClick={() => handlePeopleCountChange('doctorCount', peopleCount.doctorCount - 1)}>-</button>
              </RightPartWrapper>
            </LeftPart>
            <RightPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_police})` }} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('policeCount', peopleCount.policeCount + 1)}>+</button>
                <div>{peopleCount.policeCount}</div>
                <button onClick={() => handlePeopleCountChange('policeCount', peopleCount.policeCount - 1)}>-</button>
              </RightPartWrapper>
        </RightPart>
      </DivWrapper>
      <DivWrapper>
            <LeftPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_scoop})` }} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('detectiveCount', peopleCount.detectiveCount + 1)}>+</button>
                <div>{peopleCount.detectiveCount}</div>
                <button onClick={() => handlePeopleCountChange('detectiveCount', peopleCount.detectiveCount - 1)}>-</button>
              </RightPartWrapper>
            </LeftPart>
            <RightPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_psychologist})` }} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('psychologistCount', peopleCount.psychologistCount + 1)}>+</button>
                <div>{peopleCount.psychologistCount}</div>
                <button onClick={() => handlePeopleCountChange('psychologistCount', peopleCount.psychologistCount - 1)}>-</button>
              </RightPartWrapper>
        </RightPart>
      </DivWrapper>
      <DivWrapper>
            <LeftPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_nyangachi})` }} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('bullyCount', peopleCount.bullyCount + 1)}>+</button>
                <div>{peopleCount.bullyCount}</div>
                <button onClick={() => handlePeopleCountChange('bullyCount', peopleCount.bullyCount - 1)}>-</button>
              </RightPartWrapper>
            </LeftPart>
            <RightPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${timesetting})` }} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('meetingTime', peopleCount.meetingTime + 60)}>+</button>
                <div>{peopleCount.meetingTime}</div>
                <button onClick={() => handlePeopleCountChange('meetingTime', peopleCount.meetingTime - 60)}>-</button>
              </RightPartWrapper>
        </RightPart>
      </DivWrapper>
          <DivWrapper>
            {isHost ? (
              <>
                <LeftPart>
                <ButtonContainer>
                <StartButton url="/${roomId}/day" onClick={handleGamePageClick} alt="Start Game" />
                </ButtonContainer>
                </LeftPart>
                <RightPart>
                <ButtonContainer>
                  <InviteButton onClick={handleInviteClick} />
                  </ButtonContainer>
                </RightPart>
                
              </>
            ) : (
              <>
                <RightPart>
                  <ButtonContainer style ={{flex : '0.3'}}>
                  <InviteButton onClick={handleInviteClick} />
                  </ButtonContainer>
                </RightPart>
              </>
            )}
          </DivWrapper>
        
        </RightSection>
      </StyledContent>
    </Background>
  );
};

export default CommonLobby;

