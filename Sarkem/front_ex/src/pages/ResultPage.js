import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Background1 from '../components/backgrounds/BackgroundSunset';
import Background2 from '../components/backgrounds/BackgroundNight';
import ReButton from '../components/buttons/reButton';
import ResultBox from '../components/games/ResultBox';
import ResultBox2 from '../components/games/ResultBox2';
import logoImage from '../img/logo.png';
import outImage from '../img/btn_out.png';
import againImage from '../img/btn_again.png';
import { useNavigate } from 'react-router-dom';
import { useRoomContext } from '../Context';
import { useGameContext } from '../GameContext';
import createRandomId from '../utils';
import resultSound from '../sound/result.mp3';

//icon
import achiIcon from '../img/icon/o_achi.png'
import citizenIcon from '../img/icon/o_citizen.png'
import detectorIcon from '../img/icon/o_detector.png'
import doctorIcon from '../img/icon/o_doctor.png'
import policeIcon from '../img/icon/o_police.png'
import psychoIcon from '../img/icon/o_psycho.png'
import sarkIcon from '../img/icon/o_sark.png'

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
  top: -40%;
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
  margin-top: 0%;
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

const TableCell2 = styled.td`
  width: 20%; /* Adjust the width as needed */
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
  background-color: ${(props) => (props.even ? '#f2f2f2' : 'white')};
  
`;

const roleInfoMapping = {
  PSYCHO: { icon: psychoIcon, displayName: '심리학자' },
  POLICE: { icon: policeIcon, displayName: '경찰' },
  DOCTOR: { icon: doctorIcon, displayName: '의사' },
  DETECTIVE: { icon: detectorIcon, displayName: '탐정' },
  CITIZEN: { icon: citizenIcon, displayName: '시민' },
  BULLY: { icon: achiIcon, displayName: '냥아치' },
  SARK: { icon: sarkIcon, displayName: '삵' }
};


// const TableCell = styled.td`
//   font-size: 20px; /* Adjust the font size as needed */
//   padding: 10px;
// `;

