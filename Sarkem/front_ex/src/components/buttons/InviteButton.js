import React from 'react';
import styled from 'styled-components';
import inviteButtonImage from '../../img/invitebutton.png';
import buttonclickSound from '../../sound/buttonclick.mp3'

const InviteButtonImage = styled.img`
  width: 100%;
  height: 100%;
  cursor: pointer;
  &:hover {
    filter: brightness(0.8);
  }
`;

const InviteButton = ({ onClick }) => {
  const handleClick = () => {
    const sound = new Audio(buttonclickSound);
    sound.play();

    // Wait for the sound to finish playing (use sound.duration if needed)
    setTimeout(() => {
      // Now trigger the alert after the sound has played
      onClick(); // Call the provided onClick handler from the parent component
    }, 10); // Delay by the duration of the sound in milliseconds
  };
  return <InviteButtonImage src={inviteButtonImage} onClick={onClick} alt={"Invite Button"}/>;
};

export default InviteButton;