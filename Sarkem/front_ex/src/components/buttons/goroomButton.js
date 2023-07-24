import React from 'react';
import styled from 'styled-components';
import goroomButtonSrc from '../../img/gobutton.png';
import { useNavigate } from 'react-router-dom';

const GoroomButtonImage = styled.img`
  width: 200px;
  cursor: pointer;
`;

const GoroomButton = ({ src, alt, onClick }) => {
  return <GoroomButtonImage src={goroomButtonSrc} alt={alt} onClick={onClick} />;
};

export default GoroomButton;