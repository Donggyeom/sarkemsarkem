import React from 'react';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundSunset';
import ReButton from '../components/buttons/reButton';
import ResultBox from '../components/games/ResultBox';
import logoImage from '../img/logo.png';
import { useNavigate } from 'react-router-dom';
import createRandomId from '../utils';

const StyledSunsetPage = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
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
  -webkit-text-stroke: 1px black; /* For webkit-based browsers like Chrome, Safari */
  text-stroke: 1px black; /* Standard property for future compatibility */


  // box-sizing: border-box;
  // background: none;
  // border-radius: 20px;
  // border-style: dashed;
  // border-color: gray;
  // border-width: 5.16px;
  // padding: 10px;
`;


const ResultPage = () => {
  const navigate = useNavigate();

  const handleAgainButtonClick = () => {
    navigate(`/${createRandomId()}`, { state: { isHost: true } });
  };

  const handleExitButtonClick = () => {
    navigate('/');
  };

  return (
    <Background>
      <StyledSunsetPage>
        <ResultBox> </ResultBox>
        <ButtonContainer>
          <Logo src={logoImage} alt="로고" />
          <ReButton onClick={handleAgainButtonClick}>다시하기</ReButton>
          <ReButton onClick={handleExitButtonClick}>나가기</ReButton>
        </ButtonContainer>
        <Title> 냥냥이팀 승리!</Title>
        {/* Title; 무슨 팀이 승리했는지 변수로 받아오세요.......... */}

      </StyledSunsetPage>
    </Background>
  );
};

export default ResultPage;
