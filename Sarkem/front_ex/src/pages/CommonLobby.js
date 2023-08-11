import Background from '../components/backgrounds/BackgroundSunset';
import '../index.css';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
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
import upbutton from '../img/upbutton.png';
import downbutton from '../img/downbutton.png';
// 
import BackButton from '../components/buttons/backButton';
import { useLocation, useNavigate } from 'react-router-dom';
import StartButton from '../components/buttons/StartButton';
import InviteButton from '../components/buttons/InviteButton';
import { useRoomContext } from '../Context';
import { useGameContext } from '../GameContext';
import LobbyCamera from '../components/camera/LobbyCamera';
import ScPopup from '../components/games/ScPopup';
import LoadingPage from './LoadingPage';
import ingameClickSound from '../sound/ingameclick.mp3';

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

const DivWrapper2 = styled.div`

  display: flex;
  height: 15%;
  justify-content: space-around;
  
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

const MiddlePart = styled.div`
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
const ButtonContainer2 = styled.div`
  width: auto;
  height: 65%;
`;


const CommonLobby = ()=>{
  const { roomSession, player, players, leaveSession } = useRoomContext();
  const { gameSession, setGameSession, getGameSession, handleGamePageClick, stompClient } = useGameContext();

  // const [ isLoaded, setIsLoaded ] = useState(false);
  
  const clickAudio = new Audio(ingameClickSound);
  const navigate = useNavigate();
  const location = useLocation();


  ////////////   CommonLobby Effect   ////////////


  useEffect(() => {

    // window.history.pushState(null, "", location.href);
    // window.addEventListener("popstate", () => leaveSession());


    if (roomSession == undefined || roomSession.roomId == undefined) {
      console.log(`roomSession`);
      console.log(roomSession);
      console.log(`roomSession roomId`);
      console.log(roomSession.roomId);
      console.log(location.pathname);
      navigate(`/${location.pathname.split("/")[1]}`);
      return;
    }

    // 윈도우 객체에 화면 종료 이벤트 추가
    window.addEventListener('beforeunload', onbeforeunload);
    return () => {
        window.removeEventListener('beforeunload', onbeforeunload);
    }
  }, [])


  ////////////   CommonLobby 함수   ////////////


  // 화면을 새로고침 하거나 종료할 때 발생하는 이벤트
  const onbeforeunload = (event) => {
    leaveSession();
  }

  
  // Function to handle the click event when the user wants to invite others
  const handleInviteClick = async () => {
    await navigator.clipboard.writeText("localhost:3000/"+roomSession.roomId).then(alert("게임 링크가 복사되었습니다."));
    console.log('Invite functionality for hosts');
  };
  

  // 게임 옵션을 변경처리 하는 함수
  const handleGameOptionChange = (part, value) => {
    if (!player.isHost) return;
    if (stompClient.current.connect === undefined) return;
    if (value < 0) return;    
    else if (part === 'meetingTime' && (value < 15 || value > 180)) return;

    const gameOption = {
      ...gameSession.gameOption,
      [part] : value,
    };
    setGameSession((prev) => {
      return ({
        ...prev,
        gameOption: gameOption,
      })
    });
    
    clickAudio.play(); // Play the ingameClickSound
  }

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



  //업다운 버튼
  const buttonStyle = {
    border: 'none',
    background: 'none',
    padding: '0',
    cursor: 'pointer',
    transition: 'filter 0.3s ease', // Adding transition for smooth effect
    margin: '13px',
  };

  return (
    <>
    { gameSession?.gameOption ? (<Background>
      
      {showSarkPopup && <ScPopup src={c_sark} top="20%" left="50%" />}
      {showVetPopup && <ScPopup src={c_vet} top="40%" left="50%" />}
      {showPolicePopup && <ScPopup src={c_police} top="40%" left="72.5%" />}
      {showCitizenPopup && <ScPopup src={c_citizen} top="20%" left="72.5%" />}
      {showScoopPopup && <ScPopup src={c_scoop} top="60%" left="50%" />}
      {showPsychologistPopup && <ScPopup src={c_psychologist} top="60%" left="72.5%" />}
      {showNyangachiPopup && <ScPopup src={c_nyangachi} top="80%" left="50%" />}
      <BackButton/>
      <StyledContent>
         <LobbyCamera ids={Array.from(players.keys())} />
        <RightSection>
          <DivWrapper
            style={{ backgroundRepeat: 'no-repeat', backgroundPosition : 'center center', backgroundSize: '95% 100%', backgroundImage: `url(${settingbuttonImage})`, width: '100%', height : '15%'}}/>
          <DivWrapper>
          <LeftPart>
          <LeftPartWrapper style={{ backgroundImage: `url(${sc_sark})` }}  onMouseEnter={handleMouseEnterSark} onMouseLeave={handleMouseLeaveSark} />
              <RightPartWrapper>
                <button
                  style={{ ...buttonStyle }}
                  onClick={() => handleGameOptionChange('sarkCount', gameSession.gameOption.sarkCount - 1)}
                  onMouseEnter={(e) => e.target.style.filter = 'brightness(0.8)'}
                  onMouseLeave={(e) => e.target.style.filter = 'none'}>
                    <img src={downbutton} alt="Down Button" />
                </button>
                <div>{gameSession.gameOption.sarkCount}</div>
                <button
                  style={{ ...buttonStyle }}
                  onClick={() => handleGameOptionChange('sarkCount', gameSession.gameOption.sarkCount + 1)}
                  onMouseEnter={(e) => e.target.style.filter = 'brightness(0.8)'}
                  onMouseLeave={(e) => e.target.style.filter = 'none'}>
                   <img src={upbutton} alt="Up Button" />
                </button>
              </RightPartWrapper>
            </LeftPart>
            <RightPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_citizen})` }} onMouseEnter={handleMouseEnterCitizen} onMouseLeave={handleMouseLeaveCitizen}  />
              <RightPartWrapper>
                <button
                  style={{ ...buttonStyle }}
                  onClick={() => handleGameOptionChange('citizenCount', gameSession.gameOption.citizenCount - 1)}
                  onMouseEnter={(e) => e.target.style.filter = 'brightness(0.8)'}
                  onMouseLeave={(e) => e.target.style.filter = 'none'}>
                    <img src={downbutton} alt="Down Button" />
                </button>
                <div>{gameSession.gameOption.citizenCount}</div>
                <button
                  style={{ ...buttonStyle }}
                  onClick={() => handleGameOptionChange('citizenCount', gameSession.gameOption.citizenCount + 1)}
                  onMouseEnter={(e) => e.target.style.filter = 'brightness(0.8)'}
                  onMouseLeave={(e) => e.target.style.filter = 'none'}>
                   <img src={upbutton} alt="Up Button" />
                </button>
              </RightPartWrapper>
            </RightPart>
          </DivWrapper>
          <DivWrapper>
            <LeftPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_vet})` }} onMouseEnter={handleMouseEnterVet} onMouseLeave={handleMouseLeaveVet} />
              <RightPartWrapper>
                <button
                    style={{ ...buttonStyle }}
                    onClick={() => handleGameOptionChange('doctorCount', gameSession.gameOption.doctorCount - 1)}
                    onMouseEnter={(e) => e.target.style.filter = 'brightness(0.8)'}
                    onMouseLeave={(e) => e.target.style.filter = 'none'}>
                      <img src={downbutton} alt="Down Button" />
                  </button>
                  <div>{gameSession.gameOption.doctorCount}</div>
                  <button
                    style={{ ...buttonStyle }}
                    onClick={() => handleGameOptionChange('doctorCount', gameSession.gameOption.doctorCount + 1)}
                    onMouseEnter={(e) => e.target.style.filter = 'brightness(0.8)'}
                    onMouseLeave={(e) => e.target.style.filter = 'none'}>
                    <img src={upbutton} alt="Up Button" />
                </button>
              </RightPartWrapper>
            </LeftPart>
            <RightPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_police})` }} onMouseEnter={handleMouseEnterPolice} onMouseLeave={handleMouseLeavePolice} />
              <RightPartWrapper>
                <button
                    style={{ ...buttonStyle }}
                    onClick={() => handleGameOptionChange('policeCount', gameSession.gameOption.policeCount - 1)}
                    onMouseEnter={(e) => e.target.style.filter = 'brightness(0.8)'}
                    onMouseLeave={(e) => e.target.style.filter = 'none'}>
                      <img src={downbutton} alt="Down Button" />
                  </button>
                  <div>{gameSession.gameOption.policeCount}</div>
                  <button
                    style={{ ...buttonStyle }}
                    onClick={() => handleGameOptionChange('policeCount', gameSession.gameOption.policeCount + 1)}
                    onMouseEnter={(e) => e.target.style.filter = 'brightness(0.8)'}
                    onMouseLeave={(e) => e.target.style.filter = 'none'}>
                    <img src={upbutton} alt="Up Button" />
                </button>
              </RightPartWrapper>
        </RightPart>
      </DivWrapper>
      <DivWrapper>
            <LeftPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_scoop})` }} onMouseEnter={handleMouseEnterScoop} onMouseLeave={handleMouseLeaveScoop} />
              <RightPartWrapper>
                <button
                    style={{ ...buttonStyle }}
                    onClick={() => handleGameOptionChange('detectiveCount', gameSession.gameOption.detectiveCount - 1)}
                    onMouseEnter={(e) => e.target.style.filter = 'brightness(0.8)'}
                    onMouseLeave={(e) => e.target.style.filter = 'none'}>
                      <img src={downbutton} alt="Down Button" />
                  </button>
                  <div>{gameSession.gameOption.detectiveCount}</div>
                  <button
                    style={{ ...buttonStyle }}
                    onClick={() => handleGameOptionChange('detectiveCount', gameSession.gameOption.detectiveCount + 1)}
                    onMouseEnter={(e) => e.target.style.filter = 'brightness(0.8)'}
                    onMouseLeave={(e) => e.target.style.filter = 'none'}>
                    <img src={upbutton} alt="Up Button" />
                </button>
              </RightPartWrapper>
            </LeftPart>
            <RightPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_psychologist})` }} onMouseEnter={handleMouseEnterPsychologist} onMouseLeave={handleMouseLeavePsychologist} />
              <RightPartWrapper>
                <button
                    style={{ ...buttonStyle }}
                    onClick={() => handleGameOptionChange('psychologistCount', gameSession.gameOption.psychologistCount - 1)}
                    onMouseEnter={(e) => e.target.style.filter = 'brightness(0.8)'}
                    onMouseLeave={(e) => e.target.style.filter = 'none'}>
                      <img src={downbutton} alt="Down Button" />
                  </button>
                  <div>{gameSession.gameOption.psychologistCount}</div>
                  <button
                    style={{ ...buttonStyle }}
                    onClick={() => handleGameOptionChange('psychologistCount', gameSession.gameOption.psychologistCount + 1)}
                    onMouseEnter={(e) => e.target.style.filter = 'brightness(0.8)'}
                    onMouseLeave={(e) => e.target.style.filter = 'none'}>
                    <img src={upbutton} alt="Up Button" />
                </button>
              </RightPartWrapper>
        </RightPart>
      </DivWrapper>
      <DivWrapper>
            <LeftPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_nyangachi})` }} onMouseEnter={handleMouseEnterNyangachi} onMouseLeave={handleMouseLeaveNyangachi}  />
              <RightPartWrapper>
                <button
                    style={{ ...buttonStyle }}
                    onClick={() => handleGameOptionChange('bullyCount', gameSession.gameOption.bullyCount - 1)}
                    onMouseEnter={(e) => e.target.style.filter = 'brightness(0.8)'}
                    onMouseLeave={(e) => e.target.style.filter = 'none'}>
                      <img src={downbutton} alt="Down Button" />
                  </button>
                  <div>{gameSession.gameOption.bullyCount}</div>
                  <button
                    style={{ ...buttonStyle }}
                    onClick={() => handleGameOptionChange('bullyCount', gameSession.gameOption.bullyCount + 1)}
                    onMouseEnter={(e) => e.target.style.filter = 'brightness(0.8)'}
                    onMouseLeave={(e) => e.target.style.filter = 'none'}>
                    <img src={upbutton} alt="Up Button" />
                </button>
              </RightPartWrapper>
            </LeftPart>
            <RightPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${timesetting})` }} />
              <RightPartWrapper>
               <button
                    style={{ ...buttonStyle }}
                    onClick={() => handleGameOptionChange('meetingTime', gameSession.gameOption.meetingTime - 15)}
                    onMouseEnter={(e) => e.target.style.filter = 'brightness(0.8)'}
                    onMouseLeave={(e) => e.target.style.filter = 'none'}>
                      <img src={downbutton} alt="Down Button" />
                  </button>
                  <div>{gameSession.gameOption.meetingTime}</div>
                  <button
                    style={{ ...buttonStyle }}
                    onClick={() => handleGameOptionChange('meetingTime', gameSession.gameOption.meetingTime + 15)}
                    onMouseEnter={(e) => e.target.style.filter = 'brightness(0.8)'}
                    onMouseLeave={(e) => e.target.style.filter = 'none'}>
                    <img src={upbutton} alt="Up Button" />
                </button>
              </RightPartWrapper>
        </RightPart>
      </DivWrapper>
          
          
            {player.isHost ? (
              <>
              <DivWrapper>
                <LeftPart>
                  <ButtonContainer>
                   <InviteButton onClick={handleInviteClick} />
                  </ButtonContainer>
                  </LeftPart>
                  <RightPart>
                    <ButtonContainer>
                      <StartButton url="/${roomId}/day" onClick={handleGamePageClick} alt="Start Game" />
                    </ButtonContainer>
                </RightPart>
              </DivWrapper>
               
              </>
            ) : (
              <>
                <DivWrapper2>
                  <MiddlePart>
                  <ButtonContainer2>
                    <InviteButton onClick={handleInviteClick} />
                  </ButtonContainer2>

                  </MiddlePart>
                  

                </DivWrapper2>
              </>
            )}
        
        </RightSection>
      </StyledContent>
    </Background>):<LoadingPage/>}
    </>
  );
};

export default CommonLobby;

