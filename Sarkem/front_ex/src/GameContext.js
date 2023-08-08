import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useRoomContext } from './Context';
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';
import DayPopup from './components/games/DayPopup';
import { Message } from '@stomp/stompjs';
import axios from "axios";
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
    const [chatMessages, setChatMessages] = useState([]); 
    const [chatConnected, setChatConnected] = useState(false);
    const [message, setMessage] = useState("");
    
    const [mafias, setMafias] = useState([]);
    const [winner, setWinner] = useState(null);
    const jungleRefs = useRef([]);
    const mixedMediaStreamRef = useRef(null);
    const audioContext = useRef(new (window.AudioContext || window.webkitAudioContext)()).current;

    useEffect(()=>{
      jungleRefs.current = [];

    },[])
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
    const [threatedTarget, setThreatedTarget] = useState(false);
    
    // twilight 투표 설정 위한 타겟id
    const [targetId, setTargetId] = useState("");
    const [roleAssignedArray, setRoleAssignedArray] = useState([]);

    // 낮 투표 타겟 저장 위한 타겟
    const [voteTargetId, setVoteTargetId] = useState("");

    // 캠 배열에서 제거하기 위함
    const [deadId, setdeadId] = useState("");


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

    useEffect(()=>{
      if(myRole){
        console.log(camArray);
        const sarks = Object.keys(playersRoles).filter(playerId => playersRoles[playerId] === "SARK");
        console.log(sarks);
        for (let i = 0; i < camArray.length; i++) {
          console.log(sarks.includes(JSON.parse(camArray[i].stream.connection.data).token));
          if (sarks.includes(JSON.parse(camArray[i].stream.connection.data).token)) {
            const mafia = camArray[i].stream.mediaStream;
            console.log(mafia);
            setMafias((mafias) => [...mafias, mafia]);
          }
        }
        console.log(mafias);
      }
    },[myRole])

  // WebSocket 연결
  const connectGameWS = async (event) => {
    let socket = new SockJS("http://localhost:8080/ws-stomp");
    stompClient.current = Stomp.over(socket);
    await stompClient.current.connect({}, () => {
     setTimeout(function() {
       onSocketConnected();
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
    console.log('/sub/game/system/' + roomId + " redis 구독")
    stompClient.current.subscribe('/sub/game/system/' + roomId, receiveMessage)
  }

  // 채팅 연결할 때 //
  const connectChat = () => {
    console.log('/sub/chat/room/' + roomId + " redis 구독")
    stompClient.current.subscribe('/sub/chat/room/' + roomId, receiveChatMessage);
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
    if (stompClient.current.connected && token !== null) {
      console.log("stompclient 연결됨"); 
      stompClient.current.send('/pub/chat/room', {}, JSON.stringify({
        type:'ENTER',
        playerId:token, 
        roomId: roomId,
        message: message
      }));
    }
  };

  const sendMessage = (message) => {
    if (stompClient.current.connected && token !== null) {
      console.log("Talk 타입 메시지 들간다"); 
      console.log("메시지: ", message); 
      stompClient.current.send('/pub/chat/room', {}, JSON.stringify({
        type:'TALK', 
        roomId: roomId,
        playerId:token,
        message: message
      }));
    }
  }

//   const sendMessage = async (e) => {
//    console.log("메시지 보낸다");
//    if (message === '') return;
//    await stompClient.current.send('/pub/chat/room', {}, JSON.stringify({type:'TALK', roomId:roomId, playerId:token, message: message}))
//    setMessage('');
//  }


  // 게임 끝나거나 비활성화 할때 //
  const unconnectChat = () => {
    console.log('/sub/chat/room/' + roomId + " redis 구독")
    stompClient.current.unsubscribe('/sub/chat/room/' + roomId, receiveMessage)
  };


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
            // alert('방장만 실행 가능합니다.');
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
            setThreatedTarget(false); // 저녁 되면 협박 풀림
            break;

        case "PHASE_NIGHT":
            setphase("night");
            console.log(phase);
            navigate(`/${roomId}/night`)
            break;
        
        case "GAME_END":
            navigate(`/${roomId}/result`)
            const nowWinner = sysMessage.param.winner;
            console.log(nowWinner);
            setWinner(nowWinner);
            break;

        case "TARGET_SELECTION":
          setStartVote(true);
      
          if (sysMessage.param && sysMessage.param.day !== undefined && sysMessage.param.day !== null) {
              setDayCount(sysMessage.param.day);
          }
          break;

        case "VOTE_SITUATION":
            console.log(sysMessage.param, "얘일걸");
            setVotesituation(sysMessage.param);
            setVoteTargetId("");
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
            setMyRole("OBSERVER");
            break;

        case "BE_HUNTED":
          if (sysMessage.param && sysMessage.param.deadPlayerId === token) {
              setMyRole("OBSERVER");
          }
          break;

        case "BE_THREATED":
            // alert("냥아치 협박 시작!", sysMessage.playerId);
            setThreatedTarget(true);
            console.log(threatedTarget);
            // setIsMicOn(false);
            break;

        case "PHASE_NIGHT":
            navigate(`/${roomId}/night`);
            break;

            case "JOB_DISCLOSE":
              const disclosedRoles = sysMessage.param;
              // console.log(sysMessage.param)
              // console.log(sysMessage.param.job.length)
                const newRoleAssignedArray = [];
            
                for (let i = 0; i < disclosedRoles.job.length; i++) {
                  const nickname = disclosedRoles.nickname[i];
                  const job = disclosedRoles.job[i];
                  let team = "";
            
                  if (job === "삵") {
                    team = "sark";
                  } else {
                    team = "citizen";
                  }
            
                  newRoleAssignedArray.push({
                    team: team,
                    nickname: nickname,
                    job: job,
                  });
                }
            
                setRoleAssignedArray((prevArray) => [...prevArray, ...newRoleAssignedArray]);
              break;
    }
            
      }
      //여기는 모두에게 보내는거
      else{
        
        // 역할 저장을 위해 넣었음 //
        switch (sysMessage.code) {
          case "ROLE_ASSIGNED":
             
              setPlayersRoles((prevRoles) => ({
                  ...prevRoles,
                  [sysMessage.playerId]: sysMessage.param.role
              }));
              break;

          case "BE_HUNTED":
            setdeadId(sysMessage.param.deadPlayerId);
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
      if (selectedTarget !== "") {
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

      console.log(voteTargetId, "여기에요");
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
      systemMessages, handleSystemMessage, dayCount, agreeExpulsion, disagreeExpulsion, predictWebcam, stopPredicting, detectedGesture, chatMessages, receiveChatMessage, playersRoles,
      voteSituation, currentSysMessage, currentSysMessagesArray, phase, targetId, roleAssignedArray, sendMessage, mafias, setMafias, jungleRefs, mixedMediaStreamRef, audioContext, voteTargetId, winner, setWinner, 
      voteTargetId, deadId, threatedTarget}}>
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
