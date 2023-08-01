import React, { useState } from 'react';
import styled from 'styled-components';
import Chatting from '../../pages/Chatting';
import chatbuttonImage from '../../img/chatbutton.png';
import chatoffbuttonImage from '../../img/chatoffbutton.png';

const ChatButton = styled.button`
  width: 60px;
  height: 60px;
  cursor: pointer;
  position: absolute;
  right: 30px;
  background-color: transparent;
  bottom: 20px;
  background-image: url(${props => props.showPopup ? chatoffbuttonImage : chatbuttonImage});
  background-size: cover;
  background-repeat: no-repeat;
  z-index: ${props => (props.showPopup ? '-1' : '1')};
`;

const ChatPopup = styled.div`
  position: fixed;
  bottom: 20px;
  right: 70px;
  width: 400px;
  height: 450px;
  border-radius: 5px;
  opacity: 0.8;
  // z-index: 1; // Set higher z-index when the popup is open
`;

const ChatButtonAndPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleChatButtonClick = () => {
    setShowPopup((prevShowPopup) => !prevShowPopup); // Toggle the popup visibility
  };

  const handleCloseButtonClick = () => {
    setShowPopup(false); // Close the popup when the close button is clicked
  };

  const handleSendMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };


  return (
    <>
      {showPopup && (
        <ChatPopup style={{ bottom: '100px', right: '200px' }}>
                   <Chatting
            handleCloseButtonClick={handleCloseButtonClick}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </ChatPopup>
      )}
      <ChatButton
        style = {{ border : 'none' }}
        showPopup={showPopup}
        onClick={handleChatButtonClick}
      ></ChatButton>
    </>
  );
};

export default ChatButtonAndPopup;