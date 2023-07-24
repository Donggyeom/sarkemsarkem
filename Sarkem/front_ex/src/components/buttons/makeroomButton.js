import React from 'react';
import styled from 'styled-components';
import makeroomButtonSrc from '../../img/makebutton.png';
import { useNavigate } from 'react-router-dom';

const MakeroomButtonImage = styled.img`
  width: 200px;
  cursor: pointer;
`;

const MakeroomButton = ({ src, alt }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // /lobby로 이동
    navigate('/lobby');
  };

  return <MakeroomButtonImage src={makeroomButtonSrc} alt={alt} onClick={handleButtonClick} />;
};

export default MakeroomButton;