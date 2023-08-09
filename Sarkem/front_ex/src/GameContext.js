import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useRoomContext } from './Context';
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';
import axios from "axios";

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const { roomSession, player, setPlayer, players, setPlayers } = useRoomContext();
  const [ gameSession, setGameSession ] = useState({});
  // 현재 시스템 메시지를 저장할 상태 추가
  const [currentSysMessage, setCurrentSysMessage] = useState(null);
  const [currentSysMessagesArray, setCurrentSysMessagesArray] = useState([]); // 배열 추가
  
  const [mafias, setMafias] = useState([]);
  const [chatMessages, setChatMessages] = useState([]); 
  const [chatConnected, setChatConnected] = useState(false);
  const [message, setMessage] = useState("");
  
  const [myVote, setMyVote] = useState(0);
  const [dayCount, setDayCount] = useState(0);
  const [startVote, setStartVote] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState("");
  const [expulsionTarget, setExpulsionTarget] = useState("");
  const [voteSituation, setVotesituation] = useState({});
  const [threatedTarget, setThreatedTarget] = useState("");
  const [targetId, setTargetId] = useState("");
  
  const [phase, setphase] = useState("");
  const [gestureRecognizer, setGestureRecognizer] = useState(null);
  const [detectedGesture, setDetectedGesture] = useState('');
  const [animationFrameId, setAnimationFrameId] = useState(null);
  const location = useLocation();
  
  const navigate = useNavigate();
  let stompClient = useRef({});
  
  const Roles = new Map(Object.entries({
    CITIZEN: "CITIZEN",
    SARK: "SARK",
    DOCTOR: "DOCTOR", 
    POLICE: "POLICE", 
    OBSERVER: "OBSERVER", 
    PSYCHO: "PSYCHO", 
    BULLY: "BULLY", 
    DETECTIVE: "DETECTIVE",
  }));
  
  ////////////   GameContext Effect   ////////////
  
  useEffect(() => {
    console.log('GameProvider 생성');
  }, []);


  useEffect(() => {
    console.log(`playerId : ${player.playerId}`);
    if (player.stream !== undefined) {
      connectGameWS();
      setPlayers((prev) => {
        return new Map([...prev, [player.playerId, player]]);
      });
      loadGestureRecognizer();
    }
  }, [player.stream]);

  useEffect(() => {
    console.log("GestureRecognizer 생성 완료");
  }, [gestureRecognizer]);
  
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
        // onSocketConnected();
        connectGame();
        connectChat();
        sendChatPubMessage();
        // onConnected();
       console.log(stompClient.current.connected);
    }, 500);
    })
  }

  // 게임룸 redis 구독
  const connectGame = () => {
    console.log('/sub/game/system/' + window.sessionStorage.getItem("roomId") + " redis 구독")
    stompClient.current.subscribe('/sub/game/system/' + window.sessionStorage.getItem("roomId"), receiveMessage)
  }

  // 채팅 연결할 때 //
  const connectChat = () => {
    console.log('/sub/chat/room/' + window.sessionStorage.getItem("roomId") + " redis 구독")
    stompClient.current.subscribe('/sub/chat/room/' + window.sessionStorage.getItem("roomId"), receiveChatMessage);
  };

  const receiveChatMessage = async (message) => {
    const parsedMessage = JSON.parse(message.body);
    const chatMessage = parsedMessage.message;
    const playerId = parsedMessage.playerId;
    
    console.log(chatMessage, "메세지 수신2"); // 메시지 수신 여부 확인을 위한 로그
    setChatMessages((prevMessages) => [...prevMessages, { message: chatMessage, playerId }]);
  };
  
  const sendChatPubMessage = (message) => {
    console.log("chat publish 들어감"); 
    if (stompClient.current.connected && player.playerId !== null) {
      console.log("stompclient 연결됨"); 
      stompClient.current.send('/pub/chat/room', {}, JSON.stringify({
        type:'ENTER',
        playerId:player.playerId, 
        roomId: roomSession.roomId,
        message: message
      }));
    }
  };

  const sendMessage = (message) => {
    if (stompClient.current.connected && player.playerId !== null) {
      console.log("Talk 타입 메시지 들간다"); 
      console.log("메시지: ", message); 
      stompClient.current.send('/pub/chat/room', {}, JSON.stringify({
        type:'TALK', 
        roomId: roomSession.roomId,
        playerId:player.playerId,
        message: message
      }));
    }
  }

