import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useRoomContext } from './Context';

const GameContext = createContext();

const GameProvider = ({ children }) => {
  // roomId : 방번호 , token : 플레이어아이디 
    const {roomId, token, isHost} = useRoomContext();
    const navigate = useNavigate();
    let stompClient = useRef({})

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
    const [myVote, setMyVote] = useState(0);
    const [dayCount, setDayCount] = useState(0);
    const [startVote, setStartVote] = useState(false);
    const [selectedTarget, setSelectedTarget] = useState("");
    const [expulsionTarget, setExpulsionTarget] = useState("");
    const [voteSituation, setVotesituation] = useState({});

    const location = useLocation();
    

    useEffect(() => {
        if (token !== null) connectGameWS();
    }, [token]);

  // WebSocket 연결
  const connectGameWS = async (event) => {
    let socket = new SockJS("http://localhost:8080/ws-stomp");
    stompClient.current = Stomp.over(socket);
    await stompClient.current.connect({}, () => {
     setTimeout(function() {
       onSocketConnected();
        connectGame();
       console.log(stompClient.current.connected);
    }, 500);
    })
  }

  // 게임룸 redis 구독
  const connectGame = () => {
    console.log('/sub/game/system/' + roomId + " redis 구독")
    stompClient.current.subscribe('/sub/game/system/' + roomId, receiveMessage)
  }

  // const connectChat = () => {
  //   console.log('/sub/game/system/chat_' + roomId + " redis 구독")
  //   stompClient.current.subscribe('/sub/chat/room/' + roomId, receiveMessage)
  // }


const onSocketConnected = () => {
        console.log("game websocket 연결 완료");
    }

    const receiveMessage = async (message) => {
        // 시스템 메시지 처리
        let sysMessage = JSON.parse(message.body);
        console.log(sysMessage);
        console.log(token, sysMessage.playerId);
        if (token != sysMessage.playerId) return;

        switch (sysMessage.code) {
          // param에 phase, message
        case "NOTICE_MESSAGE":
            console.log(sysMessage.param);
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
            console.log(`당신은 ${sysMessage.param.role} 입니다.`);
            setMyRole(sysMessage.param.role);
            break;
            
        case "PHASE_DAY":
            if (sysMessage.param.day === 1) {
              setDayCount(sysMessage.param.day);
              navigate(`/${roomId}/day`)
            } else {
              setDayCount(sysMessage.param.day);
              navigate(`/${roomId}/day`);
            }
            break;

        case "TARGET_SELECTION":
              setStartVote(false);
              alert(`${dayCount}번째 날 투표 시작`);
              console.log("투표시작");
            break;

        case "VOTE_SITUATION":
            console.log(sysMessage.param);
            setMyVote(sysMessage.param.votedCnt);
            break;

        case "DAY_VOTE_END":
            if (dayCount !== 0){
              alert("낮 투표 종료 \n 추방 대상 : " + sysMessage.param.targetNickname);
              if (sysMessage.param.targetId == null) break;
              setExpulsionTarget(sysMessage.param.targetId);
              console.log("투표종료");
            }
              break;
  
      case "TARGET_SELECTION_END":
        alert("선택 완료", sysMessage.param.targetNickname);
        setSelectedTarget("");
        break;



        // case "PHASE_TWILIGHT":
        //     navigate(`/${roomId}/sunset`);
        //     break;
        // case "PHASE_NIGHT":
        //     navigate(`/${roomId}/night`);
        //     break;
        

        }
        handleSystemMessage(message);
    }

    const handleGamePageClick = () => {
        console.log(token);
        stompClient.current.send("/pub/game/action", {}, 
        JSON.stringify({
            code:'GAME_START', 
            roomId: roomId, 
            playerId: token
        })
        );

    }

    const selectAction = ((target) => {
      if (selectedTarget != "") {
          setSelectedTarget("");
          target.playerId = "";
      }
      else {
          setSelectedTarget(target.playerId)
      }

      console.log("다른 플레이어 선택 " + target.playerId);
      if (stompClient.current.connected && token !== null) {
          stompClient.current.send("/pub/game/action", {},
              JSON.stringify({
                  code: 'TARGET_SELECT',
                  roomId: roomId,
                  playerId: token,
                  param: {
                      target: target.playerId
                  }
              }))
      }
  })

  // 대상 확정
  const selectConfirm = () => {
    console.log(selectedTarget + " 플레이어 선택 ");
    if (stompClient.current.connected && token !== null) {
        stompClient.current.send("/pub/game/action", {},
            JSON.stringify({
                code: 'TARGET_SELECTED', // 스킵했을 때도 얘도 보내달라
                roomId: roomId,
                playerId: token,
                param: {
                    // target: selectedTarget
                }
            }));
    }
};

    // noticemessage 처리
    const [systemMessages, setSystemMessages] = useState([]);
    const handleSystemMessage = (message) => {
      const sysMessage = JSON.parse(message.body);
      setSystemMessages((prevMessages) => [...prevMessages, sysMessage]);
    };

    // 게임 옵션 변경 시 실행
//   useEffect(() => {
    
// }, [peopleCount])
  return (
    <GameContext.Provider value={{ stompClient, peopleCount, myRole, startVote, setPeopleCount, selectAction, setSelectedTarget, selectConfirm, handleGamePageClick, 
      systemMessages, handleSystemMessage, dayCount }}>
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
