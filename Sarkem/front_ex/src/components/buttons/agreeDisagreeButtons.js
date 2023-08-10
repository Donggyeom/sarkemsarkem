import React from 'react';
import styled from 'styled-components';
import agreeButtonImage from '../../img/찬성.png';
import disagreeButtonImage from '../../img/반대.png';
import buttonclickSound from '../../sound/buttonclick.mp3'

const SmallButton = styled.button`
  padding: 0;
  background: none;
  cursor: pointer;
  border: none;
  position: relative; 
  z-index: 1;
  &:hover {
    filter: brightness(0.8);
  }
`;

const ButtonWithSound = ({ onClick, imageSrc, alt, disabled }) => {
  const handleClick = () => {
    const sound = new Audio(buttonclickSound);
    sound.play();
    onClick(); // Call the provided onClick handler from the parent component
  };

  return (
    <SmallButton onClick={handleClick} disabled={disabled}>
      <img src={imageSrc} alt={alt} style={{ width: '50%', height: '100%' }} />
    </SmallButton>
  );
};

const AgreeButton = ({ onClick, disabled }) => (
  <ButtonWithSound
    onClick={onClick}
    imageSrc={agreeButtonImage}
    alt="찬성"
    disabled={disabled}
  />
);

const DisagreeButton = ({ onClick, disabled }) => (
  <ButtonWithSound
    onClick={onClick}
    imageSrc={disagreeButtonImage}
    alt="반대"
    disabled={disabled}
  />
);

export { AgreeButton, DisagreeButton };
