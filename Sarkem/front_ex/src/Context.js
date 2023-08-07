import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { OpenVidu } from 'openvidu-browser';

const RoomContext = createContext();

const RoomProvider = ({ children }) => {
    const [roomSession, setRoomSession] = useState({});
    const [player, setPlayer] = useState({});
    const [players, setPlayers] = useState(new Map());
    const [roomId, setRoomId] = useState('');
    const [gameId, setGameId] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);
    const [camArray, setCamArray] = useState([]);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCamOn, setIsCamOn] = useState(true);
    const [gameOption, setGameOption] = useState({});

    const OV = new OpenVidu();
    const navigate = useNavigate();

    useEffect(() => {
      console.log('RoomProvider 생성');

      // openvidu log 제거
      OV.enableProdMode();
    }, []);

    // useEffect(() => {
    //   if (roomSession.roomId == undefined) return;

    //   console.log(`roomSession roomId 변경 - roomId : ${roomSession.roomId}`);

    //   navigate(`/loading`);
    //   getGameRoom();
      
    // }, [roomSession.roomId]);

    // useEffect(() => {
    //   if (roomSession.gameId == undefined) return;

    //   console.log('roomSession gameId 변경');
    //   console.log(roomSession);
    // }, [roomSession.gameId]);

    useEffect(() => {
      if (player.playerId == undefined) return;

      console.log('player 변경');
      console.log(player);
      setPlayers((prev) => {
        return new Map(prev).set(player.playerId, player);
      });
      console.log(players);
    }, [player]);

    useEffect(() => {
      console.log('players 변경');
      console.log(players);
    }, [players]);

    const getGameRoom = async (roomId) => {
      // 게임방 정보 획득
      console.log(`getGameRoom`);
      const response = await axios.get('/api/game/' + roomId, {
        headers: { 'Content-Type': 'application/json;charset=utf-8', },
      });
      
      if (response.status == '204') {
        // createGameRoom().then(() => {
        //   navigate(`/${roomSession.roomId}`);
        // });
        console.log('gameRoom null');
        return null;
      }
      else if (response.status == '200') {
        console.log('게임방 정보 획득');
        const gameRoom = response.data;
        console.log(gameRoom);
        return gameRoom;
      }
      else {
        alert('게임방 세션 획득 실패');
        console.log(response.data);
        return null;
      };
    }


    // 세션 해제
    const leaveSession = () => {
        console.log("세션 해제중입니다.....")
        // 세션 연결 종료
        if (roomSession.openviduSession) roomSession.openviduSession.disconnect();
        
        // 데이터 초기화
        // setSession(undefined);
        setSubscribers([]);
        setPublisher(undefined);
        setCamArray([]);
        navigate(`/${roomId}`)
    }

    // 특정 유저가 룸을 떠날 시 subscribers 배열에서 삭제
  const deleteSubscriber = (streamManager) => {
    setSubscribers((preSubscribers) => preSubscribers.filter((subscriber) => subscriber !== streamManager))
    setCamArray((prevCamArray) => prevCamArray.filter((user) => user !== streamManager));
  }

    // Openvidu 세션 생성 및 이벤트 정보 등록
  const initSession = async () => {
    console.log(`initSession`);
    // openvidu 세션 시작
    const newSession = OV.initSession();
    

    // 세션에서 발생하는 구체적인 이벤트 정의
    // stream 생성 이벤트 발생 시 subscribers 배열에 추가
    newSession.on('streamCreated', (event) => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      const nickName = JSON.parse(event.stream.streamManager.stream.connection.data).nickName;
      const playerId = JSON.parse(event.stream.streamManager.stream.connection.data).playerId;
      const isMicOn = JSON.parse(event.stream.streamManager.stream.connection.data).isMicOn;
      const isCamOn = JSON.parse(event.stream.streamManager.stream.connection.data).isCamOn;
      setCamArray((camArray) => [...camArray, subscriber]);
      setSubscribers((subscribers) => [...subscribers, subscriber]);
      console.log(`streamCreated subscriber`);
      console.log(subscriber);
      const newPlayer = {
        playerId: playerId,
        nickName: nickName,
        stream: subscriber,
        isMicOn: isMicOn,
        isCamOn: isCamOn,
      };
      setPlayers((prev) => {
        return new Map(prev).set(playerId, newPlayer);
      });
      
      console.log(nickName, "님이 접속했습니다.");
    });

    // stream 종료 이벤트 발생 시
    newSession.on('streamDestroyed', (event) => {
      deleteSubscriber(event.stream.streamManager);
      console.log(JSON.parse(event.stream.streamManager.stream.connection.data).nickName, "님이 접속을 종료했습니다.")
    });

    // stream 예외 이벤트 발생 시 에러 출력
    newSession.on('exception', (e) => console.warn(e));

    console.log(`initSession - session`);
    console.log(newSession);
    // 설정한 세션 useState 갱신
    setRoomSession((prev) => {
      return ({
        ...prev,
        openviduSession: newSession,
      });
    });
    return newSession;
  }

  const connectSession = async (response) => {
    console.log(`connectSession`);
    try {
      const session = response;
      const data = await getToken();
      await session.connect(data.token, {
        nickName: data.nickName, 
        playerId: data.playerId,
        isMicOn: player.isMicOn,
        isCamOn: player.isCamOn,
      });

      // 내 퍼블리셔 객체 생성
      let publisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: player.isMicOn,
        publishVideo: player.isCamOn,
        resolution: '640x480',
        frameRate: 30,
        insertMode: 'APPEND',
        mirror: true,
      });
      // 세션에 내 정보 게시
      session.publish(publisher);

      // 내 디바이스 on/off 상태 게시
      publisher.publishVideo(player.isCamOn);
      publisher.publishAudio(player.isMicOn);
      // 퍼블리셔 useState 갱신
      setPublisher(publisher);
      setPlayer((prevState) => {
        return ({
          ...prevState,
          stream: publisher,
        });
      });
      setCamArray((camArray) => [...camArray, publisher]);
      console.log(publisher)
    }
    catch (error) {
      console.error(error);
      alert("세션 연결 오류");
      navigate("/");
      return;
    }
  }

  const getGameSession = async () => {
    // 게임세션 정보 획득
    const response = await axios.get('/api/game/session/' + roomSession.roomId, {
      headers: { 'Content-Type': 'application/json;charset=utf-8', },
    });
    
    console.log('gamesession 획득');
    console.log(response);
    setGameOption(response.data.gameOption);
    
    return response.data.gameId;
  }


