import React from 'react';
import styled from 'styled-components';
import goroomButtonSrc from '../../img/gobutton.png';
import makeRoomButtonSrc from '../../img/makebutton.png'
import { useNavigate } from 'react-router-dom';
import { useRoomContext } from '../../Context';

const GoroomButtonImage = styled.img`
  width: 28%;
  height : 76%;
  cursor: pointer;
  &:hover {
    filter: brightness(0.8);
  }
`;

const GoroomButton = () => {
  const {roomSession, player, initSession, connectSession } = useRoomContext();
  const navigate = useNavigate();

  const handleButtonClick = async () => {
    const session = await initSession();
    connectSession(session);
    navigate(`/${roomSession.roomId}/lobby`);
  };

  return <GoroomButtonImage src={player.isHost ? makeRoomButtonSrc : goroomButtonSrc} alt={player.isHost ? "방 만들기" : "입장하기"} onClick={handleButtonClick} />;
};


export default GoroomButton;