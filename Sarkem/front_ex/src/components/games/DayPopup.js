import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useGameContext } from '../../GameContext';

const fadeInOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const StyledPopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #f3b7bf;
  border-radius: 30.94px;
  border: 5.16px solid #000000;
  padding: 61.87px;
  display: flex;
  flex-direction: column;
  gap: 12.89px;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 5.16px 5.16px 0px rgba(0, 0, 0, 0.25), 10.31px 10.31px 0px 0px rgba(0, 0, 0, 1);
  z-index: 9999;
  opacity: ${({ showPopup }) => (showPopup ? 1 : 0)};
  animation: ${fadeInOut} 4s ease-in-out forwards;
`;

const StyledPopupTitle = styled.div`
  color: #ffffff;
  font-size: 42px;
  font-family: "RixInooAriDuri", sans-serif;
  text-align: center;
  text-shadow: 1px 1px black;
  -webkit-text-stroke: 1px black;
  text-stroke: 1px black;
  padding: 10px;
`;

const DayPopup = ({ sysMessage }) => { // sysMessage를 prop으로 받도록 수정
  const [showPopup, setShowPopup] = useState(false);
  // console.log(sysMessage);
  useEffect(() => {
    if (sysMessage) {
      setShowPopup(true);

      const fadeOutTimeout = setTimeout(() => {
        setShowPopup(false);
      }, 3500);

      return () => clearTimeout(fadeOutTimeout);
    }
  }, [sysMessage]);
  console.log(sysMessage);
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
            bottom: 'calc(50% + 100px)',
            right: '110px',
          }}
        >
          N일차 낮
        </div>
      </div>
      <StyledPopupTitle>{sysMessage?.param?.message}</StyledPopupTitle>
    </StyledPopupContainer>
  );
};

export default DayPopup;
