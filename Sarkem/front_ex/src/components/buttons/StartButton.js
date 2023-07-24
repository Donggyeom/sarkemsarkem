import React from 'react';
import styled from 'styled-components';
import startButtonImageSrc from '../../img/startbutton.png';
import { useNavigate } from 'react-router-dom';

const StartButtonImage = styled.img`
  width: 200px;
  cursor: pointer;
`;

const StartButton = ({ src, alt }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/day');
  };

  return <StartButtonImage src={startButtonImageSrc} alt={alt} onClick={handleButtonClick} />;
};

export default StartButton;

