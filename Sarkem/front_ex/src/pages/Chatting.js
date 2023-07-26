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
  position: relative; // Add this to enable positioning of ChatCloseButton
`;

const ChatMessage = styled.div`
  background-image: url(${chatsenderImage});
  background-size: cover;
  background-repeat: no-repeat;
  margin-bottom: 10px;
  padding: 12px;
  border-radius: 5px;
  width: fit-content;
  max-width: 80%;
  position: relative;
  margin-left : auto;
  margin-right : 10px;
`;

const ChatMessages = styled.div`
  margin: 10px;
  opacity: 0.8;
  flex: 1;
  display: flex;
  overflow-y : auto;
  max-height : 110%;
  flex-direction: column;
  padding: 10px;
  border-radius: 5px;
`;

const ChatInputWrapper = styled.div`
  margin: 10px;
  display: flex;
  height: 15%;
  align-items: center;
  margin-top: auto;
`;

const ChatInput = styled.input`
  margin-left: 10px;
  background-image: url(${chatinputboxImage});
  background-size: cover;
  height: 35px;
  width : 78%;
  border: none;
  border-radius: 5px;
`;

const ChatButton = styled.button`
  background-image: url(${chatsendbuttonImage});
  background-size: cover;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  width: 35px;
  height : 35px;
  position : absolute;
  bottom : 38px;
  right: 78px;
`;

const ChatCloseButton = styled.button`
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
  const [messages, setMessages] = useState([]);
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
      setMessages((prevMessages) => [...prevMessages, inputMessage]);
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