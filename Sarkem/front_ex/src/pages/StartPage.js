import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Background from '../components/backgrounds/BackgroundSunset';
import StartButton from '../components/buttons/StartButton';
import Logo from '../components/buttons/Logo';


const StyledStartPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const StartPage = () => {
  // ... (rest of your code)

  // 여기에서 host 여부를 조건에 맞게 설정합니다. 예시로 host가 true인 경우를 기본값으로 설정합니다.
  const isHost = true;

  // isHost에 따라 다른 경로로 이동합니다.
  const getHostLink = isHost ? '/start/host' : '/start/unhost';

  return (
    <Background>
      <StyledStartPage>
        <Logo />
        <StartButton alt="Go to Login" onClick={() => (window.location.href = getHostLink)} />
      </StyledStartPage>
    </Background>
  );
};

export default StartPage;