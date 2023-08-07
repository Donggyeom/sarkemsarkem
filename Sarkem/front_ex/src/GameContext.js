import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useRoomContext } from './Context';
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';
import DayPopup from './components/games/DayPopup';
import { Message } from '@stomp/stompjs';
import nightCamAudio from './components/camera/DayNightCamera';

const GameContext = createContext();

const GameProvider = ({ children }) => {
  // roomId : 방번호 , token : 플레이어아이디 
    const {roomId, token, isHost, isMicOn, setIsMicOn, publisher, camArray} = useRoomContext();
    const navigate = useNavigate();
      // 현재 시스템 메시지를 저장할 상태 추가
    const [currentSysMessage, setCurrentSysMessage] = useState(null);
    const [currentSysMessagesArray, setCurrentSysMessagesArray] = useState([]); // 배열 추가
    let stompClient = useRef({})
    const [mafias, setMafias] = useState([]);
    const [chatMessages, setChatMessages] = useState([]); 
    const [chatConnected, setChatConnected] = useState(false);
    const [message, setMessage] = useState("");


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


    // 삵만 추리려고 넣은거
    const [playersRoles, setPlayersRoles] = useState({

    });

    const [myRole, setMyRole] = useState(null);
    const [myVote, setMyVote] = useState(0);
    const [dayCount, setDayCount] = useState(0);
    const [startVote, setStartVote] = useState(false);
    const [selectedTarget, setSelectedTarget] = useState("");
    const [expulsionTarget, setExpulsionTarget] = useState("");
    const [voteSituation, setVotesituation] = useState({});
    const [threatedTarget, setThreatedTarget] = useState("");

    const [phase, setphase] = useState("");
    const [gestureRecognizer, setGestureRecognizer] = useState(null);
    const [detectedGesture, setDetectedGesture] = useState('');
    const [animationFrameId, setAnimationFrameId] = useState(null);
    const location = useLocation();


    useEffect(() => {
        if (token !== null) {
          connectGameWS();
          loadGestureRecognizer();
        }
    }, [token]);

  // WebSocket 연결
  const connectGameWS = async (event) => {
    let socket = new SockJS("http://localhost:8080/ws-stomp");
    stompClient.current = Stomp.over(socket);
    await stompClient.current.connect({}, () => {
     setTimeout(function() {
       onSocketConnected();
        connectGame();
        connectChat();
       console.log(stompClient.current.connected);
    }, 500);
    })
  }

  // 게임룸 redis 구독
  const connectGame = () => {
    console.log('/sub/game/system/' + roomId + " redis 구독")
    stompClient.current.subscribe('/sub/game/system/' + roomId, receiveMessage)
  }

  // 채팅 연결할 때 //
  const connectChat = () => {
    console.log('/sub/chat/room/' + roomId + " redis 구독")
    stompClient.current.subscribe('/sub/chat/room/' + roomId, receiveChatMessage);
  };

  const receiveChatMessage = (message) => {
    const chatMessage = JSON.parse(message.body);
    console.log(chatMessage, "메세지 수신"); // 메시지 수신 여부 확인을 위한 로그
    setChatMessages((prevMessages) => [...prevMessages, chatMessage]);
  };
  
  const sendChatMessage = (message) => {
    if (stompClient.current.connected && token !== null) {
      stompClient.current.send('/pub/chat/room/' + roomId, {}, JSON.stringify({
        roomId: roomId,
        message: message
      }));
    }
  };




  // 게임 끝나거나 비활성화 할때 //
  const unconnectChat = () => {
    console.log('/sub/chat/room/' + roomId + " redis 구독")
    stompClient.current.unsubscribe('/sub/chat/room/' + roomId, receiveMessage)
  };

  
  // const onSendMessage = (message) => {
  //   if (stompClient.current.connected && token !== null) {
  //     stompClient.current.send('/pub/chat/room/' + roomId, {}, JSON.stringify({ message }));
  //   }
  // }

  // const receiveChatMessage = (message) => {
  //   const chatMessage = JSON.parse(message.body);
  //   setChatMessages((prevMessages) => [...prevMessages, chatMessage]);
  // }




const onSocketConnected = () => {
        console.log("game websocket 연결 완료");
    }



    const receiveMessage = async (message) => {
        // 시스템 메시지 처리
        let sysMessage = JSON.parse(message.body);
        console.log(sysMessage);
        console.log(token, sysMessage.playerId);



        // if (token != sysMessage.playerId) return;
        if (token === sysMessage.playerId) {

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
            navigate(`/${roomId}/day`);
            console.log(camArray);
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

        // 역할 저장을 위해 넣었음 //
        case "ROLE_ASSIGNED":
          console.log(`당신은 ${sysMessage.param.role} 입니다.`);
          setMyRole(sysMessage.param.role);
          
          setPlayersRoles((prevRoles) => ({
            ...prevRoles,
            [sysMessage.playerId]: sysMessage.param.role
          }));

        break;



        case "PHASE_DAY":
              setphase("day");
              navigate(`/${roomId}/day`)
            break;

        case "PHASE_TWILIGHT":
            navigate(`/${roomId}/sunset`)
            setThreatedTarget(); // 저녁 되면 협박 풀림
            break;
        case "PHASE_NIGHT":
            setphase("night");
            console.log(phase);
            navigate(`/${roomId}/night`)
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
            // if (dayCount !== 1){
            //   setStartVote(false);
            //   if (sysMessage.param.targetId == null) break;
            //   setExpulsionTarget(sysMessage.param.targetId);
            //   console.log("투표종료");
            // }
                setStartVote(false);
            break;
  
        case "TARGET_SELECTION_END":
            // alert("선택 완료", sysMessage.param.targetNickname);
            setSelectedTarget("");
            break;

        case "PHASE_TWILIGHT":
            navigate(`/${roomId}/sunset`);
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
            setMyRole("OBSERVER");
            break;

        case "BE_HUNTED":
            setMyRole("OBSERVER");
            break;

        // case "BE_THREATENED":
        //     alert("냥아치 협박 시작!", sysMessage.playerId);
        //     setThreatedTarget(sysMessage.playerId);
        //     setIsMicOn(false);
        //     break;

        case "PHASE_NIGHT":
            navigate(`/${roomId}/night`);
            break;
        
        }
      }

      else{
        
        // 역할 저장을 위해 넣었음 //
        switch (sysMessage.code) {
          case "ROLE_ASSIGNED":
             
              setPlayersRoles((prevRoles) => ({
                  ...prevRoles,
                  [sysMessage.playerId]: sysMessage.param.role
              }));
              break;

        }
      }

      handleSystemMessage(message);
    }

    const handleGamePageClick = () => {
      console.log(token);
      stompClient.current.send("/pub/game/action", {}, 
      JSON.stringify({
          code: 'GAME_START', 
          roomId: roomId, 
          playerId: token
      })
      );
  
  }
  
  const selectAction = ((target) => {
      console.log(target, "2번");
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
  });
  
  // 대상 확정
  const selectConfirm = () => {
      console.log(selectedTarget + " 플레이어 선택 ");
      console.log(selectedTarget.nickname)
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
  
  // 추방 투표 동의
  const agreeExpulsion = () => {
      stompClient.current.send("/pub/game/action", {}, 
          JSON.stringify({
              code: 'EXPULSION_VOTE',
              roomId: roomId, 
              playerId: token,
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
              roomId: roomId, 
              playerId: token,
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
        const videoElement = publisher.videos[1].video;
        const nowInMs = Date.now();
        const results = await gestureRecognizer.recognizeForVideo(videoElement, nowInMs);
  
        if (results.gestures.length > 0) {
          const detectedGestureName = results.gestures[0][0].categoryName;
          setDetectedGesture(detectedGestureName);
        } else {
          setDetectedGesture('');
        }
        // Continue predicting frames from webcam
        setAnimationFrameId(requestAnimationFrame(predictWebcam));
      }
    };
    const stopPredicting = () => {
      cancelAnimationFrame(animationFrameId); // requestAnimationFrame 중지
      setAnimationFrameId(null);
    };

  return (
    <GameContext.Provider value={{ stompClient, peopleCount, myRole, startVote, setPeopleCount, selectAction, setSelectedTarget, selectConfirm, handleGamePageClick, 
      systemMessages, handleSystemMessage, dayCount, agreeExpulsion, disagreeExpulsion, predictWebcam, stopPredicting, detectedGesture, chatMessages, sendChatMessage, receiveChatMessage, playersRoles,
      voteSituation, currentSysMessage, currentSysMessagesArray, phase}}>
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
