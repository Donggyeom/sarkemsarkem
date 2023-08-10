import React from 'react';
import styled from 'styled-components';
import camButtonImageSrc from '../../img/cambutton.png';
import camOffButtonImageSrc from '../../img/camoffbutton.png';
import muteSound from '../../sound/mute.mp3';
import unmuteSound from '../../sound/unmute.mp3';

const CamButtonImage = styled.img`
  width: 60px;
  height: 60px;
  cursor: pointer;
  position: absolute;
  left: 30px;
  top: 150px;
  overflow: visible;
  z-index: 1;
`;

const CamButton = ({ alt, isCamOn, onClick }) => {
  const handleClick = () => {
    if (isCamOn) {
      const muteAudio = new Audio(muteSound);
      muteAudio.play();
    } else {
      const unmuteAudio = new Audio(unmuteSound);
      unmuteAudio.play();
    }
    onClick(); // Call the provided onToggle handler from the parent component
  };

  return (
    <CamButtonImage
      src={isCamOn ? camButtonImageSrc : camOffButtonImageSrc}
      alt={alt}
      onClick={handleClick} // Use the handleClick function
    />
  );
};

export default CamButton;
