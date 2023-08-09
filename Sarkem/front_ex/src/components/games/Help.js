import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import chatbox from '../../img/helpbox2.png';
import chatcloseImage from '../../img/closebutton.png'


const ChatContainer = styled.div`
  background-image: url(${chatbox});
  background-size: cover;
  background-color: transparent;
  background-repeat: no-repeat;
  width: 580px;
  height: 540px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  font-family: 'NeoDunggeunmoPro-Regular', sans-serif; // SUITE-Regular 폰트를 적용
  position: fixed;
  top: ${props => props.top};
  left: ${props => props.left};
  transform: translate(-50%, -50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
`;


const Help = ({ top, left }) => {

  return (
    <ChatContainer top={top} left={left}>
      <h3> —̳͟͞💗  —̳͟͞💗 ˚   삵음삵음 게임 방법 —̳͟͞💗  —̳͟͞💗 ˚</h3>
      <span style={{ display: 'block' }}>평화로운 고양이 마을에 숨어든 삵을 찾아라!</span>
      <br></br>
      <br></br>
      <span style={{ display: 'block' }}>🐾 직업 🐾 </span>
      <span style={{ display: 'block' }}>로비의 직업 카드에 마우스를 올리면 설명을 볼 수 있다냥.</span>
      <span style={{ display: 'block' }}>직업 수와 플레이어 수가 일치해야 게임을 시작할 수 있다냥.</span>
      <span style={{ display: 'block' }}>삵 이외의 모든 직업은 고양이 팀이다냥.</span>
      <span style={{ display: 'block' }}>첫째 날 낮에 자동으로 직업을 배정받게 된다냥.</span>
      <span style={{ display: 'block' }}>자신의 정체를 쉽게 드러내서는 안 된다냥... 전략적으로 생각하라냥!</span>
      <span style={{ display: 'block' }}>본인의 특수 능력을 잘 수행하여 팀을 승리로 이끌라냥!</span>
      <br></br>
      <span style={{ display: 'block' }}>🐾 게임 진행 🐾</span>
      <span style={{ display: 'block' }}>낮, 저녁, 밤 순서로 진행된다냥.</span>
      <span style={{ display: 'block' }}>낮에는 회의를 통해 삵을 찾아내라냥. </span>
      <span style={{ display: 'block' }}>저녁에는 삵 의심자의 최후의 변론을 듣고 추방 여부를 투표하라냥.</span>
      <span style={{ display: 'block' }}>밤에는 다양한 직업의 고양이들이 특수 능력을 수행한다냥.</span>
      <br/>
      <span style={{ display: 'block' }}>🐾 게임 종료 🐾 </span>
      <span style={{ display: 'block' }}>고양이 승리 조건: 낮 투표를 통해 삵을 모두 추방한 경우다냥!</span>
      <span style={{ display: 'block' }}>삵 승리 조건: 고양이의 수와 삵의 수가 동일한 경우다냥!</span>
      <br></br>
    </ChatContainer>
        
  );
};

export default Help;
