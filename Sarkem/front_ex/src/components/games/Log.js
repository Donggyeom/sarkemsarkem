import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import chatbox from '../../img/helpbox2.png';
import { useGameContext } from '../../GameContext';

const ChatContainer = styled.div`
  background-image: url(${chatbox});
  background-size: cover;
  background-color: transparent;
  background-repeat: no-repeat;
  width: 380px;
  height: 350px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  font-family: 'NeoDunggeunmoPro-Regular', sans-serif;
  position: absolute;
  top: 540px;
  left: 200px;
  transform: translate(-50%, -50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScrollableText = styled.div`
  max-height: 75%;
  height: 60%;
  overflow: auto;
  line-height: 1.2; /* Adjust the value as needed */
  margin-left: 2%;
`;

const Log = () => {
  const { currentSysMessagesArray } = useGameContext();
  console.log(currentSysMessagesArray);

  const scrollableRef = useRef(null); // Ref for the scrollable container

  // Scroll to the bottom on update
  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, [currentSysMessagesArray]);

  return (
    <ChatContainer >
      <h3> —̳͟͞💗  —̳͟͞💗 ˚ GAME LOG —̳͟͞💗  —̳͟͞💗 ˚</h3>
      <ScrollableText ref={scrollableRef}>
      {currentSysMessagesArray.map((sysMessage, index) => (
        <div key={index}>
          {sysMessage.param.phase}: {sysMessage.param.message} 
        </div>
      ))}
      </ScrollableText>
    </ChatContainer>
  );
};

export default Log;
