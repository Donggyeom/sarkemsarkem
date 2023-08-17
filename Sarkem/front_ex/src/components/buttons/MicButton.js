import React from 'react';
import styled from 'styled-components';
import micButtonImageSrc from '../../img/micbutton.png';
import micOffButtonImageSrc from '../../img/micoffbutton.png';
import muteSound from '../../sound/mute.mp3';
import unmuteSound from '../../sound/unmute.mp3';

const MicButtonImage = styled.img`
  width: 60px;
  height: 60px;
  cursor: pointer;
  position: absolute;
  left: 30px;
  top: 220px;
  overflow: visible;
  z-index: 1;
`;

const MicButton = ({ alt, isMicOn, onClick }) => {
  const handleClick = () => {
    if (isMicOn) {
      const muteAudio = new Audio(muteSound);
      muteAudio.play();
    } else {
      const unmuteAudio = new Audio(unmuteSound);
      unmuteAudio.play();
    }
    onClick(); // Call the provided onToggle handler from the parent component
  };

  return (
    <MicButtonImage
      src={isMicOn ? micButtonImageSrc : micOffButtonImageSrc}
      alt={alt}
      onClick={handleClick} // Use the handleClick function
    />
  );
};

export default MicButton;
