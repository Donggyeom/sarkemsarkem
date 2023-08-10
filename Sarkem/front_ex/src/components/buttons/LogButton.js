import React from 'react';
import styled from 'styled-components';
import logbuttonImageSrc from '../../img/logbutton.png';
import logbuttonOffImageSrc from '../../img/logbuttonoff.png';
import ingameClickSound from '../../sound/ingameclick.mp3';

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
  const handleClick = () => {
    const clickAudio = new Audio(ingameClickSound);
    clickAudio.play();
    onClick(); // Call the provided onClick handler from the parent component
  };

  return (
    <LogButtonImage
      src={isLogOn ? logbuttonImageSrc : logbuttonOffImageSrc}
      alt={alt}
      onClick={handleClick} // Use the handleClick function
    />
  );
};

export default LogButton;