//   const sendMessage = async (e) => {
//    console.log("메시지 보낸다");
//    if (message === '') return;
//    await stompClient.current.send('/pub/chat/room', {}, JSON.stringify({type:'TALK', roomId:roomId, playerId:player.playerid, message: message}))
//    setMessage('');
//  }


  // 게임 끝나거나 비활성화 할때 //
  const unconnectChat = () => {
    console.log('/sub/chat/room/' + roomSession.roomId + " redis 구독")
    stompClient.current.unsubscribe('/sub/chat/room/' + roomSession.roomId, receiveMessage)
  };

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

  const handleGamePageClick = () => {
    stompClient.current.send("/pub/game/action", {}, 
    JSON.stringify({
        code:'GAME_START', 
        roomId: roomSession.roomId, 
        playerId: player.playerId
    })
    );
};


  const receiveMessage = async (message) => {
      // 시스템 메시지 처리
      let sysMessage = JSON.parse(message.body);
      console.log(sysMessage);
      console.log(player.playerId, sysMessage.playerId);


      // if (player.playerid != sysMessage.playerId) return;
      if (player.playerId === sysMessage.playerId) {

      switch (sysMessage.code) {
        // param에 phase, message
      case "NOTICE_MESSAGE":
          console.log(sysMessage.param);
          setCurrentSysMessage(()=>sysMessage);
          setCurrentSysMessagesArray(prevMessages => [ ...prevMessages,
            { ...sysMessage, dayCount: sysMessage.param.day }]);
          // console.log(currentSysMessage);
          break;
      case "GAME_START":   
        navigate(`/${roomSession.roomId}/day`);
        break;
      case "ONLY_HOST_ACTION":
          console.log(sysMessage);
          // alert('방장만 실행 가능합니다.');
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
        const assignedRole = Roles.get(sysMessage.param.role);
        if (assignedRole == null) {
          alert("직업배정에 실패했습니다.", assignedRole);
          return;
        }
        console.log(`당신은 ${assignedRole} 입니다.`);
        setPlayer((prev) => {
          return ({
            ...prev,
            role: assignedRole,
          });
        });
      break;
case "GAME_START":   
          navigate(`/${roomSession.roomId}/day`);
          break;

      case "PHASE_DAY":
            setphase("day");
            navigate(`/${roomSession.roomId}/day`)
          break;

      case "PHASE_TWILIGHT":
          navigate(`/${roomSession.roomId}/sunset`)
          setThreatedTarget(); // 저녁 되면 협박 풀림
          break;

      case "PHASE_NIGHT":
          setphase("night");
          console.log(phase);
          navigate(`/${roomSession.roomId}/night`)
          break;

      case "TARGET_SELECTION":
          // alert('투표가 시작됐습니다');
          setStartVote(true);
          setDayCount(sysMessage.param.day);
          break;

      case "VOTE_SITUATION":
          console.log(sysMessage.param, "얘일걸");
          setVotesituation(sysMessage.param);
          alert(voteSituation , "투표결과");
          break;

      case "DAY_VOTE_END":
          setStartVote(false);

          setTargetId(sysMessage.param.targetId);
          console.log(sysMessage.param.targetId, "이거");
          console.log(targetId, "이놈확인해라");
          
          // 2번 -> sunsetpage로 넘겨서 사용해라

          break;

      case "TARGET_SELECTION_END":
          // alert("선택 완료", sysMessage.param.targetNickname);
          setSelectedTarget("");
          break;

      case "TWILIGHT_SELECTION":
          alert("죽일지 살릴지 선택해주세요");
          setStartVote(true);
          break;

      case "TWILIGHT_SELECTION_END":
          // 추방 투표 완료(개인)
          console.log("추방 투표 완료");
          break;

      case "TWILIGHT_VOTE_END":
          setStartVote(false);
          alert("저녁 투표 완료 \n 투표 결과: " + sysMessage.param.result);
          break;

      case "BE_EXCLUDED":
          setPlayer((prev) => {
            return ({
              ...prev,
              role: Roles.OBSERVER,
            });
          });
          break;

      case "BE_HUNTED":
          setPlayer((prev) => {
            return ({
              ...prev,
              role: Roles.OBSERVER,
            });
          });
          break;

      case "BE_THREATENED":
          alert("냥아치 협박 시작!", sysMessage.playerId);
          setThreatedTarget(sysMessage.playerId);
          setPlayer((prev) => {
            return ({
              ...prev,
              isMicOn: false,
            });
          });
          break;

      case "PHASE_NIGHT":
          navigate(`/${roomSession.roomId}/night`);
          break;

      case "CHANGE_HOST":
        console.log(`지금부터 당신이 방장입니다.`);
        setPlayer((prev) => {
          return ({
            ...prev,
            isHost: true
          });
        });
      }
    }
    else{
      // 역할 저장을 위해 넣었음 //
      switch (sysMessage.code) {
      case "ROLE_ASSIGNED":
        const assignedRole = Roles.get(sysMessage.param.role);
        if (assignedRole == null) {
          alert("직업배정에 오류가 발생했습니다.", assignedRole);
          return;
        }
        let player = players.get(sysMessage.playerId);
        if (player == null) {
          alert("ROLE_ASSIGNED - 플레이어 정보를 불러오는데 실패했습니다.", sysMessage.playerId);
          return;
        }
        player = {
          ...player,
          role: assignedRole,
        };
        setPlayers((prev) => {
          return new Map([
            ...prev,
            [player.playerId, player],
          ]);
        });
        break;
      }
    }

    handleSystemMessage(message);
  }
  
  const selectAction = ((target) => {
      console.log(target, "2번");
      if (selectedTarget !== "") {
          setSelectedTarget("");
          target.playerId = "";
      }
      else {
          setSelectedTarget(target.playerId)
      }
      console.log("다른 플레이어 선택 " + target.playerId);
      if (stompClient.current.connected && player.playerid !== null) {
          stompClient.current.send("/pub/game/action", {},
              JSON.stringify({
                  code: 'TARGET_SELECT',
                  roomId: roomSession.roomId,
                  playerId: player.playerid,
                  param: {
                      target: target.playerId
                  }
              }))
      }
  });
  
  // 대상 확정
  const selectConfirm = () => {
      console.log(selectedTarget + " 플레이어 선택 ");
      console.log(selectedTarget.nickname)
      if (stompClient.current.connected && player.playerid !== null) {
          stompClient.current.send("/pub/game/action", {},
              JSON.stringify({
                  code: 'TARGET_SELECTED', // 스킵했을 때도 얘도 보내달라
                  roomId: roomSession.roomId,
                  playerId: player.playerid,
                  param: {
                      // target: selectedTarget
                  }
              }));
      }
  };
  
  // 추방 투표 동의
  const agreeExpulsion = () => {
      stompClient.current.send("/pub/game/action", {}, 
          JSON.stringify({
              code: 'EXPULSION_VOTE',
              roomId: roomSession.roomId, 
              playerId: player.playerid,
              param: {
                  result: true
              }
          })
      );
  };
  
  // 추방 투표 반대
  const disagreeExpulsion = () => {
      stompClient.current.send("/pub/game/action", {}, 
          JSON.stringify({
              code: 'EXPULSION_VOTE',
              roomId: roomSession.roomId, 
              playerId: player.playerid,
              param: {
                  result: false
              }
          })
      );
  };

    // noticemessage 처리
    const [systemMessages, setSystemMessages] = useState([]);
    const handleSystemMessage = (message) => {
      const sysMessage = JSON.parse(message.body);
      setSystemMessages((prevMessages) => [...prevMessages, sysMessage]);
    };
  
    // 제스처 인식기 생성
    const loadGestureRecognizer = async () => {
      const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm');
      const recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
          delegate: 'GPU',
          numHands: 2
        },
        runningMode: 'VIDEO',
      });
      setGestureRecognizer(recognizer);
    };

    // 
    const predictWebcam = async () => {
      if (gestureRecognizer) {
        const videoElement = player.stream.videos[1].video;
        const nowInMs = Date.now();
        const results = await gestureRecognizer.recognizeForVideo(videoElement, nowInMs);
  
        if (results.gestures.length > 0) {
          const detectedGestureName = results.gestures[0][0].categoryName;
          setDetectedGesture(detectedGestureName);
        } else {
          setDetectedGesture('');
        }
        // Continue predicting frames from webcam
        setAnimationFrameId(setTimeout(() => requestAnimationFrame(predictWebcam), 100));
      }
    };
    const stopPredicting = () => {
      cancelAnimationFrame(animationFrameId); // requestAnimationFrame 중지
      if(animationFrameId) {
        clearTimeout(animationFrameId);
      }
      setAnimationFrameId(null);
    };

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

  return (
    <GameContext.Provider value={{ stompClient, startVote, selectAction, setSelectedTarget, selectConfirm, handleGamePageClick, 
      systemMessages, handleSystemMessage, dayCount, agreeExpulsion, disagreeExpulsion, predictWebcam, stopPredicting, detectedGesture, chatMessages, receiveChatMessage,
      voteSituation, currentSysMessage, currentSysMessagesArray, phase, targetId, sendMessage, threatedTarget, getGameSession, gameSession, setGameSession, 
      Roles
    }}>
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



export { GameProvider, useGameContext };
