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
`;

const GoroomButton = () => {
  const {roomId, isHost, joinSession} = useRoomContext();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // 문자열 연결을 사용하여 URL을 구성하고 state로 필요한 데이터를 전달합니다.
    joinSession();
    navigate(`/${roomId}/lobby`);
  };

  return <GoroomButtonImage src={isHost ? makeRoomButtonSrc : goroomButtonSrc} alt={isHost ? "방 만들기" : "입장하기"} onClick={handleButtonClick} />;
};


export default GoroomButton;