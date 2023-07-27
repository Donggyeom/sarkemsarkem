import React from 'react';
import styled from 'styled-components';

import Background from '../components/backgrounds/BackgroundSunset';
import StartButton from '../components/buttons/StartButton';
import Logo from '../components/buttons/Logo';
import { useNavigate }  from 'react-router-dom';
import createRandomId from '../utils';
import { useRoomContext } from '../Context';
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
  const {setIsHost} = useRoomContext();
  // useNavigate 호출
  const navigate = useNavigate();

  // 랜덤한 16진수 5자리를 생성하여 URL로 넘겨줍니다.
  const goToCreateRoom = () => {
    setIsHost(()=>true);
    navigate(`/${createRandomId()}`)
  }

  return (
    <Background>
      <StyledStartPage>
        <Logo />
        <StartButton alt="Go to Login" onClick={goToCreateRoom} />
      </StyledStartPage>
    </Background>
  );
};

export default StartPage;