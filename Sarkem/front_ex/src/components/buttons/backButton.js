import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import backbuttonImage from '../../img/backbutton.png';

const BackButtonContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
`;

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <BackButtonContainer onClick={handleBack}>
      <img src={backbuttonImage} alt="Back" />
    </BackButtonContainer>
  );
};

export default BackButton;