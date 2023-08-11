import React from 'react';
import styled from 'styled-components';
import goroomButtonSrc from '../../img/gobutton.png';
import makeRoomButtonSrc from '../../img/makebutton.png'
import { useNavigate } from 'react-router-dom';
import { useRoomContext } from '../../Context';
import { useGameContext } from '../../GameContext';
import buttonclickSound from '../../sound/buttonclick.mp3';

const GoroomButtonImage = styled.img`
  width: 28%;
  height : 76%;
  cursor: pointer;
  &:hover {
    filter: brightness(0.8);
  }
`;

const GoroomButton = (props) => {
  const { createGameRoom, roomSession, setRoomSession, getGameRoom, 
    player, setPlayer, players, setPlayers, initSession, connectSession } = useRoomContext();
  const {getGameSession} = useGameContext();
  const navigate = useNavigate();

  const handleButtonClick = async () => {

    if (player.nickName === "ALL") {
      alert("해당 닉네임은 사용할 수 없습니다.");
      return;
    }

    // 문자열 연결을 사용하여 URL을 구성하고 state로 필요한 데이터를 전달합니다.
    const sound = new Audio(buttonclickSound);
    sound.play();
    let roomId = props.roomId;
    navigate("/loading");
    
    // 게임방이 없을 경우 게임방 생성
    if (player.isHost) {
      const response = await createGameRoom(roomId);

      if (response.status != '200') {
        alert(`게임방 세션 생성 실패 roomId : ${roomId}`);
        navigate("/");
        return;
      }
    }
    
    let gameRoom = await getGameRoom(roomId);
    console.log(gameRoom);
    
    // 게임방ID 설정
    setRoomSession((prev) => {
      console.log(`setRoomSession`);
      console.log(gameRoom);
      return ({
        ...prev,
        roomId: gameRoom.roomId,
        gameId: gameRoom.gameId,
      });
    });
    
    // sessionStorage에 roomId 갱신
    console.log("sessionStorage에 roomId를 갱신합니다.")
    window.sessionStorage.setItem("roomId", gameRoom.roomId);

    // sessionStorage에 playerId 갱신
    console.log("sessionStorage에 gameId를 갱신합니다.")
    window.sessionStorage.setItem("gameId", gameRoom.gameId);

    let players = new Map();
    gameRoom.players.forEach(element => {
      var p = players.get(element.playerId);
      if (p == null) {
        players.set(element.playerId, {
          playerId: element.playerId,
          nickName: element.nickname
        });
      }
    });
    setPlayers(players);

    // 게임 세션 갱신
    const isEnterable = await getGameSession(gameRoom.roomId);
    if (!isEnterable) {
      alert("이미 게임 중인 방입니다.");
      navigate("/");
      return;
    }
    console.log(isEnterable)
    const session = await initSession();
    await connectSession(session, gameRoom.roomId);
    navigate(`/${roomId}/lobby`);
  };

  return <GoroomButtonImage src={player.isHost ? makeRoomButtonSrc : goroomButtonSrc} alt={player.isHost ? "방 만들기" : "입장하기"} onClick={handleButtonClick} />;
};


export default GoroomButton;