const ResultPage = () => {
  const {
    roomSession, setPlayer, setPlayers, players
  } = useRoomContext();
  const { roleAssignedArray, winner, unsubscribeRedisTopic, initGameSession, stompClient } = useGameContext();
  const navigate = useNavigate();

  useEffect(() => {
    
    initGameSession();

    // Play the resultSound when the page loads
    const audio = new Audio(resultSound);
    audio.play();

    // Cleanup function to pause and reset the audio when the component unmounts
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleAgainButtonClick = () => {
    console.log("다시하기 버튼 클릭");
    // if (roomSession.current.openviduSession) roomSession.current.openviduSession.disconnect();

    // console.log("세션 해제중입니다.....")
    // // 세션 연결 종료
    // if (roomSession.current.openviduSession) roomSession.current.openviduSession.disconnect();
    
    // 데이터 초기화
    // setPlayer.current = {};
    // setPlayers(new Map());
    // players.current = new Map();
    roomSession.current.gameId = undefined;
    console.log("새로운 방 만들기", roomSession.current.roomId);
    // unsubscribeRedisTopic();
    navigate(`/${roomSession.current.roomId}`); // TODO 게임 끝나고 다시하기 눌렀을 때 방을 새로 만드는 것, 바로 로비로 가도록 만들기
  };

  const handleExitButtonClick = () => {
    window.location.href = '/';
    // console.log("세션 해제중입니다.....")
    // // 세션 연결 종료
    // if (roomSession.current.openviduSession) {
    //   roomSession.current.openviduSession.disconnect();
    // }
    // if (stompClient.current !== undefined) stompClient.current = undefined;
    // // 데이터 초기화
    // // setSession(undefined);
    // setPlayer.current = {};
    // // setPlayers(new Map());
    // players.current = new Map();
    // console.log("홈으로 나가기");
    // unsubscribeRedisTopic();
    // navigate('/');
  };



  const sarkPlayers = roleAssignedArray.current.filter(playerRole => playerRole.job === '삵');
  console.log(sarkPlayers, "sarkPlayers");
  const nonSarkPlayers = roleAssignedArray.current.filter(playerRole => playerRole.job !== '삵');
  console.log(nonSarkPlayers, "nonSarkPlayers");
  return (
    <div>
    {winner === 'CITIZEN' ? (
      <Background1>
        <StyledSunsetPage>
        <ResultBox> </ResultBox>
          <ButtonContainer>
            <Logo src={logoImage} alt="로고" />
            <ReButton src={againImage} onClick={handleAgainButtonClick}></ReButton>
            <ReButton src={outImage} onClick={handleExitButtonClick}></ReButton>
          </ButtonContainer>
          <Title> 냥냥이팀 승리!</Title>
          <Table >
          <tbody>
            {nonSarkPlayers.map((playerRole, index) => (
              <TableRow key={index} even={index % 2 === 0} style={{  backgroundColor: "#f25282" }}>
                 <TableCell2>
                   {roleInfoMapping[playerRole.role].icon && (
                      <img
                        src={roleInfoMapping[playerRole.role].icon}
                        alt={`${roleInfoMapping[playerRole.role].displayName} Icon`}
                        style={{ width: '40px', height: '40px' }}
                      />
                    )}
                  </TableCell2>
                <TableCell>{playerRole.nickname}</TableCell>
                <TableCell>{roleInfoMapping[playerRole.role].displayName}</TableCell>

              </TableRow>
            ))}
            {sarkPlayers.map((playerRole, index) => (
              <TableRow key={index} even={index % 2 === 0} style={{  backgroundColor: "#ff9cb9" }}>
                 <TableCell2>
                    {roleInfoMapping[playerRole.role].icon && (
                      <img
                        src={roleInfoMapping[playerRole.role].icon}
                        alt={`${roleInfoMapping[playerRole.role].displayName} Icon`}
                        style={{ width: '40px', height: '40px' }}
                      />
                    )}
                  </TableCell2>
                <TableCell>{playerRole.nickname}</TableCell>
                <TableCell>{roleInfoMapping[playerRole.role].displayName}</TableCell>
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
          <ReButton src={againImage} onClick={handleAgainButtonClick}></ReButton>
          <ReButton src={outImage} onClick={handleExitButtonClick}></ReButton>
        </ButtonContainer>
        <Title> 삵팀 승리!</Title>
        <Table>
        <tbody>
          {sarkPlayers.map((playerRole, index) => (
            <TableRow key={index} even={index % 2 === 0} style={{  backgroundColor: "#9ed8ff" }}>
               <TableCell2>
                   {roleInfoMapping[playerRole.role].icon && (
                      <img
                        src={roleInfoMapping[playerRole.role].icon}
                        alt={`${roleInfoMapping[playerRole.role].displayName} Icon`}
                        style={{ width: '40px', height: '40px' }}
                      />
                    )}
                  </TableCell2>
              <TableCell>{playerRole.nickname}</TableCell>
              <TableCell>{roleInfoMapping[playerRole.role].displayName}</TableCell>
            </TableRow>
          ))}
          {nonSarkPlayers.map((playerRole, index) => (
            <TableRow key={index} even={index % 2 === 0} style={{  backgroundColor: "#7db1d4" }}>
               <TableCell2>
                  {roleInfoMapping[playerRole.role].icon && (
                      <img
                        src={roleInfoMapping[playerRole.role].icon}
                        alt={`${roleInfoMapping[playerRole.role].displayName} Icon`}
                        style={{ width: '40px', height: '40px' }}
                      />
                    )}
                  </TableCell2>
              <TableCell>{playerRole.nickname}</TableCell>
              <TableCell>{roleInfoMapping[playerRole.role].displayName}</TableCell>
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
