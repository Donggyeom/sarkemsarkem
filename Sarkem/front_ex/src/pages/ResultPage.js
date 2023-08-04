import React from 'react';
import '../index.css';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundSunset';
import ReButton from '../components/buttons/reButton';
import ResultBox from '../components/games/ResultBox';
import logoImage from '../img/logo.png';
import { useNavigate } from 'react-router-dom';
import { useRoomContext } from '../Context';
import createRandomId from '../utils';

const StyledSunsetPage = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  align-items: center; /* 가로 방향에서 중앙에 정렬 */
  
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
  bottom: 35px; /* 하단으로부터 20px 띄워서 정렬 */
  right: 20px; /* 우측으로부터 20px 띄워서 정렬 */
  display: flex;
  flex-direction: column; /* 요소들을 세로로 정렬 */
  gap: 10px;
`;

const Title = styled.div`
  position: absolute;
  top: 90px; /* 다른 요소들보다 위에 위치하도록 조정 */
  left: 50%; /* 가운데 정렬 */
  transform: translateX(-50%); /* 가운데 정렬을 위한 이동값 설정 */
  font-size: 75px; /* 폰트 크기 설정 */
  color: #ffffff;
  text-shadow: 1px 1px black;
  -webkit-text-stroke: 3px black; /* For webkit-based browsers like Chrome, Safari */
  text-stroke: 5px black; /* Standard property for future compatibility */
`;

const TextAbove = styled.div`
  // width: 200%
  font-size: 40px;
  color: #333;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 30.94px;
  border-style: solid;
  border-color: #000000;
  border-width: 5.16px;
  padding: 13px;
  display: flex;
  align-items: center; /* 세로 중앙 정렬을 위해 수정 */
  justify-content: flex-start; /* 가로 시작부터 정렬 */
  margin-bottom: 10px; /* 여백을 추가해 줍니다. */
`;

const TextAboveWrapper = styled.div`
  position: absolute;
  top: 58%; /* 화면 세로 중앙에 위치 */
  left: 50%; /* 화면 가로 중앙에 위치 */
  transform: translate(-50%, -50%); /* 정확한 중앙 정렬 */
  box-sizing: border-box;
  background: none;
  border-radius: 30.94px;
  // border-style: solid;
  // border-color: #000000;
  border-width: 5.16px;
  padding: 13px;
  display: flex;
  flex-direction: column; /* 세로로 정렬되도록 설정 */
  align-items: center; /* 내부 컨텐츠를 수평 가운데 정렬 */
  max-height: 62%;
  max-width: 80%;
  overflow-x: auto;
  z-index: 1;
`;


const ResultPage = () => {
  const { setPublisher, setSubscribers, setCamArray, session, setSession} = useRoomContext(); 
  const navigate = useNavigate();

  const handleAgainButtonClick = () => {

    console.log("세션 해제중입니다.....")
    // 세션 연결 종료
    if (session) session.disconnect();
    
    // 데이터 초기화
    setSession(undefined);
    setSubscribers([]);
    setPublisher(undefined);
    setCamArray([]);
    console.log("새로운 방 만들기")
    navigate(`/${createRandomId()}`, { state: { isHost: true } });
  };

  const handleExitButtonClick = () => {
    console.log("세션 해제중입니다.....")
    // 세션 연결 종료
    if (session) session.disconnect();
    
    // 데이터 초기화
    setSession(undefined);
    setSubscribers([]);
    setPublisher(undefined);
    setCamArray([]);
    console.log("홈으로 나가기")
    navigate('/');
  };

  return (
    <Background>
      <StyledSunsetPage>
        <ResultBox> </ResultBox>
        <ButtonContainer>
          <Logo src={logoImage} alt="로고" />
          {/* 지금 함수 적용 안되는중. button 클릭할 때 세션 삭제되고 navigate 자동으로 돼서.
          근데 함수에서 navigate 삭제하면 그냥 아무것도 안돼서... 일단 보류함 */}
          <ReButton onClick={handleAgainButtonClick}>다시하기</ReButton>
          <ReButton onClick={handleExitButtonClick}>나가기</ReButton>
        </ButtonContainer>
        <Title> 냥냥이팀 승리!</Title>
        {/* Title; 무슨 팀이 승리했는지 변수로 받아오세요.......... */}
        <TextAboveWrapper>

          {/* 실제로 데이터 받을 때는 for문 돌려서 for 0~5 */}
          <TextAbove>LOSE | 김냥냥 | 삵</TextAbove>
          <TextAbove>WIN | 김수한무 | 냥아치</TextAbove>
          <TextAbove>WIN | 냥214 | 심리학자</TextAbove>
          <TextAbove>WIN | 김민석 | 댄스머신</TextAbove>
          <TextAbove>WIN | 김신일 | 원피스</TextAbove>
          {/* 실제로 데이터 받을 때는 for문 돌려서 for 5~N */}
          <TextAbove>WIN | 박현철 | 락앤롤</TextAbove>
          <TextAbove>WIN | 김동겸 | 사진 다흔들림</TextAbove>
          <TextAbove>WIN | 이예슬 | 집가고싶음</TextAbove>
          <TextAbove>WIN | 박시원 | 화면 죽이는중</TextAbove>
          <TextAbove>WIN | 임혜진 | 캠 죽이는중</TextAbove>
        </TextAboveWrapper>
      </StyledSunsetPage>
    </Background>
  );
};

export default ResultPage;
