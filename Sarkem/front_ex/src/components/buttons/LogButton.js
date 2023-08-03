import React, { useState } from 'react';
import styled from 'styled-components';
import logbutton from '../../img/logbutton.png';
import logbuttonoff from '../../img/logbuttonoff.png';

const LogButtonImage = styled.img`
  width: 60px;
  height: 60px;
  cursor: pointer;
  position: absolute;
  left: 30px;
  top: 290px;
  overflow: visible;
  z-index: 1;
`;


const LogButton = ({ alt, onClick, isLogOn }) => {
  return (
    <LogButtonImage
      src={isLogOn ? logbutton : logbuttonoff}
      alt={alt}
      onClick={onClick} // 클릭 이벤트를 핸들링하는 함수 변경
    />
  );
};

export default LogButton;


