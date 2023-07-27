import React from 'react';
import styled from 'styled-components';
import startButtonImageSrc from '../../img/startbutton.png';

const StartButtonImage = styled.img`
  width: 100%;
  height: 100%;
`;

const StartButton = ({ src, alt, onClick, url }) => {
  return <StartButtonImage src={startButtonImageSrc} alt={alt} onClick={onClick} />;
};

export default StartButton;
