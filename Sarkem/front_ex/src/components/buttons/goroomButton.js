import React from 'react';
import styled from 'styled-components';
import goroomButtonSrc from '../../img/gobutton.png';
import makeRoomButtonSrc from '../../img/makebutton.png'
import { useNavigate } from 'react-router-dom';
import { useRoomContext } from '../../Context';
import { useGameContext } from '../../GameContext';
import buttonclickSound from '../../sound/buttonclick.mp3';

const GoroomButtonImage = styled.img`
  width: 80%;
  // display: block; 
  margin-right: 40%; 
  cursor: pointer;
  &:hover {
    filter: brightness(0.8);
  }
  align-items: center;
`;

const GoroomButton = () => {
  const { createGameRoom, roomSession, getGameRoom, checkGameRoom,
    player, players, setPlayers, initSession, connectSession } = useRoomContext();
  const {getGameSession, connectGameWS, loadGestureRecognizer } = useGameContext();
  const navigate = useNavigate();

  const handleButtonClick = async () => {

    if (player.current.nickName === "ALL") {
      alert("해당 닉네임은 사용할 수 없습니다.");
      return;
    }

    // 문자열 연결을 사용하여 URL을 구성하고 state로 필요한 데이터를 전달합니다.
    const sound = new Audio(buttonclickSound);
    sound.play();
    navigate("/loading");

    let gameRoom = await checkGameRoom();
    console.log(`checkGameRoom return gameRoom`, gameRoom);
    // 게임방이 없을 경우 게임방 생성
    if (gameRoom == null) {
      const response = await createGameRoom();

      if (response.status == '400') {
        alert(`게임방 세션 생성 실패`);
        navigate("/");
        return;
      }
      gameRoom = await getGameRoom(response.data);
    }
    
    // 게임방ID 설정
    roomSession.current.roomId = gameRoom.roomId;
    roomSession.current.gameId = gameRoom.gameId;

    gameRoom.players.forEach(element => {
      var p = players.current.get(element.playerId);
      console.log(p, 'gameRoom.players');
    });

    const isEnterable = await getGameSession(gameRoom.roomId);
    if (!isEnterable) {
      alert("이미 게임 중인 방입니다.");
      navigate("/");
      return;
    }

    if (roomSession.current.openviduSession === undefined) {
      const session = await initSession();
      let response = await connectSession(session, gameRoom.roomId);
      if (response != null) {
        navigate("/");
        return;
      }
    }

    connectGameWS();
    loadGestureRecognizer();
    navigate(`/${gameRoom.roomId}/lobby`);
  };

  return <GoroomButtonImage src={player.current.isHost ? makeRoomButtonSrc : goroomButtonSrc} alt={player.current.isHost ? "방 만들기" : "입장하기"} onClick={handleButtonClick} />;
};


export default GoroomButton;