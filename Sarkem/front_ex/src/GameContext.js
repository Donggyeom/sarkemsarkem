import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useRoomContext } from './Context';

const GameContext = createContext();

const GameProvider = ({ children }) => {
    const {roomSession, player, setPlayers, gameId, gameOption, setGameOption} = useRoomContext();
    const navigate = useNavigate();
    let stompClient = useRef({})

    const [myRole, setMyRole] = useState(null);
    
    useEffect(() => {
      console.log('GameProvider 생성');
    }, []);

    useEffect(() => {
      console.log(`playerId : ${player.playerId}`);
      if (player.playerId != undefined) {
        connectGameWS();
        setPlayers((prev) => {
          return new Map([...prev, [player.playerId, player]]);
        });
      }
    }, [player.playerId]);

  // WebSocket 연결
  const connectGameWS = async (event) => {
    console.log("connectGameWS");
    let socket = new SockJS("http://localhost:8080/ws-stomp");
    stompClient.current = Stomp.over(socket);
    await stompClient.current.connect({}, () => {
      setTimeout(function() {
        onSocketConnected();
        connectGame();
    }, 500);
    })
  }

  // 게임룸 redis 구독
  const connectGame = () => {
    console.log('/sub/game/system/' + roomSession.roomId + " redis 구독")
    stompClient.current.subscribe('/sub/game/system/' + roomSession.roomId, receiveMessage)
  }

  // const connectChat = () => {
  //   console.log('/sub/game/system/chat_' + roomId + " redis 구독")
  //   stompClient.current.subscribe('/sub/chat/room/' + roomId, receiveMessage)
  // }


  const onSocketConnected = () => {
    console.log(`WebSocket 연결 : ${stompClient.current.connected}`);
  }

  const receiveMessage = (message) => {
      // 시스템 메시지 처리
      let sysMessage = JSON.parse(message.body);
      console.log(sysMessage);
      console.log(player.playerId, sysMessage.playerId);
      if (player.playerId != sysMessage.playerId) return;

      switch (sysMessage.code) {
      case "NOTICE_MESSAGE":
          alert(sysMessage.param.message);
          break;
      case "GAME_START":   
          navigate(`/${roomSession.roomId}/day`);
          break;
      case "ONLY_HOST_ACTION":
          console.log(sysMessage);
          alert('방장만 실행 가능합니다.');
          break;
      case "OPTION_CHANGED":
          if(player.isHost) return;
          setGameOption(sysMessage.param);
          console.log(sysMessage.param.sarkCount);
          break;
      case "ROLE_ASSIGNED":
          console.log(`당신은 ${sysMessage.param.role} 입니다.`)
          setMyRole(sysMessage.param.role);
          break;
      // case "PHASE_DAY":
      //     navigate(`/${roomId}/day`);
      //     break;
      // case "PHASE_TWILIGHT":
      //     navigate(`/${roomId}/sunset`);
      //     break;
      // case "PHASE_NIGHT":
      //     navigate(`/${roomId}/night`);
      //     break;

      // case "TARGET_SELECTION_END":
      //   // 선택 완료
      //   alert("선택 완료", sysMessage.param.targetNickname);
      //   setSelectedTarget("");
      //   break;

      }
  }

  const handleGamePageClick = () => {
      stompClient.current.send("/pub/game/action", {}, 
      JSON.stringify({
          code:'GAME_START', 
          roomId: roomSession.roomId, 
          playerId: player.playerId
      })
      );
  };

  return (
    <GameContext.Provider value={{ stompClient, myRole, handleGamePageClick, }}>
      {children}
    </GameContext.Provider>
  );
};

const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('roomContext must be used within a RoomProvider');
  }
  return context;
};



export { GameProvider, useGameContext,  };
