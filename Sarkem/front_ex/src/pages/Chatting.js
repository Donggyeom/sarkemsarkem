import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import chatbox from '../img/chatbox.png';
import chatinputboxImage from '../img/chatinputbox.png';
import chatsendbuttonImage from '../img/chatsendbutton.png';
import chatsenderImage from '../img/chatsender.png';
import chatcloseImage from '../img/closebutton.png';
import { useGameContext } from '../GameContext';
import { useRoomContext } from '../Context';
import receiverboxImage from '../img/receiverbox.png';


const ChatContainer = styled.div`
  background-image: url(${chatbox});
  background-size: cover;
  background-color: transparent;
  background-repeat: no-repeat;
  width: 550px;
  height: 500px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  position : relative;
`;


const ChatWrapper = styled.div`
  top : 48px;
  max-height : 300px;
  padding : 20px;
  max-width : 530px;
  position: relative;
`;

const ChatMessage = styled.div`
  word-wrap : break-word; // 문자 수가 많아지면 가로로 넘어가는 현상 해결하기위함
  max-width: 60%; // 문자 수가 많아지면 가로로 넘어가는 현상 해결하기위함
  background-color: transparent;
  background-image: url(${chatsenderImage});
  background-size: cover;
  background-repeat: no-repeat;
  margin-bottom: 10px;
  padding: 12px;
  border-radius: 5px;
  width: fit-content;
  position: relative;
  margin-left: auto;
  margin-right: 10px;
  font-family: 'SUITE-Regular', sans-serif; // SUITE-Regular 폰트를 적용
`;

const ChatMessages = styled.div`
  margin: 10px;
  opacity: 0.8;
  flex: 1;
  display: flex;
  overflow-y : auto;
  max-height : 110%;
  flex-direction: column;
  border-radius: 5px;
`;

const ChatReceiverMessage = styled.div`
  word-wrap : break-word; // 문자 수가 많아지면 가로로 넘어가는 현상 해결하기위함
  max-width: 60%; // 문자 수가 많아지면 가로로 넘어가는 현상 해결하기위함
  background-color: transparent;
  background-image: url(${receiverboxImage});
  background-size: cover;
  background-repeat: no-repeat;
  margin-bottom: 10px;
  padding: 12px;
  border-radius: 5px;
  width: fit-content;
  position: relative;
  // margin-left: auto;
  margin-right: 10px;
  font-family: 'SUITE-Regular', sans-serif;
`;

const ChatInputWrapper = styled.div`
  margin: 10px;
  display: flex;
  height: 10%;
  justify-content : space-between;
  align-items: center;
  margin-top: auto;
`;

const ChatInput = styled.input`
  flex : 0.85;
  background-color: transparent;
  margin-left: 5%;
  background-image: url(${chatinputboxImage});
  background-repeat : no-repeat;
  background-size: auto 100%;
  // width : 95%;
  height : 100%;
  border: none;
  position : relative;
`;

const ChatButton = styled.button`
  flex : 0.09;
  background-color: transparent;
  background-image: url(${chatsendbuttonImage});
  background-size:  95% auto;
  background-repeat: no-repeat;
  margin-right : 5%;
  border: none;
  cursor: pointer;
  height : 100%;
  position : relative;
`;

const ChatCloseButton = styled.button`
  background-color: transparent;
  background-image: url(${chatcloseImage});
  background-size: cover;
  width: 35px;
  height: 35px;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 28px;
  right: 38px;
  z-index: 1;
`;

  const Chatting = ({ handleCloseButtonClick }) => {
    const { chatMessages, sendMessage} = useGameContext();
    const { token } = useRoomContext();
    const [inputMessage, setInputMessage] = useState('');
    const chatMessagesRef = useRef();
  
    const scrollToBottom = () => {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [chatMessages]);

  
    const handleSendMessage = () => {
      console.log("메세지보내는중");
      sendMessage(inputMessage);
      console.log(inputMessage);
      console.log(chatMessages);
      setInputMessage('');
    };
  
    const handleInputChange = (e) => {
      setInputMessage(e.target.value);
    };
  
    const handleInputKeyPress = (e) => {
      console.log('handleInputKeyPress');
      console.log(e);
      if (e.key === 'TALK') {
        handleSendMessage();
      }
    };

    return (
      <ChatContainer>
        <headerWrapper>
          <ChatCloseButton onClick={handleCloseButtonClick}></ChatCloseButton>
        </headerWrapper>
        <ChatWrapper>
        <ChatMessages ref={chatMessagesRef}>
  {chatMessages.map((messageObj, index) => {
    console.log('messageObj.playerId:', messageObj.playerId);
    console.log('token:', token);
    return (
      messageObj.playerId === token ? (
        <ChatMessage key={index}>
          {messageObj.message}
        </ChatMessage>
      ) : (
        <ChatReceiverMessage key={index}>
          {messageObj.message}
        </ChatReceiverMessage>
      )
    );
  })}
</ChatMessages>
        </ChatWrapper>
        <ChatInputWrapper>
          <ChatInput
            type="text"
            img={chatinputboxImage}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            placeholder="메세지를 입력하세요..."
          />
          <ChatButton onClick={handleSendMessage}></ChatButton>
        </ChatInputWrapper>
      </ChatContainer>
    );
}

export default Chatting;
