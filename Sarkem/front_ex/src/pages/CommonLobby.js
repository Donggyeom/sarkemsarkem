import Background from '../components/backgrounds/BackgroundSunset';
import styled from 'styled-components';
import React, { useState, useEffect, useRef } from 'react';
// img
import boxImage from '../img/box.png';
import sc_police from '../img/sc_경찰.png';
import c_police from '../img/c_경찰.png'
import sc_vet from '../img/sc_수의사.png';
import c_vet from '../img/c_수의사.png';
import sc_sark from '../img/sc_삵.png';
import c_sark from '../img/c_삵.png';
import sc_citizen from '../img/sc_시민.png';
import c_citizen from '../img/c_시민.png';
import sc_scoop from '../img/sc_탐정.png';
import c_scoop from '../img/c_탐정.png';
import sc_psychologist from '../img/sc_심리학자.png';
import c_psychologist from '../img/c_심리학자.png';
import sc_nyangachi from '../img/sc_냥아치.png';
import c_nyangachi from '../img/c_냥아치.png';
import timesetting from '../img/timesetting.png';
import settingbuttonImage from '../img/settingbutton.png';
// 
import BackButton from '../components/buttons/backButton';
import CamCat from '../components/camera/camcat';
import { useLocation, useNavigate } from 'react-router-dom';
import StartButton from '../components/buttons/StartButton';
import InviteButton from '../components/buttons/InviteButton';
import { useRoomContext } from '../Context';
import LobbyCamera from '../components/camera/LobbyCamera';
import ScPopup from '../components/games/ScPopup';
import HelpButton from '../components/buttons/HelpButton';
import Help from '../components/games/Help';


const StyledContent = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const RightSection = styled.div`
  flex: 45%;
  background-image: url(${boxImage});
  background-size: 98.5% 98%;
  background-repeat: no-repeat;
  background-position: center center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 0px;
  /* 원하는 크기로 설정 */
`;


const DivWrapper = styled.div`
  display: flex;
  // justify-content : space-around;
`;

const LeftPart = styled.div`
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

const LeftPartWrapper = styled.div`
  flex: 1.75;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-repeat: no-repeat;
  background-position: center center;
  justify-content: center;
  background-size: contain;
  height: 110%;
  width : 100%;
  overflow : hidden;
  margin-left: 5%;
