import React from 'react';
import styled from 'styled-components';
import { useRoomContext } from '../../Context';
import { useGameContext } from '../../GameContext';

const StyledImg = styled.img`
  width: 175px;
  z-index: 2;
  position: absolute;
  top: 13%;
  right: 2%;
`;

const HandImage = ({ handNumber }) => {
  const { hiddenMission , missionNumber } = useGameContext();
  const { player } = useRoomContext();
  const role = player.role;
  


  const handImages = [
    require('../../img/hand_0.png'),
    require('../../img/hand_1.png'),
    require('../../img/hand_2.png'),
    require('../../img/hand_3.png'),
    require('../../img/hand_4.png'),
    require('../../img/hand_5.png')
  ];

  const selectedHandImage = role === 'SARK'&&hiddenMission ? handImages[missionNumber] || handImages[0] : null;

  return selectedHandImage ? <StyledImg src={selectedHandImage} alt={`Hand ${handNumber}`} /> : null;
};

export default HandImage;
