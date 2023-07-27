import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import backbuttonImage from '../../img/backbutton.png';
import { useRoomContext } from '../../Context';

const BackButtonContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
`;

const BackButton = () => {
  const {leaveSession} = useRoomContext();
  const navigate = useNavigate();

  return (
    <BackButtonContainer onClick={leaveSession}>
      <img src={backbuttonImage} alt="Back" />
    </BackButtonContainer>
  );
};

export default BackButton;