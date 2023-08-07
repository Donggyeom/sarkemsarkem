import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    display: none; /* 팝업이 완전히 사라지도록 display 속성을 none으로 설정 */
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
  animation: ${fadeInOut} 4s ease-in-out forwards; /* 4초 동안 fade-in, fade-out 애니메이션 적용, forwards 속성 추가 */
`;

const StyledPopupTitle = styled.div`
  color: #ffffff;
  font-size: 42px;
  font-family: "RixInooAriDuriR", sans-serif;
  text-align: center;
  text-shadow: 1px 1px black;
`;

const NotFoundButton = ({ showPopup }) => {
  return showPopup ? (
    <StyledPopupContainer showPopup={showPopup}>
      <StyledPopupTitle>잘못된 경로입니다.</StyledPopupTitle>
    </StyledPopupContainer>
  ) : null;
};

export default NotFoundButton;
