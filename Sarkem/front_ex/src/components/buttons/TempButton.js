import React from 'react';
import styled, { css } from 'styled-components';
import backbuttonImage from '../../img/backbutton.png';
import { useRoomContext } from '../../Context';

const BackButtonContainer = styled.div`
  position: absolute;
  left: 20px;
  bottom: 30px;
  cursor: pointer;

  ${({ flip }) => flip && css`
    img {
      transform: scaleX(-1);
    }
  `}
`;

const TempButton = ({onClick}) => {

  return (
    <BackButtonContainer onClick={onClick} flip>
      <img src={backbuttonImage} alt="Back" />
    </BackButtonContainer>
  );

};

export default TempButton;
