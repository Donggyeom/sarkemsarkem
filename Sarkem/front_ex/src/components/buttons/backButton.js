import React from 'react';
import styled from 'styled-components';
import backbuttonImage from '../../img/backbutton.png';
import { useRoomContext } from '../../Context';

const BackButtonContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
  z-index : 10;
`;

const BackButton = () => {
  const {leaveSession} = useRoomContext();

  return (
    <BackButtonContainer onClick={leaveSession}>
      <img src={backbuttonImage} alt="Back" />
    </BackButtonContainer>
  );
};

export default BackButton;