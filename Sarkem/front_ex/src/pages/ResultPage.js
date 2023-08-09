import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Background1 from '../components/backgrounds/BackgroundSunset';
import Background2 from '../components/backgrounds/BackgroundNight';
import ReButton from '../components/buttons/reButton';
import ResultBox from '../components/games/ResultBox';
import ResultBox2 from '../components/games/ResultBox2';
import logoImage from '../img/logo.png';
import { useNavigate } from 'react-router-dom';
import { useRoomContext } from '../Context';
import { useGameContext } from '../GameContext';
import createRandomId from '../utils';

const StyledSunsetPage = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  align-items: center;
`;

const Logo = styled.img`
  /* 로고 이미지 스타일 작성 */
  max-width: 150px;
  height: auto;
  max-height: 100%;
  position: absolute;
  top: -30%;
  left: 55%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 35px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.div`
  position: absolute;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 75px;
  color: #ffffff;
  text-shadow: 1px 1px black;
  -webkit-text-stroke: 3px black;
  text-stroke: 5px black;
`;

const Table = styled.table`
  width: 70%;
  max-height: 62%;
  overflow-x: auto;
  border-spacing: 0px 4px; /* Remove default border spacing */
  text-align: center;
  z-index: 1;
  margin: 0 auto;
  margin-left: -63%;
  margin-top: -10%;
  borderCollapse: 'separate',
`;

const TableCell = styled.td`
  font-size: 20px;
  padding: 10px;
  margin-bottom: 30px;
  &:first-child {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  &:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

const TableRow = styled.tr`
`;


const ResultPage = () => {
  const {
    setPublisher,
    setSubscribers,
    setCamArray,
    session,
    setSession, roomId, isHost, camArray, leaveSession, token, setIsHost
  } = useRoomContext();
  const { peopleCount, setPeopleCount, roleAssignedArray, winner, stompClient } = useGameContext();
  const navigate = useNavigate();
  console.log(roleAssignedArray);

  const callChangeOption = () => {
    if(stompClient.current.connected && token !== null) {
      stompClient.current.send("/pub/game/action", {}, 
          JSON.stringify({
              code:'OPTION_CHANGE', 
              roomId: roomId, 
              playerId: token,
              param: peopleCount
          }))
          console.log(peopleCount)
  }
  }

  useEffect(() => {
    if (!isHost) return;
    callChangeOption();
  }, [peopleCount]);
  
  const handlePeopleCountChange = () => {
    if (!isHost) return;
    if (stompClient.current.connect === undefined) return;
  
    const newPeopleCount = {};
    for (const key in peopleCount) {
      if (key==='meetingTime') newPeopleCount[key]=60;
      else newPeopleCount[key] = 0;
    }
  
    setPeopleCount(newPeopleCount);
    console.log(peopleCount);
  };

  const handleAgainButtonClick = () => {
    console.log("세션 해제중입니다.....");
    if (session) session.disconnect();
    leaveSession();
    setSession(undefined);
    setSubscribers([]);
    setPublisher(undefined);
    setCamArray([]);
    setIsHost(() => true);
    handlePeopleCountChange();
    console.log("새로운 방 만들기");
    navigate(`/${createRandomId()}`, { state: { isHost: true } });
  };

  const handleExitButtonClick = () => {
    console.log("세션 해제중입니다.....");
    if (session) session.disconnect();
    leaveSession();
    setSession(undefined);
    setSubscribers([]);
    setPublisher(undefined);
    setCamArray([]);
    console.log("홈으로 나가기");
    navigate('/');
  };

  const sarkPlayers = roleAssignedArray.filter(playerRole => playerRole.job === '삵');
  const nonSarkPlayers = roleAssignedArray.filter(playerRole => playerRole.job !== '삵');

  return (
    <div>
    {winner === 'CITIZEN' ? (
      <Background1>
        <StyledSunsetPage>
        <ResultBox> </ResultBox>
          <ButtonContainer>
            <Logo src={logoImage} alt="로고" />
            <ReButton onClick={handleAgainButtonClick}>다시하기</ReButton>
            <ReButton onClick={handleExitButtonClick}>나가기</ReButton>
          </ButtonContainer>
          <Title> 냥냥이팀 승리!</Title>
          <Table >
          <tbody>
            {nonSarkPlayers.map((playerRole, index) => (
              <TableRow key={index} even={index % 2 === 0} style={{  backgroundColor: "#f25282" }}>
                <TableCell>{playerRole.nickname}</TableCell>
                <TableCell>{playerRole.job}</TableCell>
              </TableRow>
            ))}
            {sarkPlayers.map((playerRole, index) => (
              <TableRow key={index} even={index % 2 === 0} style={{  backgroundColor: "#ff9cb9" }}>
                <TableCell>{playerRole.nickname}</TableCell>
                <TableCell>{playerRole.job}</TableCell>
              </TableRow>
            ))}
            
          </tbody>
        </Table>
        </StyledSunsetPage>
      </Background1>
    ) : (
      <Background2>
        <StyledSunsetPage>
        <ResultBox2> </ResultBox2>
        <ButtonContainer>
          <Logo src={logoImage} alt="로고" />
          <ReButton onClick={handleAgainButtonClick}>다시하기</ReButton>
          <ReButton onClick={handleExitButtonClick}>나가기</ReButton>
        </ButtonContainer>
        <Title> 삵팀 승리!</Title>
        <Table>
        <tbody>
          {sarkPlayers.map((playerRole, index) => (
            <TableRow key={index} even={index % 2 === 0} style={{  backgroundColor: "#9ed8ff" }}>
              <TableCell>{playerRole.nickname}</TableCell>
              <TableCell>{playerRole.job}</TableCell>
            </TableRow>
          ))}
          {nonSarkPlayers.map((playerRole, index) => (
            <TableRow key={index} even={index % 2 === 0} style={{  backgroundColor: "#7db1d4" }}>
              <TableCell>{playerRole.nickname}</TableCell>
              <TableCell>{playerRole.job}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

        </StyledSunsetPage>
      </Background2>
    )}
  </div>


  );
};

export default ResultPage;
