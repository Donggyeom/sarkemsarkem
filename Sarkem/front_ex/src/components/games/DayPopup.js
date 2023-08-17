import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGameContext } from '../../GameContext';
import closeBtn from '../../img/btn_close.png';



const StyledPopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #f3b7bf;
  border-radius: 30.94px;
  border: 5.16px solid #000000;
  padding: 61.87px;
  height: 180px; /* Set a fixed height for the popup box */
  width: 650px;
  display: flex;
  flex-direction: column;
  gap: 12.89px;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 5.16px 5.16px 0px rgba(0, 0, 0, 0.25), 10.31px 10.31px 0px 0px rgba(0, 0, 0, 1);
  z-index: ${({ showPopup }) => (showPopup ? 9999 : -1)};
  opacity: ${({ showPopup }) => (showPopup ? 1 : 0)};
  `;

const StyledPopupTitle = styled.div`
  color: #ffffff;
  font-size: 35px;
  font-family: "RixInooAriDuriR";
  text-align: center;
  text-shadow: 1px 1px black;
  -webkit-text-stroke: 1px black;
  text-stroke: 1px black;
  padding: 10px;
`;

const CloseBtn = styled.img`
  width: 15%;
  position: fixed;
  top: 85%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StyledButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const DayPopup = ({ sysMessage, dayCount }) => { // sysMessage를 prop으로 받도록 수정
  const [showPopup, setShowPopup] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const totalMessages = Array.isArray(sysMessage) ? sysMessage.length : 0;
  const {setDayCurrentSysMessagesArray } = useGameContext();

  useEffect(() => {
    if (sysMessage) {
      setShowPopup(true);
      setCurrentPageIndex(0);
    }
  }, [sysMessage]);

  const formattedMessages = sysMessage?.map((messageItem) => {
    return messageItem.param.message.split('.').map((sentence, index) => (
      <React.Fragment key={index}>
        {index > 0 && <br />}
        {sentence.trim()}
        {index < messageItem.param.message.split('.').length - 1 && '.'}
      </React.Fragment>
    ));
  });

  const handleNextPage = () => {
    setCurrentPageIndex((prevIndex) => Math.min(prevIndex + 1, totalMessages - 1));
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setDayCurrentSysMessagesArray([]);
  };
  return (
    <StyledPopupContainer showPopup={showPopup}>
      <div
        style={{
          flexShrink: '0',
          width: '59.29px',
          height: '0.01px',
          position: 'relative',
          transformOrigin: '0 0',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: '72.18px',
            borderStyle: 'solid',
            borderColor: '#000000',
            borderWidth: '5.16px',
            padding: '10.31px 21.91px 10.31px 21.91px',
            display: 'flex',
            flexDirection: 'row',
            gap: '12.89px',
            alignItems: 'center',
            justifyContent: 'center',
            width: '229.44px',
            height: '45px',
            position: 'relative',
            // bottom: 'calc(50% + 100px)',
            top: '-120px',
            right: '110px',
          }}
        >
          {dayCount}일차 낮
        </div>
      </div>
      <StyledPopupTitle>{formattedMessages[currentPageIndex]}</StyledPopupTitle>
      {Array.isArray(sysMessage) && totalMessages > 0 && (
        <div>
          <StyledButton onClick={() => {
            if (currentPageIndex === totalMessages - 1) {
              handleClosePopup(); // Execute handleClosePopup if it's the last message
            } else {
              handleNextPage(); // Otherwise, go to the next message
            }
          }}>
            <CloseBtn src={closeBtn} alt="Close" />
          </StyledButton>
        </div>
      )}
    </StyledPopupContainer>
  );
};

export default DayPopup;
