import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { OpenVidu } from 'openvidu-browser';

const RoomContext = createContext();

const RoomProvider = ({ children }) => {
    const [roomId, setRoomId] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [nickName, setNickName] = useState('냥냥' + Math.floor(Math.random() * 100));
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);
    const [camArray, setCamArray] = useState([]);
    const [session, setSession] = useState(undefined);
    const [token, setToken] = useState(null);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCamOn, setIsCamOn] = useState(true);

    const OV = new OpenVidu();
    const navigate = useNavigate();


    useEffect(() => {

        if (session) {
          // 토큰 발급
          connectSession();
        }
      }, [session]);

    // 세션 해제
    const leaveSession = () => {
        console.log("세션 해제중입니다.....")
        // 세션 연결 종료
        if (session) session.disconnect();
        
        // 데이터 초기화
        setSession(undefined);
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
  const joinSession = async () => {
    // openvidu 세션 시작
    const newSession = OV.initSession();
    

    // 세션에서 발생하는 구체적인 이벤트 정의
    // stream 생성 이벤트 발생 시 subscribers 배열에 추가
    newSession.on('streamCreated', (event) => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      setCamArray((camArray) => [...camArray, subscriber]);
      setSubscribers((subscribers) => [...subscribers, subscriber]);
      
      console.log(JSON.parse(event.stream.streamManager.stream.connection.data).userData, "님이 접속했습니다.");
    });

    // stream 종료 이벤트 발생 시
    newSession.on('streamDestroyed', (event) => {
      deleteSubscriber(event.stream.streamManager);
      console.log(JSON.parse(event.stream.streamManager.stream.connection.data).userData, "님이 접속을 종료했습니다.")
    });

    // stream 예외 이벤트 발생 시 에러 출력
    newSession.on('exception', (e) => console.warn(e));

    // 설정한 세션 useState 갱신
    setSession(newSession);
  }

  const connectSession = () => {
    getToken(roomId, nickName, isHost).then(async (response) => {
        try{
          const token = response.split("token=")[1];
          setToken(token);
          console.log(token);
          // 세션에 유저 데이터 입력 후 연결 시도
          await session.connect(response, {userData: nickName});

          // 내 퍼블리셔 객체 생성
          let publisher = await OV.initPublisherAsync(undefined, {
            audioSource: undefined,
              videoSource: undefined,
              publishAudio: isMicOn,
              publishVideo: isCamOn,
              resolution: '640x480',
              frameRate: 30,
              insertMode: 'APPEND',
              mirror: true,
          });
          // 세션에 내 정보 게시
          session.publish(publisher);

          // 내 디바이스 on/off 상태 게시
          publisher.publishVideo(isCamOn);
          publisher.publishAudio(isMicOn);
          // 퍼블리셔 useState 갱신
          setPublisher(publisher);
          setCamArray((camArray) => [...camArray, publisher]);
          console.log(publisher)
        }
        catch (error) {
          console.error(error);
          alert("세션 연결 오류");
          navigate("/");
          return;
        }
      })
  }


  // 토큰 생성하는 함수
const getToken = async () => {
  // 내 세션ID에 해당하는 세션 생성
  if (isHost){
      console.log("방장이므로 세션을 생성합니다.")
      await createSession(roomId, nickName);
  }
  // 세션에 해당하는 토큰 요청
  return await createToken(roomId, nickName);
  }
  
  // 서버에 요청하여 화상 채팅 세션 생성하는 함수
  const createSession = async () => {
  console.log(`${roomId} 세션에 대한 토큰을 발급 받습니다.`);
  const response = await axios.post('/api/game', { customSessionId: roomId, nickName: nickName }, {
      headers: { 'Content-Type': 'application/json', },
  });
  return response.data; // The sessionId
  }
  
  
  // 서버에 요청하여 토큰 생성하는 함수
  const createToken = async () => {
  console.log("세션에 연결을 시도합니다.")
  const response = await axios.post(`/api/game/${roomId}/player`,nickName);
  return response.data; // The token
  }

  const getPlayer = async (roomId) => {
    const response = await axios.get(`/api/game/${roomId}/player`);
    return response.data;
  }

  return (
    <RoomContext.Provider value={{ roomId, setRoomId, isHost, setIsHost, nickName, setNickName,
    publisher, setPublisher, subscribers, setSubscribers, camArray, setCamArray,
    session, setSession, token, setToken, OV, joinSession, connectSession, leaveSession, isCamOn, setIsCamOn, isMicOn, setIsMicOn
    , getToken, getPlayer}}>
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
