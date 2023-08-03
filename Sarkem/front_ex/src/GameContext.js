import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useRoomContext } from './Context';

const GameContext = createContext();

const GameProvider = ({ children }) => {
    const {roomId, token, isHost} = useRoomContext();
    const navigate = useNavigate();
    let stompCilent = useRef({})

    const [peopleCount, setPeopleCount] = useState({
        meetingTime: 60,
        citizenCount: 0,
        sarkCount: 0,
        doctorCount: 0,
        policeCount: 0,
        detectiveCount: 0,
        psychologistCount: 0,
        bullyCount: 0
      });

    const [myRole, setMyRole] = useState(null);
    

    useEffect(() => {
        if (token !== null) connectGameWS();
    }, [token]);

  // WebSocket 연결
  const connectGameWS = async (event) => {
    let socket = new SockJS("https://localhost:8081/ws-stomp");
    stompCilent.current = Stomp.over(socket);
    await stompCilent.current.connect({}, () => {
     setTimeout(function() {
       onSocketConnected();
        connectGame();
       console.log(stompCilent.current.connected);
    }, 500);
    })
  }

  // 게임룸 redis 구독
  const connectGame = () => {
    console.log('/sub/game/system/' + roomId + " redis 구독")
    stompCilent.current.subscribe('/sub/game/system/' + roomId, receiveMessage)
  }

  // const connectChat = () => {
  //   console.log('/sub/game/system/chat_' + roomId + " redis 구독")
  //   stompCilent.current.subscribe('/sub/chat/room/' + roomId, receiveMessage)
  // }


const onSocketConnected = () => {
        console.log("game websocket 연결 완료");
    }

    const receiveMessage = (message) => {
        // 시스템 메시지 처리
        let sysMessage = JSON.parse(message.body);
        console.log(sysMessage);
        console.log(token, sysMessage.playerId);
        if (token != sysMessage.playerId) return;

        switch (sysMessage.code) {
        case "NOTICE_MESSAGE":
            alert(sysMessage.param.message);
            break;
        case "GAME_START":   
            alert('게임시작');
             navigate(`/${roomId}/day`);
            break;
        case "ONLY_HOST_ACTION":
            console.log(sysMessage);
            alert('방장만 실행 가능합니다.');
            break;
        case "OPTION_CHANGED":
            if(isHost) return;
            setPeopleCount(sysMessage.param);
            console.log(sysMessage.param.sarkCount);
            break;
        case "ROLE_ASSIGNED":
            // alert(`당신은 ${sysMessage.param.role} 입니다.`);
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
        console.log(token);
        stompCilent.current.send("/pub/game/action", {}, 
        JSON.stringify({
            code:'GAME_START', 
            roomId: roomId, 
            playerId: token
        })
        );
    };

  

    // 게임 옵션 변경 시 실행
//   useEffect(() => {
    
// }, [peopleCount])
  return (
    <GameContext.Provider value={{ stompCilent, peopleCount, myRole, setPeopleCount, handleGamePageClick, }}>
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
