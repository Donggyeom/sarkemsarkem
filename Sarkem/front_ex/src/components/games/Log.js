import React from 'react';
import styled from 'styled-components';
import chatbox from '../../img/helpbox2.png';
import { useGameContext } from '../../GameContext';

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
  font-family: 'NeoDunggeunmoPro-Regular', sans-serif;
  position: fixed;
  top: ${props => props.top};
  left: ${props => props.left};
  transform: translate(-50%, -50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScrollableText = styled.div`
  max-height: 75%;
  overflow: auto;
  line-height: 1.5; /* Adjust the value as needed */
`;

const Log = ({ top, left }) => {
  const { currentSysMessagesArray } = useGameContext();
  console.log(currentSysMessagesArray);
  return (
    <ChatContainer top={top} left={left}>
      <h3> —̳͟͞💗  —̳͟͞💗 ˚ GAME LOG —̳͟͞💗  —̳͟͞💗 ˚</h3>
      <hr></hr>
      <ScrollableText>
      {currentSysMessagesArray.map((sysMessage, index) => (
        <div key={index}>
          {/* {sysMessage.param.day} 일차 {sysMessage.param.phase}: {sysMessage.param.message} */}
          {sysMessage.param.phase}: {sysMessage.param.message} 
        </div>
      ))}
      </ScrollableText>
    </ChatContainer>
  );
};

export default Log;