`;
const RightPartWrapper = styled.div`
  flex: 0.5;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-position : center;
  padding: 11%;
  height: 100%; /* Adjust the height as needed */
  width : 100%;
  margin-right : 0;
  overflow : hidden;

  button {
    font-size: 18px;
    margin-right: 15%;
    margin-left : 15%;
    oveflow :
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
  const {roomId, isHost, camArray, leaveSession} = useRoomContext();
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


  const [peopleCount, setPeopleCount] = useState({
    sark: 0,
    citizen: 0,
    vet: 0,
    police: 0,
    scoop: 0,
    psychologist: 0,
    nyangachi: 0,
    timesetting: 0,
  });

  const handlePeopleCountChange = (part, value) => {
    if (value >= 0)
    setPeopleCount((prevPeopleCount) => ({
      ...prevPeopleCount,
      [part]: value,
    }));
  };

  // popup

  const [showVetPopup, setShowVetPopup] = useState(false);
  const [showSarkPopup, setShowSarkPopup] = useState(false);
  const [showPolicePopup, setShowPolicePopup] = useState(false);
  const [showCitizenPopup, setShowCitizenPopup] = useState(false);
  const [showScoopPopup, setShowScoopPopup] = useState(false);
  const [showPsychologistPopup, setShowPsychologistPopup] = useState(false);
  const [showNyangachiPopup, setShowNyangachiPopup] = useState(false);
  const handleMouseEnterVet = () => {
    setShowVetPopup(true);
  };
  const handleMouseLeaveVet = () => {
    setShowVetPopup(false);
  };
  const handleMouseEnterSark = () => {
    setShowSarkPopup(true);
  };
  const handleMouseLeaveSark = () => {
    setShowSarkPopup(false);
  };
  const handleMouseEnterPolice = () => {
    setShowPolicePopup(true);
  };
  const handleMouseLeavePolice = () => {
    setShowPolicePopup(false);
  };
  const handleMouseEnterCitizen = () => {
    setShowCitizenPopup(true);
  };
  const handleMouseLeaveCitizen = () => {
    setShowCitizenPopup(false);
  };
  const handleMouseEnterScoop = () => {
    setShowScoopPopup(true);
  };
  const handleMouseLeaveScoop = () => {
    setShowScoopPopup(false);
  };
  const handleMouseEnterPsychologist = () => {
    setShowPsychologistPopup(true);
  };
  const handleMouseLeavePsychologist = () => {
    setShowPsychologistPopup(false);
  };
  const handleMouseEnterNyangachi = () => {
    setShowNyangachiPopup(true);
  };
  const handleMouseLeaveNyangachi = () => {
    setShowNyangachiPopup(false);
  };

  //도움말
  const [isHelpOn, setIsHelpOn] = useState(true);
  const handleHelpButtonClick = () => {
    setIsHelpOn((prevIsHelpOn) => !prevIsHelpOn);
  };


  return (
    <Background>
      {!isHelpOn && <Help top="47%" left="78%" />}
      {showSarkPopup && <ScPopup src={c_sark} top="20%" left="50%" />}
      {showVetPopup && <ScPopup src={c_vet} top="40%" left="50%" />}
      {showPolicePopup && <ScPopup src={c_police} top="40%" left="72.5%" />}
      {showCitizenPopup && <ScPopup src={c_citizen} top="20%" left="72.5%" />}
      {showScoopPopup && <ScPopup src={c_scoop} top="60%" left="50%" />}
      {showPsychologistPopup && <ScPopup src={c_psychologist} top="60%" left="72.5%" />}
      {showNyangachiPopup && <ScPopup src={c_nyangachi} top="80%" left="50%" />}
      <BackButton/>
      <StyledContent>
         <LobbyCamera camArray={camArray} />
        <RightSection>
          <DivWrapper
            style={{ backgroundRepeat: 'no-repeat', backgroundPosition : 'center center', backgroundSize: '95% 100%', backgroundImage: `url(${settingbuttonImage})`, width: '100%', height : '15%'}}/>
          <DivWrapper>
          <LeftPart>
          <LeftPartWrapper style={{ backgroundImage: `url(${sc_sark})` }}  onMouseEnter={handleMouseEnterSark} onMouseLeave={handleMouseLeaveSark} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('sark', peopleCount.sark + 1)}>+</button>
                <div>{peopleCount.sark}</div>
                <button onClick={() => handlePeopleCountChange('sark', peopleCount.sark - 1)}>-</button>
              </RightPartWrapper>
            </LeftPart>
            <RightPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_citizen})` }} onMouseEnter={handleMouseEnterCitizen} onMouseLeave={handleMouseLeaveCitizen}  />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('citizen', peopleCount.citizen + 1)}>+</button>
                <div>{peopleCount.citizen}</div>
                <button onClick={() => handlePeopleCountChange('citizen', peopleCount.citizen - 1)}>-</button>
              </RightPartWrapper>
            </RightPart>
          </DivWrapper>
          <DivWrapper>
            <LeftPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_vet})` }} onMouseEnter={handleMouseEnterVet} onMouseLeave={handleMouseLeaveVet} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('vet', peopleCount.vet + 1)}>+</button>
                <div>{peopleCount.vet}</div>
                <button onClick={() => handlePeopleCountChange('vet', peopleCount.vet - 1)}>-</button>
              </RightPartWrapper>
            </LeftPart>
            <RightPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_police})` }} onMouseEnter={handleMouseEnterPolice} onMouseLeave={handleMouseLeavePolice} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('police', peopleCount.police + 1)}>+</button>
                <div>{peopleCount.police}</div>
                <button onClick={() => handlePeopleCountChange('police', peopleCount.police - 1)}>-</button>
              </RightPartWrapper>
        </RightPart>
      </DivWrapper>
      <DivWrapper>
            <LeftPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_scoop})` }} onMouseEnter={handleMouseEnterScoop} onMouseLeave={handleMouseLeaveScoop} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('scoop', peopleCount.scoop + 1)}>+</button>
                <div>{peopleCount.scoop}</div>
                <button onClick={() => handlePeopleCountChange('scoop', peopleCount.scoop - 1)}>-</button>
              </RightPartWrapper>
            </LeftPart>
            <RightPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_psychologist})` }} onMouseEnter={handleMouseEnterPsychologist} onMouseLeave={handleMouseLeavePsychologist} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('psychologist', peopleCount.psychologist + 1)}>+</button>
                <div>{peopleCount.psychologist}</div>
                <button onClick={() => handlePeopleCountChange('psychologist', peopleCount.psychologist - 1)}>-</button>
              </RightPartWrapper>
        </RightPart>
      </DivWrapper>
      <DivWrapper>
            <LeftPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_nyangachi})` }} onMouseEnter={handleMouseEnterNyangachi} onMouseLeave={handleMouseLeaveNyangachi}  />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('nyangachi', peopleCount.nyangachi + 1)}>+</button>
                <div>{peopleCount.nyangachi}</div>
                <button onClick={() => handlePeopleCountChange('nyangachi', peopleCount.nyangachi - 1)}>-</button>
              </RightPartWrapper>
            </LeftPart>
            <RightPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${timesetting})` }} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('timesetting', peopleCount.timesetting + 60)}>+</button>
                <div>{peopleCount.timesetting}</div>
                <button onClick={() => handlePeopleCountChange('timesetting', peopleCount.timesetting - 60)}>-</button>
              </RightPartWrapper>
        </RightPart>
      </DivWrapper>
          <DivWrapper>
          
            {isHost ? (
              <>
                <LeftPart>
                <ButtonContainer>
                <StartButton url="/${roomId}/day" onClick={() => navigate(`/${roomId}/day`)} alt="Start Game" />
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
                  <ButtonContainer>
                    <InviteButton onClick={handleInviteClick} />
                  </ButtonContainer>
                </RightPart>
              </>
            )}
          </DivWrapper>
        
        </RightSection>
        <HelpButton onClick={handleHelpButtonClick} isHelpOn={isHelpOn} />
      </StyledContent>
    </Background>
  );
};

export default CommonLobby;

