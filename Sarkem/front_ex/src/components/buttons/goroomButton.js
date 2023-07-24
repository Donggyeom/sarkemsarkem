import React from 'react';
import styled from 'styled-components';
import goroomButtonSrc from '../../img/gobutton.png';
import makeRoomButtonSrc from '../../img/makebutton.png'
import { useNavigate } from 'react-router-dom';

const GoroomButtonImage = styled.img`
  width: 200px;
  cursor: pointer;
`;

const GoroomButton = ({ isHost, roomId }) => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/lobby', {state: {isHost: isHost, roomId: roomId}});
  };
  return <GoroomButtonImage src={isHost ? makeRoomButtonSrc : goroomButtonSrc} alt={isHost ? "방 만들기" : "입장하기"} onClick={handleButtonClick} />;
};

export default GoroomButton;