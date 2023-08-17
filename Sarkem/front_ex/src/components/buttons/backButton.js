import React from 'react';
import styled from 'styled-components';
import backbuttonImage from '../../img/backbutton.png';
import { useGameContext } from '../../GameContext';
import { useNavigate } from 'react-router-dom';

const BackButtonContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
  z-index: 10;
  &:hover {
      filter: brightness(0.8);
  }
`;

const BackButtonImage = styled.img`
  width: 70px; /* Adjust the width as needed */
  height: 70px; /* Adjust the height as needed */
`;

const BackButton = () => {
  const navigate = useNavigate();
  const { onbeforeunload } = useGameContext();

  const goToPrev = () => {
    onbeforeunload();
    navigate("/");
  }

  return (
    <BackButtonContainer onClick={goToPrev}>
      <BackButtonImage src={backbuttonImage} alt="Back" />
    </BackButtonContainer>
  );
};

export default BackButton;
