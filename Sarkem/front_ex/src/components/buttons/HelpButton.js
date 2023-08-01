import React, { useState } from 'react';
import styled from 'styled-components';
import helpbutton from '../../img/helpbutton.png';
import helpbuttonoff from '../../img/helpbuttonoff.png';

const HelpButtonImage = styled.img`
  width: 60px;
  height: 60px;
  cursor: pointer;
  position: absolute;
  right: 4%;
  top: 4.5%;
  overflow: visible;
  z-index: 1;
`;


const HelpButton = ({ alt, onClick, isHelpOn }) => {
  return (
    <HelpButtonImage
      src={isHelpOn ? helpbutton : helpbuttonoff}
      alt={alt}
      onClick={onClick} // 클릭 이벤트를 핸들링하는 함수 변경
    />
  );
};

export default HelpButton;


