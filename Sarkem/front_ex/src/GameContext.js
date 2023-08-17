import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useRoomContext } from './Context';
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';
import ChatButtonAndPopup from './components/buttons/ChatButtonAndPopup';
import axios from "axios";

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const { roomSession, player, setPlayer, players, setPlayers, leaveSession, forceUpdate } = useRoomContext();
  const [ gameSession, setGameSession ] = useState({});
  // 현재 시스템 메시지를 저장할 상태 추가
  const [currentSysMessage, setCurrentSysMessage] = useState(null);
  const [currentSysMessagesArray, setCurrentSysMessagesArray] = useState([]); // 배열 추가
  const [dayCurrentSysMessagesArray, setDayCurrentSysMessagesArray] = useState([]); // 낮 팝업 배열 추가
  const [chatMessages, setChatMessages] = useState([]); 
  const [chatConnected, setChatConnected] = useState(false);
  const [message, setMessage] = useState("");
  
  const [winner, setWinner] = useState(null);
  const jungleRefs = useRef([]);
  const mixedMediaStreamRef = useRef(null);
  const audioContext = useRef(new (window.AudioContext || window.webkitAudioContext)()).current;
  
  const [myVote, setMyVote] = useState(0);
  const [dayCount, setDayCount] = useState(0);
  const [startVote, setStartVote] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState("");
  const [expulsionTarget, setExpulsionTarget] = useState("");
  const [voteSituation, setVotesituation] = useState({});
  const [threatedTarget, setThreatedTarget] = useState("");
  // twilight 투표 설정 위한 타겟id
  const [targetId, setTargetId] = useState("");
  // 남은 시간
  const [remainTime, setRemainTime] = useState(0);
  
  const [psyTarget, setPsyTarget] = useState("");
  const [psychologist, setPsychologist] = useState(false);//심리학자 실행
  const [faceDetectionIntervalId, setFaceDetectionIntervalId] = useState(null);
  const [hiddenMission, setHiddenMission] = useState(false);//히든미션 실행
  const hiddenMissionType = ["Thumb_Up", "Thumb_Down", "Victory", "Pointing_Up", "Closed_Fist", "ILoveYou"];//히든미션 리스트
  const [missionNumber, setMissionNumber] = useState(0);
  const [selectMission, setSelectMission] = useState("");//히든 선택된 히든미션
  const [scMiniPopUp, setScMiniPopUp] = useState(true);//첫날만 직업 카드 자동으로 뜸
  
  // 낮 투표 타겟 저장 위한 타겟
  const [voteTargetId, setVoteTargetId] = useState("");
  const [phase, setphase] = useState("");
  const [gestureRecognizer, setGestureRecognizer] = useState(null);
  const [detectedGesture, setDetectedGesture] = useState('');
  const [animationFrameId, setAnimationFrameId] = useState(null);
  
  // 캠 배열에서 제거하기 위함
  const [deadIds, setDeadIds] = useState([]);

  // 게임 결과 출력을 위한 직업 저장
  const roleAssignedArray = useRef([]);
  
  const navigate = useNavigate();
  let stompClient = useRef({});
  const pingSession = useRef();

  
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
    jungleRefs.current = [];
  }, []);

  useEffect(() => {
    setCurrentSysMessage(null);
    setCurrentSysMessagesArray([]);
    
  }, [gameSession.gameId]);

  useEffect(() => {
    console.log("GestureRecognizer 생성 완료");
  }, [gestureRecognizer]);
  
  // 게임 옵션이 변경되면, callChangeOption 호출
  useEffect(()=> {

    if(!player.current.isHost) return;
    if (gameSession.gameOption === undefined) return;
    callChangeOption();

  }, [gameSession.gameOption]);


  ////////////   GameContext 함수   ////////////

  const initGameSession = () => {
    console.log("initGameSession");
    if (pingSession.current) clearInterval(pingSession.current);  // ping stop
    
    stopPredicting();
    player.current.stream.publishAudio(false);
    player.current.stream.publishVideo(false);
    player.current.isAlive = true;
    for (let player of players.current.values()) {
      player.isAlive = true;
    }
    clearInterval(faceDetectionIntervalId);
    setFaceDetectionIntervalId(null);
    setGameSession({});
    setCurrentSysMessage(null);
    setCurrentSysMessagesArray([]);
    setChatMessages([]);
    setChatConnected(false);
    setMessage("");
    jungleRefs.current = [];
    mixedMediaStreamRef.current = null;
    
    setMyVote(0);
    setDayCount(0);
    setStartVote(false);
    setSelectedTarget("");
    setExpulsionTarget("");
    setVotesituation({});
    setThreatedTarget("");
    setTargetId("");

    setPsyTarget("");
    setPsychologist(false);
    setHiddenMission(false);
    setMissionNumber(0);
    setSelectMission("");
    setScMiniPopUp(true);
    
    setVoteTargetId("");
    setphase("");
    setGestureRecognizer(null);
    setDetectedGesture('');
    setAnimationFrameId(null);
    
    setDeadIds([]);
  }

  // WebSocket 연결
  const connectGameWS = async (event) => {
    
    if (pingSession.current) clearInterval(pingSession.current);

    if (stompClient.current !== undefined && stompClient.current.connected) return;
    console.log("connectGameWS");
    let socket = new SockJS("https://i9a702.p.ssafy.io/ws-stomp");
    stompClient.current = Stomp.over(socket);
    await stompClient.current.connect({}, () => {
      setTimeout(function() {
        connectGame();
        connectChat();
       console.log(stompClient.current.connected);
    }, 500);
    });
    socket.onclose = () => {
      leaveSession();
      if (pingSession.current) clearInterval(pingSession.current);
      alert("socket error");
      navigate("/");
    }
  }

  const onbeforeunload = (event) => {
    unsubscribeRedisTopic();
    leaveSession();
    window.location.href = "/";
  }

  const unsubscribeRedisTopic = () => {
    try{
      unconnectChat();
      unconnectGame();
    } catch(error) {
      console.log(error);
    }
  }

  const sendPing = () => {
    if (pingSession.current) clearInterval(pingSession.current);
    
    // 연결되어 있음을 알리는 메시지 전송
    pingSession.current = setInterval(() => {
      if (!stompClient.current.connected) {
        console.log('sendPing');
        console.log('stompClient.current null');
        if (pingSession.current) clearInterval(pingSession.current);
      }

      if (player.current.playerId === undefined) {
        console.log('sendPing');
        console.log('player.current.playerId null');
        if (pingSession.current) clearInterval(pingSession.current);
      }
      
      if (roomSession.current.gameId === undefined) {
        console.log('sendPing');
        console.log('roomSession.current.gameId null');
        if (pingSession.current) clearInterval(pingSession.current);
      }

      console.log('send ping');
      if (!stompClient.current.connected) {
        if (pingSession.current) clearInterval(pingSession.current);
        return;
      }
      stompClient.current.send('/pub/game/action', {}, JSON.stringify({
        code:'PING',
        roomId: roomSession.current.roomId,
        gameId: roomSession.current.gameId,
        playerId:player.current.playerId, 
      }));
    }, 5000);
  }

  // 게임룸 redis 구독
  const connectGame = () => {
    if (!stompClient.current.connected) return;
    console.log('/sub/game/system/' + roomSession.current.roomId + " redis 구독")
    stompClient.current.subscribe('/sub/game/system/' + roomSession.current.roomId, receiveMessage)
  }

  // 게임 끝나거나 비활성화 할때 //
  const unconnectGame = () => {
    console.log('/sub/game/system/' + roomSession.current.roomId + " redis 구독 취소");
    stompClient.current.unsubscribe('/sub/game/system/' + roomSession.current.roomId, receiveMessage);
  };


  const receiveChatMessage = async (message) => {
    const parsedMessage = JSON.parse(message.body);
    console.log(parsedMessage, "parsedMessage");
    const chatMessage = parsedMessage.message;
    const playerId = parsedMessage.playerId;
    const nickName = parsedMessage.nickName;
    setChatMessages((prevMessages) => [...prevMessages, { message: chatMessage, playerId, nickName }]);
  };
  
  // 채팅 연결할 때 //
  const connectChat = () => {
    if (!stompClient.current.connected) return;
    console.log('/sub/chat/room/' + roomSession.current.roomId + " redis 구독")
    stompClient.current.subscribe('/sub/chat/room/' + roomSession.current.roomId, receiveChatMessage);
  };

  const sendMessage = (message) => {
    if (stompClient.current.connected && player.current.playerId !== null) {
      console.log("메시지: ", message); 
      stompClient.current.send('/pub/chat/room', {}, JSON.stringify({
        type:'TALK', 
        roomId: roomSession.current.roomId,
        playerId:player.current.playerId,
        nickName : player.current.nickName,
        message: message
      }));
    }
  }
  
  // 게임 끝나거나 비활성화 할때 //
  const unconnectChat = () => {
    console.log('/sub/chat/room/' + roomSession.current.roomId + " redis 구독 취소");
    stompClient.current.unsubscribe('/sub/chat/room/' + roomSession.current.roomId, receiveMessage);
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

  // 게임 시작 버튼 클릭
  const handleGamePageClick = () => {
    stompClient.current.send("/pub/game/action", {}, 
      JSON.stringify({
          code:'GAME_START', 
          roomId: roomSession.current.roomId, 
          playerId: player.current.playerId
      })
    );
  };


  const getAlivePlayers = () => {
    return Array.from(players.current.values()).filter((player) => player.isAlive === true);
  }


  const receiveMessage = async (message) => {
    // 시스템 메시지 처리
    let sysMessage = JSON.parse(message.body);
    if (sysMessage.playerId === "ALL" || player.current.playerId === sysMessage.playerId) {
    switch (sysMessage.code) {
      // param에 phase, message
    case "NOTICE_MESSAGE":
        setCurrentSysMessage(()=>sysMessage);
        setCurrentSysMessagesArray(prevMessages => [ ...prevMessages,
        { ...sysMessage, dayCount: sysMessage.param.day }]);
        if(sysMessage.param.phase==="DAY"){
          setDayCurrentSysMessagesArray(prevMessages => [ ...prevMessages,
          { ...sysMessage, dayCount: sysMessage.param.day }]);
        }
    break;

    case "GAME_START":   
        // 게임상태 초기화
        sendPing();
        navigate(`/${roomSession.current.roomId}/day`);
        break;

    case "ONLY_HOST_ACTION":
        break;

    case "OPTION_CHANGED":
        if(player.current.isHost) return;
        setGameSession((prev) => {
          return ({
            ...prev,
            gameOption: sysMessage.param,
          });
        });
        break;

    // 역할 저장을 위해 넣었음 //
    case "ROLE_ASSIGNED":
        const assignedRole = Roles.get(sysMessage.param.role);
        if (assignedRole == null) {
          alert("직업배정에 실패했습니다.", assignedRole);
          return;
        }
        setPlayer([{key: 'role', value: assignedRole}]);
        break;
        
    case "PHASE_DAY":
        setphase("day");
        navigate(`/${roomSession.current.roomId}/day`);
        break;

    case "PHASE_TWILIGHT":
        setphase("twilight");
        navigate(`/${roomSession.current.roomId}/sunset`);
        setThreatedTarget(false); // 저녁 되면 협박 풀림
        setHiddenMission(false);
        break;

    case "PHASE_NIGHT":
        setphase("night");
        setThreatedTarget(false); // 밤 되면 협박 풀림
        setPsyTarget("");//심리학자 끝
        setPsychologist(false);
        setHiddenMission(false);// 밤이 되면 마피아 미션 끝
        setDayCurrentSysMessagesArray([]);
        navigate(`/${roomSession.current.roomId}/night`);
        break;

    case "GAME_END":
        navigate(`/${roomSession.current.roomId}/result`);
        const nowWinner = sysMessage.param.winner;
        setWinner(nowWinner);
        setphase("");
        break;

    case "TARGET_SELECTION":
        setVotesituation({});
        
        setStartVote(true);
        if (sysMessage.param && sysMessage.param.day !== undefined && sysMessage.param.day !== null) {
            setDayCount(sysMessage.param.day);
        }
        break;

    case "VOTE_SITUATION":
        if (sysMessage.param.hasOwnProperty("target")) {
            setVotesituation({ [sysMessage.param.target]: 1 });
        } else {
            setVotesituation(sysMessage.param);
            setVoteTargetId("");
        }
        break;

    case "DAY_VOTE_END":
        setStartVote(false);
        setTargetId(sysMessage.param.targetId);
        
        // 2번 -> sunsetpage로 넘겨서 사용해라

        break;

    case "TARGET_SELECTION_END":
        setSelectedTarget("");
        break;

    case "TWILIGHT_SELECTION":
        setStartVote(true);
        break;

    case "TWILIGHT_SELECTION_END":
        // 추방 투표 완료(개인)
        console.log("추방 투표 완료");
        break;

    case "TWILIGHT_VOTE_END":
      setStartVote(false);

      if (sysMessage.param.result === "true") {
          players.current.get(sysMessage.param.targetId).isAlive = false;
      }
      break;

    case "BE_EXCLUDED":
        console.log("추방 당했습니다.");
        setPlayer([{key: 'role', value: 'OBSERVER'}, {key: 'isAlive', value: false}]);
        break;

    case "BE_HUNTED":
        console.log("삵에게 사냥당했습니다.");
        const newDeadId = sysMessage.param.deadPlayerId;
        setDeadIds(prevDeadIds => [...prevDeadIds, newDeadId]);
        players.current.get(newDeadId).isAlive = false;
        
        if (sysMessage.param && sysMessage.param.deadPlayerId === player.current.playerId) {
          setPlayer([{key: 'role', value: 'OBSERVER'}]);
        }
        break;

    case "BE_THREATED":
        console.log("냥아치에게 협박 당했습니다.");
        setThreatedTarget(true);
        break;

    case "PSYCHOANALYSIS_START":
        console.log("심리 분석을 시작합니다.");
        setPsyTarget(sysMessage.param.targetId);
        setPsychologist(true);
        break;
    case "MISSION_START":
        console.log("미션시작");
        setHiddenMission(true);
        setMissionNumber(sysMessage.param.missionIdx);
        setSelectMission(hiddenMissionType[sysMessage.param.missionIdx]);
        console.log(selectMission);
        break;

    case "PHASE_NIGHT":
        console.log("밤이 되었습니다.");
        navigate(`/${roomSession.current.roomId}/night`);
        break;

    case "LEAVE_PLAYER":
        console.log(sysMessage.param + " 님이 퇴장하셨습니다.");
        players.current.delete(sysMessage.param);
        forceUpdate();
        break;

    case "CHANGE_HOST":
      console.log(`지금부터 당신이 방장입니다.`);
      setPlayer([{key: 'isHost', value: true}]);
      break;

    case "REMAIN_TIME":
        let time = sysMessage.param.time;
        for (let i = 0; i < 5; i++) {
          setTimeout(() => setRemainTime(time - i), i*1000);
        }
        break;

    case "JOB_DISCLOSE":
        const disclosedRoles = sysMessage.param;
        roleAssignedArray.current = [];
    
        for (let i = 0; i < disclosedRoles.job.length; i++) {
          const nickname = disclosedRoles.nickname[i];
          const job = disclosedRoles.job[i];
          const role = disclosedRoles.role[i];
          let team = "";
    
          if (job === "삵") {
            team = "sark";
          } else {
            team = "citizen";
          }
    
          roleAssignedArray.current.push({
            team: team,
            nickname: nickname,
            job: job,
            role: role,
          });
        }
        break;
      }
    }
    else {

      // 역할 저장을 위해 넣었음 //
      switch (sysMessage.code) {
      case "ROLE_ASSIGNED": 
          const assignedRole = Roles.get(sysMessage.param.role);
          if (assignedRole == null) {
            alert("직업배정에 오류가 발생했습니다.", assignedRole);
            return;
          }
          let player = players.current.get(sysMessage.playerId);
          if (player == null) {
            alert("ROLE_ASSIGNED - 플레이어 정보를 불러오는데 실패했습니다.", sysMessage.playerId);
            return;
          }
          player.role = assignedRole;
          setPlayers(player);
          break;

      }
    }
    handleSystemMessage(message);
  }


  const selectAction = ((target) => {
      if (selectedTarget !== target.playerId) {
        setSelectedTarget(target.playerId);
      } else {
        setSelectedTarget(null);
        target = null;
      }
      if (stompClient.current.connected && player.current.playerId !== null) {
          stompClient.current.send("/pub/game/action", {},
              JSON.stringify({
                  code: 'TARGET_SELECT',
                  roomId: roomSession.current.roomId,
                  playerId: player.current.playerId,
                  param: {
                      target: target.playerId
                  }
              }))
      }
  });
  
  // 대상 확정
  const selectConfirm = () => {
      if (stompClient.current.connected && player.current.playerId !== null) {
          stompClient.current.send("/pub/game/action", {},
              JSON.stringify({
                  code: 'TARGET_SELECTED', // 
                  roomId: roomSession.current.roomId,
                  playerId: player.current.playerId,
                  param: {}
              }));
      }
  };
  
  // 추방 투표 동의
  const agreeExpulsion = () => {
      stompClient.current.send("/pub/game/action", {}, 
          JSON.stringify({
              code: 'EXPULSION_VOTE',
              roomId: roomSession.current.roomId, 
              playerId: player.current.playerId,
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
              roomId: roomSession.current.roomId, 
              playerId: player.current.playerId,
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

    // 미션성공
    const missionConplete = () => {
      console.log("미션 성공");
      setHiddenMission(false);
      setSelectMission("");
      stopPredicting();
        if (stompClient.current.connected && player.current.playerId !== undefined) {
            stompClient.current.send("/pub/game/action", {},
                JSON.stringify({
                    code: 'HIDDENMISSION_SUCCESS ',
                    roomId: roomSession.current.roomId,
                    playerId: player.current.playerId,
                    param: {}
                }));
        }
    };

    const predictWebcam = () => {
      try {
        if (gestureRecognizer) {
          const videoElement = player.current.stream.videos[player.current.stream.videos.length-1].video;
          const nowInMs = Date.now();
          const results = gestureRecognizer.recognizeForVideo(videoElement, nowInMs);
          let detectedGestureName;
          if (results.gestures.length > 0) {
            detectedGestureName = results.gestures[0][0].categoryName;
            console.log(detectedGestureName);
          }
          if(selectMission===detectedGestureName){
            missionConplete();
            setHiddenMission(false);
          }else{
            setAnimationFrameId(setTimeout(() => requestAnimationFrame(predictWebcam), 500));
          }

        }
      } catch (error) {
        console.log("오류발생");
        setAnimationFrameId(setTimeout(() => requestAnimationFrame(predictWebcam), 500));
      }

  };

  const stopPredicting = () => {
    if (animationFrameId !== null) {
      console.log("미션 끝");
      cancelAnimationFrame(animationFrameId); // Cancel the animation frame
      clearTimeout(animationFrameId); // Clear the timeout
      setAnimationFrameId(null);
    }
  };

    // 중복 제거 함수 정의
const removeDuplicateVideosFromStream = (player) => {
  player.stream.videos = player.stream.videos.filter((video, index, self) => {
    const firstIndex = self.findIndex(v => v.id === video.id && v.name === video.name);
    const lastIndex = self.lastIndexOf(v => v.id === video.id && v.name === video.name);
    return index === firstIndex || index === lastIndex;
  });
}

const uniquePlayers = () => {
  // Map의 각 요소에 대해 중복 제거 함수 적용
  try{
    console.log("중복값제거")
    players.current.forEach((player) => {
      removeDuplicateVideosFromStream(player);
    });
  } catch(error) {
    console.log("중복 제거 실패");
  }
}

  // 변경된 게임 옵션을 redis 토픽에 전달
  const callChangeOption = () => {
    if (stompClient.current === undefined) return;
    if(stompClient.current.connected) {
      stompClient.current.send("/pub/game/action", {}, 
          JSON.stringify({
              code:'OPTION_CHANGE', 
              roomId: roomSession.current.roomId,
              playerId: player.current.playerId,
              param: gameSession.gameOption
      }));
    }
  };

  const chatVisible = () =>{
    if (player.current.role === 'OBSERVER'){
      return (
        <>
          <ChatButtonAndPopup />
        </>
      )
    }
  };

  return (
    <GameContext.Provider value={{ stompClient, startVote, selectAction, setSelectedTarget, selectConfirm, handleGamePageClick, connectGameWS,
      systemMessages, handleSystemMessage, dayCount, agreeExpulsion, disagreeExpulsion, predictWebcam, stopPredicting, detectedGesture, chatMessages, receiveChatMessage,
      voteSituation, currentSysMessage, currentSysMessagesArray, setCurrentSysMessagesArray,phase, targetId, sendMessage, threatedTarget, getGameSession, gameSession, setGameSession, chatVisible, 
      Roles, sendMessage, jungleRefs, mixedMediaStreamRef, audioContext, winner, setWinner, voteTargetId, deadIds, psyTarget, hiddenMission, setHiddenMission, remainTime, 
      psychologist, scMiniPopUp, setScMiniPopUp, loadGestureRecognizer, missionNumber, getAlivePlayers, roleAssignedArray, unsubscribeRedisTopic, initGameSession, uniquePlayers, pingSession,
      faceDetectionIntervalId, setFaceDetectionIntervalId, dayCurrentSysMessagesArray, setDayCurrentSysMessagesArray, sendPing, onbeforeunload, setPsychologist }}
    >
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
