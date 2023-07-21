import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import React from "react";
import UserVideoComponent from "../components/UserVideoComponent";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SockJS from 'sockjs-client';
import {Stomp} from "@stomp/stompjs";

import "../css/Room.css"
import Chat from "../components/Chat";

function Room () {
    const [mySessionId, setMySessionId] = useState('tmpSession42');
    const [myUserName, setMyUserName] = useState('');
    const [session, setSession] = useState(undefined);
    const [mainStreamManager, setMainStreamManager] = useState(undefined);
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [dead, setDead] = useState(false);

    let stompCilent = useRef({});

    const navigate = useNavigate();
    const location = useLocation();

    // openvidu 객체 생성
    const OV = new OpenVidu();

    // 화면 렌더링 시 최초 1회 실행
    useEffect(() => {
        if (location.state === null || location.state.sessionId === null) {
            console.log("세션 정보가 없습니다.")
            navigate("/");
            return;
        }

        // 이전 화면으로부터 받아온 데이터 세팅
        setMySessionId(location.state.sessionId);
        setMyUserName(location.state.userName);
        setVideoEnabled(location.state.videoEnabled);
        setAudioEnabled(location.state.audioEnabled);
        
        // 윈도우 객체에 화면 종료 이벤트 추가
        window.addEventListener('beforeunload', onbeforeunload);
        
        // 세션에 가입
        joinSession();
        connect();
        return () => {
            window.removeEventListener('beforeunload', onbeforeunload);
            leaveSession();
        }
    }, []);

    // 화면을 새로고침 하거나 종료할 때 발생하는 이벤트
    const onbeforeunload = () => {
        leaveSession();
    }

    // 세션 해제
    const leaveSession = () => {
        // 세션 연결 종료
        if (session) session.disconnect();
        
        // 데이터 초기화
        setSession(undefined);
        setSubscribers([]);
        setMySessionId(mySessionId);
        setMyUserName(myUserName + Math.floor(Math.random() * 100));
        setMainStreamManager(undefined);
        setPublisher(undefined);
        navigate("/")
    }

    // 내 웹캠 On/Off
    const toggleVideo = () => {
        const enabled = !videoEnabled;
        setVideoEnabled(enabled);
        publisher.publishVideo(enabled);
    }
    
    // 내 마이크 On/Off
    const toggleAudio = () => {
        const enabled = !audioEnabled;
        setAudioEnabled(enabled);
        publisher.publishAudio(enabled);
    }
    

    // 특정 유저가 룸을 떠날 시 subscribers 배열에서 삭제
    const deleteSubscriber = (streamManager) => {
        setSubscribers((preSubscribers) => preSubscribers.filter((subscriber) => subscriber !== streamManager))
    }


    // 토큰 생성하는 함수
    const getToken = async () => {
        // 내 세션ID에 해당하는 세션 생성
        const sessionId = await createSession(mySessionId);
        // 세션에 해당하는 토큰 요청
        return await createToken(sessionId);
    }

    // 서버에 요청하여 세션 생성하는 함수
    const createSession = async (sessionId) => {
        const response = await axios.post('/api/sessions', { customSessionId: sessionId }, {
            headers: { 'Content-Type': 'application/json', },
        });
        return response.data; // The sessionId
    }

    // 서버에 요청하여 토큰 생성하는 함수
    const createToken = async (sessionId) => {
        const response = await axios.post('/api/sessions/' + sessionId + '/connections', {}, {
            headers: { 'Content-Type': 'application/json', },
        });
        return response.data; // The token
    }

    // 세션 객체 생성 시 실행
    useEffect(() => {
        if(session) {
            // 토큰 생성
            getToken().then(async (response) => {
                try {
                    // 생성된 토큰을 통해 세션에 연결 요청
                    await session.connect(response, {clientData: myUserName})
                    
                    // 내 통신정보(퍼블리셔) 객체 생성
                    let publisher = await OV.initPublisherAsync(undefined, {
                        audioSource: undefined,
                        videoSource: undefined,
                        publishAudio: videoEnabled,
                        publishVideo: audioEnabled,
                        resolution: '640x480',
                        frameRate: 30,
                        insertMode: 'APPEND',
                        mirror: true,
                    });
                    // 세션에 내 정보 게시
                    session.publish(publisher);

                    // 내 디바이스 on/off 상태 게시
                    publisher.publishVideo(videoEnabled);
                    publisher.publishAudio(audioEnabled);
                    // 내 디바이스에서 비디오 객체 추출
                    const devices = await OV.getDevices();
                    const videoDevices = devices.filter((device) => device.kind === 'videoinput');
                   
                    // 기본 설정된 캠 정보 추출 (아직 필요한지 모르겠음)
                    const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].id;
                    // const currentVideoDevice = videoDevices.find((device) => device.deviceId === currentVideoDeviceId);
                    
                    // 화상 채팅 통신 상태 갱신
                    setPublisher(publisher);
                    setMainStreamManager(publisher);
                } catch (error) {
                    console.log(error);
                    alert("세션 연결 오류");
                    navigate("/");
                }
            });
        }
    }, [session])

    // 세션 생성 및 이벤트 정보 등록
    const joinSession = async () => {
    
        // 세션 시작
        const newSession = OV.initSession();
        
    
        // 세션에서 발생하는 구체적인 이벤트 정의
        // stream 생성 이벤트 발생 시
        newSession.on('streamCreated', (event) => {
            const subscriber = newSession.subscribe(event.stream, undefined);
            setSubscribers((subscribers) => [...subscribers, subscriber]);
            console.log(JSON.parse(event.stream.streamManager.stream.connection.data).clientData, "님이 접속했습니다.");
        })

        // stream 종료 이벤트 발생 시
        newSession.on('streamDestroyed', (event) => {
            deleteSubscriber(event.stream.streamManager);
            console.log(JSON.parse(event.stream.streamManager.stream.connection.data).clientData, "님이 접속을 종료했습니다.")
        })

        // stream 예외 이벤트 발생 시
        newSession.on('exception', (exception) => console.warn(exception));

        // 세션 갱신
        setSession(newSession);
    }

    const copyGameLink = async () => {
        await navigator.clipboard.writeText("localhost:3000/"+mySessionId).then(alert("게임 링크가 복사되었습니다."));
    }

    // 다른 유저 카메라 on/off 하는 함수
    const toggleSubbsVideoHandler = (sub) => {
        console.log(sub);
        sub.subscribeToVideo(!sub.properties.subscribeToVideo);
        sub.properties.subscribeToVideo = !sub.properties.subscribeToVideo
    }

    const connect = (event) => {
        let socket = new SockJS("http://localhost:8080/ws-stomp");
        stompCilent.current = Stomp.over(socket);
        stompCilent.current.connect({}, () => {
         setTimeout(function() {
           onConnected();
         }, 500);
        })
       }
     
       function onConnected() {
         // user 개인 구독
         stompCilent.current.subscribe(`/sub/chat/room/CHAT_${location.state.sessionId}`, function(message){
           setChatMessages((messages) => [...messages, message.body]);
  
           console.log(message.body);
         })
         // stompClient.current.subscribe('/room/' + chatObj.id + '/queue/messages', onMessageReceived);
       }

       const sendMessage = async (e) => {
        e.preventDefault();
        await stompCilent.current.send("/pub/chat/message", {}, JSON.stringify({type:'TALK', roomId:"CHAT_"+mySessionId, sender:myUserName, message: message}))
        setMessage("");
      }
       const ChangeMessages = (event) => {
        setMessage(event.target.value);
      }

      const enterChatRoom =  () => {
        console.log("채팅방 생성");
        axios.post(`http://localhost:8080/chat/room?name=CHAT_${location.state.sessionId}`)
        .then(res => {
          console.log(res);
        })
        
        axios.get(`http://localhost:8080/chat/room/CHAT_${location.state.sessionId}`)
        .then(res => {
          console.log(res);
        })
        // onConnected();
        stompCilent.current.send("/pub/chat/message", {}, JSON.stringify({type:'ENTER', roomId:"CHAT_"+mySessionId, sender:myUserName}));
      }

    const deathAndOpenChat = () => {
        if (dead) return;
        enterChatRoom();
        setDead(!dead);
        
    }
    return (
        <div id="session">
            <div id="session-header">
                <h1 id="session-title">Room ID: {mySessionId}</h1>
                <input
                    className="btn btn-large btn-danger"
                    type="button"
                    id="buttonLeaveSession"
                    onClick={leaveSession}
                    value="게임 떠나기"
                />
                <input
                    className="btn btn-large btn-danger"
                    type="button"
                    id="buttonLeaveSession"
                    onClick={copyGameLink}
                    value="게임 초대하기"
                />
                <input
                    className="btn btn-large btn-danger"
                    type="button"
                    id="buttonLeaveSession"
                    onClick={toggleVideo}
                    value={`캠 ${videoEnabled ? "OFF" : "ON"}`}
                />
                <input
                    className="btn btn-large btn-danger"
                    type="button"
                    id="buttonLeaveSession"
                    onClick={toggleAudio}
                    value={`마이크 ${audioEnabled ? "OFF" : "N"}`}
                />
                <input
                    className="btn btn-large btn-danger"
                    type="button"
                    id="buttonLeaveSession"
                    onClick={deathAndOpenChat}
                    value={`죽기`}
                /> 
            </div>
            {/* {mainStreamManager !== undefined ? (
                <div id="main-video" className="col-md-6">
                    <UserVideoComponent streamManager={mainStreamManager} />

                </div>
            ) : null} */}
            <div id="video-container" className="">

                {publisher !== undefined ? (
                    <div className="stream-container" onClick={() => console.log(publisher)}>
                        <UserVideoComponent streamManager={publisher} />
                    </div>
                ) : null}
                {subscribers.map((sub, i) => (
                    <div
                        key={i}
                        className="stream-container"
                        onClick={() => toggleSubbsVideoHandler(sub)}
                    >
                        <span>{sub.id}</span>
                        <UserVideoComponent streamManager={sub} />
                    </div>
                ))}
            </div>
            
            <div className="chat-container" style={{display: dead ? "block" : "none"}}>
            <form onSubmit={sendMessage}>
            <input onChange={ChangeMessages} placeholder='메시지 입력' value={message}></input>
            </form>
            {chatMessages.map((i) => 
          <div>{i}</div>)}

            </div>
        </div>
    );
    
}

export default Room;