import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useRoomContext } from './Context';
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';
import ChatButtonAndPopup from './components/buttons/ChatButtonAndPopup';
import DayPopup from './components/games/DayPopup';
import { Message } from '@stomp/stompjs';
import axios from "axios";
import nightCamAudio from './components/camera/DayNightCamera';

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const { roomSession, player, setPlayer, players } = useRoomContext();
  const [ gameSession, setGameSession ] = useState({});
  // 현재 시스템 메시지를 저장할 상태 추가
  const [currentSysMessage, setCurrentSysMessage] = useState(null);
  const [currentSysMessagesArray, setCurrentSysMessagesArray] = useState([]); // 배열 추가
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
  const [hiddenMission, setHiddenMission] = useState(false);//히든미션 실행
  const hiddenMissionType = ["Thumb_Up", "Thumb_Down", "Victory", "Pointing_Up", "Closed_Fist", "ILoveYou"];//히든미션 리스트
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
  
  const navigate = useNavigate();
  const location = useLocation();
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
    jungleRefs.current = [];
  }, []);

  useEffect(() => {
    console.log(`playerId : ${player.playerId}`);
    if (player.stream !== undefined) {

      // setPlayers((prev) => {
      //   return new Map([...prev, [player.playerId, player]]);
      // });
      players.current.set(player.playerId, player);
      connectGameWS();
      loadGestureRecognizer();
    }
  }, [player.stream]);

  // useEffect(() => {
  //   if (players.size>0) {
      
  //   }
  // }, [players])

  useEffect(() => {
    console.log("GestureRecognizer 생성 완료");
  }, [gestureRecognizer]);
  
  // 게임 옵션이 변경되면, callChangeOption 호출
  useEffect(()=> {

    if(!player.isHost) return;

    callChangeOption();

  }, [gameSession.gameOption]);


  ////////////   GameContext 함수   ////////////

  // 마피아 반환 함수
    // useEffect(()=>{
    //   if(myRole){
    //     console.log(camArray);
    //     const sarks = Object.keys(playersRoles).filter(playerId => playersRoles[playerId] === "SARK");
    //     console.log(sarks);
    //     for (let i = 0; i < camArray.length; i++) {
    //       console.log(sarks.includes(JSON.parse(camArray[i].stream.connection.data).token));
    //       if (sarks.includes(JSON.parse(camArray[i].stream.connection.data).token)) {
    //         const mafia = camArray[i].stream.mediaStream;
    //         console.log(mafia);
    //         setMafias((mafias) => [...mafias, mafia]);
    //       }
    //     }
    //     console.log(mafias);
    //   }
    // },[myRole])

  // WebSocket 연결
  const connectGameWS = async (event) => {
    if (stompClient.current === undefined) return;
    console.log("connectGameWS");
    let socket = new SockJS("http://localhost:8080/ws-stomp");
    stompClient.current = Stomp.over(socket);
    await stompClient.current.connect({}, () => {
      setTimeout(function() {
        // onSocketConnected();
        console.log(players);
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
    if (!stompClient.current.connected) return;
    console.log('/sub/game/system/' + window.sessionStorage.getItem("roomId") + " redis 구독")
    stompClient.current.subscribe('/sub/game/system/' + window.sessionStorage.getItem("roomId"), receiveMessage)
  }


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

  // 채팅 연결할 때 //
  const connectChat = () => {
    if (!stompClient.current.connected) return;
    console.log('/sub/chat/room/' + window.sessionStorage.getItem("roomId") + " redis 구독")
    stompClient.current.subscribe('/sub/chat/room/' + window.sessionStorage.getItem("roomId"), receiveChatMessage);
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
  
  // 게임 끝나거나 비활성화 할때 //
  const unconnectChat = () => {
    console.log('/sub/chat/room/' + roomSession.roomId + " redis 구독");
    stompClient.current.unsubscribe('/sub/chat/room/' + roomSession.roomId, receiveMessage);
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

    if (player.playerId === sysMessage.playerId || sysMessage.playerId === "ALL") {
    console.log(players);
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
    // 역할 저장을 위해 넣었음 //
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
        
    case "PHASE_DAY":
        setphase("day");
        navigate(`/${roomSession.roomId}/day`);
        break;

    case "PHASE_TWILIGHT":
        setphase("twilight");
        navigate(`/${roomSession.roomId}/sunset`);
        setThreatedTarget(false); // 저녁 되면 협박 풀림
        setHiddenMission(false);
        break;

    case "PHASE_NIGHT":
        setphase("night");
        setThreatedTarget(false); // 밤 되면 협박 풀림
        setPsyTarget("");//심리학자 끝
        setPsychologist(false);
        setHiddenMission(false);// 밤이 되면 마피아 미션 끝
        console.log(phase);
        navigate(`/${roomSession.roomId}/night`);
        break;

    case "GAME_END":
        navigate(`/${roomSession.roomId}/result`);
        const nowWinner = sysMessage.param.winner;
        console.log(nowWinner);
        setWinner(nowWinner);
        setphase("");
        break;

    case "TARGET_SELECTION":
        // alert('투표가 시작됐습니다');
        setStartVote(true);
        setVotesituation({});
    
        if (sysMessage.param && sysMessage.param.day !== undefined && sysMessage.param.day !== null) {
            setDayCount(sysMessage.param.day);
        }
        break;

    case "VOTE_SITUATION":
        if (sysMessage.param.hasOwnProperty("target")) {
            // setVotesituation(sysMessage.param.target);
            console.log(sysMessage.param.target, "타겟저장");
            setVotesituation({ [sysMessage.param.target]: sysMessage.param.target });
            
        } else {
            setVotesituation(sysMessage.param);
            setVoteTargetId("");
        }
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
        // alert("저녁 투표 완료 \n 투표 결과: " + sysMessage.param.result);
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
        if (sysMessage.param && sysMessage.param.deadPlayerId === player.playerId) {
          setPlayer((prev) => {
            return ({
              ...prev,
              role: Roles.OBSERVER,
            });
          });
        }
        break;

    case "BE_THREATED":
        // alert("냥아치 협박 시작!", sysMessage.playerId);
        setThreatedTarget(true);
        // setPlayer((prev) => {
        //   return ({
        //     ...prev,
        //     isMicOn: false,
        //   });
        // });
        break;

    case "PSYCHOANALYSIS_START":
        setPsyTarget(sysMessage.param.targetId);
        setPsychologist(true);
        break;
    case "MISSION_START":
        console.log("미션시작");
        setHiddenMission(true);
        setSelectMission(hiddenMissionType[sysMessage.param.missionIdx]);
        console.log(selectMission);
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
      break;

    case "REMAIN_TIME":
        setRemainTime(sysMessage.param.time);
        // console.log("남은 시간: ",sysMessage.param.time);
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
        // TODO: 게임 종료됐을 때, 직업 구성 받기
        // setRoleAssignedArray((prevArray) => [...prevArray, ...newRoleAssignedArray]);
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
          player = {
            ...player,
            role: assignedRole,
          };
          // setPlayers((prev) => {
          //   return new Map([
          //     ...prev,
          //     [player.playerId, player],
          //   ]);
          // });
          players.current.set(player.playerId, player);
          break;
      case "BE_HUNTED":
          const newDeadId = sysMessage.param.deadPlayerId;
          setDeadIds(prevDeadIds => [...prevDeadIds, newDeadId]);
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

      // console.log(voteTargetId, "여기에요");
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

    // 미션성공
    const missionConplete = () => {
        console.log("미션 성공");
        if (stompClient.current.connected && player.playerId !== undefined) {
            stompClient.current.send("/pub/game/action", {},
                JSON.stringify({
                    code: 'HIDDENMISSION_SUCCESS ', // 스킵했을 때도 얘도 보내달라
                    roomId: roomSession.roomId,
                    playerId: player.playerId,
                    param: {
                        // target: selectedTarget
                    }
                }));
        }
    };

    // 
    const predictWebcam = async () => {
      console.log(selectMission);
      try {
        if (gestureRecognizer) {
          const videoElement = player.stream.videos[player.stream.videos.length-1].video;
          const nowInMs = Date.now();
          const results = await gestureRecognizer.recognizeForVideo(videoElement, nowInMs);
    
          if (results.gestures.length > 0) {
            const detectedGestureName = results.gestures[0][0].categoryName;
            if(selectMission===detectedGestureName){
              console.log("미션성공한건가용");
              missionConplete();
              setHiddenMission(false);
              stopPredicting();
            }
          }
        }
        // Continue predicting frames from webcam
        setAnimationFrameId(setTimeout(() => requestAnimationFrame(predictWebcam), 500));

      } catch (error) {
        setAnimationFrameId(setTimeout(() => requestAnimationFrame(predictWebcam), 500));
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

  const chatVisible = () =>{
    // DEBUG:
    // if (player.role === 'OBSERVER'){
      return (
        <>
          <ChatButtonAndPopup />
        </>
      )
    // }
  }

  return (
    <GameContext.Provider value={{ stompClient, startVote, selectAction, setSelectedTarget, selectConfirm, handleGamePageClick, 
      systemMessages, handleSystemMessage, dayCount, agreeExpulsion, disagreeExpulsion, predictWebcam, stopPredicting, detectedGesture, chatMessages, receiveChatMessage,
      voteSituation, currentSysMessage, currentSysMessagesArray, phase, targetId, sendMessage, threatedTarget, getGameSession, gameSession, setGameSession, chatVisible, 
      Roles, sendMessage, jungleRefs, mixedMediaStreamRef, audioContext, winner, setWinner, 
      voteTargetId, deadIds, psyTarget, hiddenMission, setHiddenMission, remainTime, psychologist, scMiniPopUp, setScMiniPopUp, loadGestureRecognizer }}
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
