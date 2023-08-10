import React from 'react';
import styled from 'styled-components';
import startButtonImageSrc from '../../img/startbutton.png';

const StartButtonImage = styled.img`
  width: 100%;
  height: 100%;
  cursor: pointer;
  margin-top: 30px;
  &:hover {
    filter: brightness(0.8);
    
  }
`;

const StartButton = ({ src, alt, onClick }) => {
  return <StartButtonImage src={startButtonImageSrc} alt={alt} onClick={onClick} />;
};

export default StartButton;
