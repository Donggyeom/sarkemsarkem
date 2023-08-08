import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useRoomContext } from './Context';
import axios from 'axios';

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const { roomSession, player, setPlayers } = useRoomContext();
  const [ gameSession, setGameSession ] = useState({});
  const [ myRole, setMyRole ] = useState(null);

  const navigate = useNavigate();
  let stompClient = useRef({})
  

  ////////////   GameContext Effect   ////////////

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

  
  // 게임 옵션이 변경되면, callChangeOption 호출
  useEffect(()=> {

    if(!player.isHost) return;

    callChangeOption();

  }, [gameSession.gameOption]);


  ////////////   GameContext 함수   ////////////

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

  const onSocketConnected = () => {
    console.log(`WebSocket 연결 : ${stompClient.current.connected}`);
  }

  const getGameSession = async (roomId) => {
    try {
      // 게임세션 정보 획득
      const response = await axios.get('/api/game/session/' + roomId, {
        headers: { 'Content-Type': 'application/json;charset=utf-8', },
      });

      if (response.status === 208) {
        console.log("이미 진행중인 게임입니다.");
        return false;
      }

      console.log('gamesession 획득');
      console.log(response);
      setGameSession((prev) => {
        return ({
          ...prev,
          gameOption: response.data.gameOption,
        });
      });

      return true;
    }
    catch {
      console.log("게임 세션 요청 실패");
      return false;
    }
  }
  

  // 변경된 게임 옵션을 redis 토픽에 전달
  const callChangeOption = () => {
    if(stompClient.current.connected) {
      stompClient.current.send("/pub/game/action", {}, 
          JSON.stringify({
              code:'OPTION_CHANGE', 
              roomId: roomSession.roomId,
              playerId: player.playerId,
              param: gameSession.gameOption
      }));
      console.log(gameSession.gameOption);
    }
  };


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
          setGameSession((prev) => {
            return ({
              ...prev,
              gameOption: sysMessage.param,
            });
          });
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
    <GameContext.Provider value={{ gameSession, setGameSession, stompClient, myRole, handleGamePageClick, getGameSession }}>
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
