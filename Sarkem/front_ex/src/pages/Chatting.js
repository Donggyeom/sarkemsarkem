import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import chatbox from '../img/chatbox.png';
import chatinputboxImage from '../img/chatinputbox.png';
import chatsendbuttonImage from '../img/chatsendbutton.png';
import chatsenderImage from '../img/chatsender.png';
import chatcloseImage from '../img/closebutton.png'

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

const headerWrapper = styled.div`
  position: relative;
`;

const ChatWrapper = styled.div`
  top : 48px;
  max-height : 300px;
  padding : 20px;
  max-width : 530px;
  position: relative; // Add this to enable positioning of ChatCloseButton
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

const ChatInputWrapper = styled.div`
  margin: 10px;
  display: flex;
  height: 10%;
  align-items: center;
  margin-top: auto;
`;

const ChatInput = styled.input`
  background-color: transparent;
  margin-left: 10px;
  background-image: url(${chatinputboxImage});
  background-size: cover;
  width : 80%;
  height : 100%;
  border: none;
  position : relative;
`;

const ChatButton = styled.button`
  background-color: transparent;
  background-image: url(${chatsendbuttonImage});
  background-size: cover;
  background-repeat: no-repeat;
  border: none;
  margin-left : 10px;
  cursor: pointer;
  width : 10%;
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

const Chatting = ({ handleCloseButtonClick, messages, onSendMessage }) => {
  const [inputMessage, setInputMessage] = useState('');
  const chatMessagesRef =useRef();
  

  const scrollToBottom = () =>{
    chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      onSendMessage(inputMessage); // Send the message to the parent component
      setInputMessage('');
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
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
          {messages.map((message, index) => (
            <ChatMessage key={index}>{message}</ChatMessage>
          ))}
        </ChatMessages>
      </ChatWrapper>
      <ChatInputWrapper>
        <ChatInput
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          placeholder="메세지를 입력하세요..."
        />
        <ChatButton onClick={handleSendMessage}></ChatButton>
      </ChatInputWrapper>
    </ChatContainer>
  );
};

export default Chatting;
