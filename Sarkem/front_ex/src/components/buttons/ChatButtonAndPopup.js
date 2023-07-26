import React, { useState } from 'react';
import styled from 'styled-components';
import Chatting from '../../pages/Chatting';
import chatbuttonImage from '../../img/chatbutton.png';

const ChatButton = styled.button`
  background-image: url(${chatbuttonImage});
  background-size: cover;
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;

const ChatPopup = styled.div`
  /* Chat popup style */
  position: fixed;
  bottom: 20px;
  right: 70px;
  width: 400px;
  height: 450px;
  border-radius: 5px;
  opacity: 0.8;
`;

const ChatButtonAndPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleChatButtonClick = () => {
    setShowPopup((prevShowPopup) => !prevShowPopup); // Toggle the popup visibility
  };

  const handleCloseButtonClick = () => {
    setShowPopup(false); // Close the popup when the close button is clicked
  };

  return (
    <>
      {showPopup && (
        <ChatPopup style={{ bottom: '100px', right: '200px' }}>
          <Chatting handleCloseButtonClick={handleCloseButtonClick} />
        </ChatPopup>
      )}
      <ChatButton style={{ bottom: '20px', right: '20px' }} onClick={handleChatButtonClick}></ChatButton>
    </>
  );
};

export default ChatButtonAndPopup;