//   // 토큰 생성하는 함수
// const getToken = async () => {
//     // 내 세션ID에 해당하는 세션 생성
//     if (isHost){
//         console.log("방장이므로 세션을 생성합니다.")
//         await createGameRoom(roomId, player.nickName);
//     }
//     // 세션에 해당하는 토큰 요청
//     return await createToken(roomId, player.nickName);
//   }
  
  // 서버에 요청하여 화상 채팅 세션 생성하는 함수
  const createGameRoom = async (roomId) => {
    console.log(`${roomSession.roomId} 세션을 생성합니다.`);
    const response = await axios.post('/api/game', { customSessionId: roomId, nickName: player.nickName }, {
        headers: { 'Content-Type': 'application/json;charset=utf-8', },
    });
    
    console.log('세션 생성됨');
    console.log(response);
    return response.data; // The sessionId
  }
  
  
  // 서버에 요청하여 토큰 생성하는 함수
  const getToken = async () => {
    console.log("세션에 연결을 시도합니다.")
    console.log(player.nickName);
    console.log()
    const response = await axios.post(`/api/game/${roomSession.roomId}/player`, player.nickName, {
      headers: { 'Content-Type': 'application/json;charset=utf-8', },
    });
    
    console.log('createToken ' + response.data.playerId);
    setPlayer((prevState => {
      return ({
        ...prevState,
        playerId: response.data.playerId,
        nickName: response.data.nickName,
      });
    }));

    // setGameId(response.data.gameId);

    return response.data; // The token
  }

  const getPlayer = async (roomId) => {
    const response = await axios.get(`/api/game/${roomId}/player`);
    return response.data;
  }

  return (
    <RoomContext.Provider value={{ roomSession, setRoomSession, createGameRoom, getGameRoom, 
      roomId, setRoomId, gameId, setGameId, isHost, setIsHost,
      publisher, setPublisher, subscribers, setSubscribers, camArray, setCamArray,
      OV, initSession, connectSession, leaveSession, getToken, getPlayer, gameOption, 
      setGameOption, player, setPlayer, players, setPlayers,
      getGameSession}}>
      {children}
    </RoomContext.Provider>
  );
};

const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('roomContext must be used within a RoomProvider');
  }
  return context;
};

export { RoomProvider, useRoomContext };
