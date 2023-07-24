/* eslint-disable */

import React from 'react';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundDay';
/* Code generated with AutoHTML Plugin for Figma */
import CamButton from '../components/buttons/CamButton';
import MicButton from '../components/buttons/MicButton';
import SunMoon from '../components/games/SunMoon';
import ScMini from '../components/games/ScMini';

const StyledDayPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative; /* position을 relative로 설정합니다. */
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const TimeSecond = styled.text`
    color: #000000;
    text-align: left;
    font: 400 42px "ONE Mobile POP", sans-serif;
    position: absolute; /* position을 absolute로 설정합니다. */
    left: 22px; /* 원하는 위치 값을 지정합니다. */
    top: 90px; /* 원하는 위치 값을 지정합니다. */
`;

const handleCamButtonClick = () => {
    // 버튼이 클릭되었을 때 실행되어야 할 작업을 여기에 정의
    console.log('Cam Button clicked!');
};

const handleMicButtonClick = () => {
    // 버튼이 클릭되었을 때 실행되어야 할 작업을 여기에 정의
    console.log('Mic Button clicked!');
};

const handleScMiniClick = () => {
    // 버튼이 클릭되었을 때 실행되어야 할 작업을 여기에 정의
    console.log('ScMini clicked!');
};

const DayPage = () => {
    
    return (
    <Background>
        <StyledDayPage>
            <SunMoon alt="SunMoon"></SunMoon>
            <TimeSecond>60s</TimeSecond>
            <CamButton alt="Camera Button" onClick={handleCamButtonClick} />
            <MicButton alt="Mic Button" onClick={handleMicButtonClick} />
            <ScMini alt="ScMini Button" onClick={handleScMiniClick}></ScMini>
            
        </StyledDayPage>
    </Background>
  );
};

export default DayPage;
