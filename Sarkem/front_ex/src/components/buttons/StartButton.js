import React from 'react';
import styled from 'styled-components';
import startButtonImageSrc from '../../img/startbutton.png';
import buttonclickSound from '../../sound/buttonclick.mp3'

const StartButtonImage = styled.img`
  width: 100%;
  height: 100%;
  cursor: pointer;
  &:hover {
    filter: brightness(0.8);
    
  }
`;

const StartButton = ({ alt, onClick }) => {
  const handleClick = () => {
    const sound = new Audio(buttonclickSound);
    sound.play();
    onClick(); // Call the provided onClick handler from the parent component
  };
  return <StartButtonImage src={startButtonImageSrc} alt={alt} onClick={handleClick} />;
};

export default StartButton;
