import { OpenVidu, StreamManager } from "openvidu-browser";
import axios from "axios";
import React from "react";
import UserVideoComponent from "../components/UserVideoComponent";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SockJS from 'sockjs-client';
import { Stomp } from "@stomp/stompjs";

import "../css/Room.css"
import Chat from "../components/Chat";

function Room() {
    let stompCilent = useRef({});

    const [mySessionId, setMySessionId] = useState(null);
    const [myUserName, setMyUserName] = useState('');
    const [session, setSession] = useState(undefined);
    const [mainStreamManager, setMainStreamManager] = useState(undefined);
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [token, setToken] = useState(null);
    const [dead, setDead] = useState(false);
    const [meetingTime, setMeetingTime] = useState(30);
    const [citizenCount, setCitizenCount] = useState("0");
    const [sarkCount, setSarkCount] = useState("0");
    const [policeCount, setPoliceCount] = useState("0");
    const [doctorCount, setDoctorCount] = useState("0");
    const [detectiveCount, setDetectiveCount] = useState("0");
    const [bullyCount, setBullyCount] = useState("0");
    const [psychologistCount, setPsychologistCount] = useState("0");
    const [isConnected, setIsConnected] = useState(false);
    const [selectedTarget, setSelectedTarget] = useState("");
    const [expulsionTarget, setExpulsionTarget] = useState("");
    const [isTwilightVote, setIsTwilightVote ] = useState(false);

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
        console.log(location.state);
        setMyUserName(location.state.userName);
        setVideoEnabled(location.state.videoEnabled);
        setAudioEnabled(location.state.audioEnabled);

        // 윈도우 객체에 화면 종료 이벤트 추가
        window.addEventListener('beforeunload', onbeforeunload);

        // 세션에 가입
        joinSession();


        return () => {
            window.removeEventListener('beforeunload', onbeforeunload);
            leaveSession();
        }
    }, []);

    useEffect(() => {
        // 토큰이 발급되면 WS 연결 
        if (location.state === null || location.state.sessionId === null) {
            console.log("세션 정보가 없습니다.")
            navigate("/");
            return;
        }
        connectGameWS();
    }, [token])

    // 게임 옵션 변경 시 실행
    useEffect(() => {
        console.log("게임옵션 변경됨")
        if (stompCilent.current.connected && token !== null) {
            stompCilent.current.send("/pub/game/action", {},
                JSON.stringify({
                    code: 'OPTION_CHANGE',
                    roomId: mySessionId,
                    playerId: token,
                    param: {
                        meetingTime,
                        citizenCount,
                        sarkCount,
                        doctorCount,
                        policeCount,
                        detectiveCount,
                        psychologistCount,
                        bullyCount
                    }
                }))
        }
    }, [meetingTime,
        citizenCount,
        sarkCount,
        doctorCount,
        policeCount,
        detectiveCount,
        psychologistCount,
        bullyCount])

    const connectGameWS = async (event) => {
        let socket = new SockJS("http://localhost:8080/ws-stomp");
        stompCilent.current = Stomp.over(socket);
        await stompCilent.current.connect({}, () => {
            setTimeout(function () {
                onSocketConnected();
                connectGame();
                console.log(stompCilent.current.connected);
            }, 500);
        });
    }

    const onSocketConnected = () => {
        console.log("game websocket 연결 완료");
    }

    const connectGame = () => {
        // 게임방 redis 구독
        console.log('/sub/game/system/' + location.state.sessionId + " redis 구독")
        stompCilent.current.subscribe('/sub/game/system/' + location.state.sessionId, receiveMessage)

        // 입장 코드 전송
        console.log("ENTER 코드 전송");
        console.log("roomId : " + location.state.sessionId);
        console.log("playerId : " + token);
        stompCilent.current.send("/pub/game/action", {},
            JSON.stringify({
                code: 'ENTER',
                roomId: location.state.sessionId,
                playerId: token
            })
        );
    }

    // 화면을 새로고침 하거나 종료할 때 발생하는 이벤트
    const onbeforeunload = () => {
        leaveSession();
    }

    // 세션 해제
    const leaveSession = () => {
        // 세션 연결 종료
        if (session) {
            session.disconnect();
            deletePlayer(mySessionId, token);
        }
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
        let sessionId;
        if (location.state.isHost) {
            console.log("방장이므로 세션을 생성합니다.")
            sessionId = await createSession(mySessionId);
        } else {
            sessionId = mySessionId;
        }
        // 세션에 해당하는 토큰 요청
        return await createToken(sessionId);
    }

    //플레이어 나갔을때 확인
    const deletePlayer = async (sessionId, playerId) => {
        const respose = await axios.delete(`/api/game/` + location.state.sessionId + `/player/` + playerId);
        console.log(respose);
        return respose.data;
    }


    //서버에 있는 유저 전부 가져오기
    const getPlayers = async (sessionId) => {
        const response = await axios.get(`/api/game/` + location.state.sessionId + `/player`);
        console.log(response);
        return response.data;
    }

    // 서버에 요청하여 세션 생성하는 함수
    const createSession = async (sessionId) => {
        const response = await axios.post('/api/game', { customSessionId: location.state.sessionId, nickName: myUserName }, {
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
        });
        return response.data; // The sessionId
    }

    // 서버에 요청하여 토큰 생성하는 함수
    const createToken = async (sessionId) => {
        const response = await axios.post('/api/game/' + location.state.sessionId + `/player`, myUserName, {
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
        }
        );
        console.log(response);
        return response.data; // The token
    }

    // 세션 객체 생성 시 실행
    useEffect(() => {
        if (session) {
            // 토큰 생성
            getToken().then(async (response) => {
                try {
                    // 토큰의 고유 번호만 파싱하여 useState에 저장
                    let playerId = response.split("token=", 2)[1];
                    setToken(playerId);

                    // 생성된 토큰을 통해 세션에 연결 요청
                    await session.connect(response, { clientData: myUserName, playerId: playerId })

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
                /**
                 * 세션 생성하고, 토큰 발급까지 끝나면 game 생성 api 전송하고, game 정보 요청 api 전송
                 * 아마 router 설정에서 룸 (로비, 게임) 이렇게 나눈 다음에 네비게이션 처리를 해야할 것 같다.
                 * 게임이 끝나고 로비로 돌아오면 또 화상채팅 세션을 만들게 되니까
                 */
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
            console.log(mySessionId);
            getPlayers(JSON.parse(event.stream.streamManager.stream.connection.data).playerId.slice(30, 35));
        })

        // stream 예외 이벤트 발생 시
        newSession.on('exception', (exception) => console.warn(exception));

        // 세션 갱신
        setSession(newSession);
    }

    const copyGameLink = async () => {
        await navigator.clipboard.writeText("localhost:3000/" + mySessionId).then(alert("게임 링크가 복사되었습니다."));
    }

    // 게임시작
    const gameStart = () => {
        console.log("게임시작 클릭")
        console.log(token);
        stompCilent.current.send("/pub/game/action", {},
            JSON.stringify({
                code: 'GAME_START',
                roomId: mySessionId,
                playerId: token
            })
        );
    }


    const receiveMessage = (message) => {
        // 시스템 메시지 처리
        let sysMessage = JSON.parse(message.body);
        console.log(sysMessage);
        console.log(token);
        if (token != sysMessage.playerId) return;

        switch (sysMessage.code) {
            case "NOTICE_MESSAGE":
                alert(sysMessage.param.message);
                break;
            case "GAME_START":
                alert('게임시작');
                break;
            case "ONLY_HOST_ACTION":
                console.log(sysMessage);
                alert('방장만 실행 가능합니다.');
                break;
            case "OPTION_CHANGED":
                setMeetingTime(sysMessage.param.meetingTime);
                setCitizenCount(sysMessage.param.citizenCount);
                setSarkCount(sysMessage.param.sarkCount);
                setPoliceCount(sysMessage.param.policeCount);
                setDoctorCount(sysMessage.param.doctorCount);
                setDetectiveCount(sysMessage.param.detectiveCount);
                setBullyCount(sysMessage.param.bullyCount);
                setPsychologistCount(sysMessage.param.psychologistCount);
                break;
            case "ROLE_ASSIGNED":
                alert(`당신은 ${sysMessage.param.role} 입니다.`);
                console.log(`당신은 ${sysMessage.param.role} 입니다.`)
                break;
            case "TARGET_SELECTION_END":
                // 선택 완료
                alert("선택 완료", sysMessage.param.targetNickname);
                setSelectedTarget("");
                break;
            case "VOTE_SITUATION":
                console.log(sysMessage.param);
                break;
            case "DAY_VOTE_END":
                alert("낮 투표 종료 \n 추방 대상 : " + sysMessage.param.targetNickname);
                
                if (sysMessage.param.targetId == null) break;
                
                setExpulsionTarget(sysMessage.param.targetId);
            break;
            case "TWILIGHT_SELECTION":
                setIsTwilightVote(true);
                break;
            case "TWILIGHT_SELECTION_END":
                // 추방 투표 완료(개인)
                console.log("추방 투표 완료");
                break;
            case "TWILIGHT_VOTE_END":
                // 저녁 투표 완료(전체)
                alert("저녁 투표 완료 \n 투표 결과: " + sysMessage.param.result);
                break;
            case "GAME_END":
                alert("게임 종료");
                break;
        }
    }

    // 대상 선택
    const selectAction = ((target) => {
        if (selectedTarget != "") {
            setSelectedTarget("");
            target.playerId = "";
        }
        else {
            setSelectedTarget(target.playerId)
        }

        console.log("다른 플레이어 선택 ")
        if (stompCilent.current.connected && token !== null) {
            stompCilent.current.send("/pub/game/action", {},
                JSON.stringify({
                    code: 'TARGET_SELECT',
                    roomId: location.state.sessionId,
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
        if (stompCilent.current.connected && token !== null) {
            stompCilent.current.send("/pub/game/action", {},
                JSON.stringify({
                    code: 'TARGET_SELECTED',
                    roomId: mySessionId,
                    playerId: token,
                    param: {
                        target: selectedTarget
                    }
                }))
        }
    }

    const selectPsy = (streamManager) => {
        console.log(streamManager);
    }

        // 추방 투표 동의
    const agreeExpulsion = () => {
        stompCilent.current.send("/pub/game/action", {}, 
            JSON.stringify({
                code:'EXPULSION_VOTE',
                roomId: mySessionId, 
                playerId: token,
                param: {
                    result: true
                }
            })
        )
    }

    // 추방 투표 반대
    const disagreeExpulsion = () => {
        stompCilent.current.send("/pub/game/action", {}, 
            JSON.stringify({
                code:'EXPULSION_VOTE',
                roomId: mySessionId, 
                playerId: token,
                param: {
                    result: false
                }
            })
        )
    }

    // 다른 유저 카메라 on/off 하는 함수
    const toggleSubbsVideoHandler = (sub) => {
        console.log(sub);
        sub.subscribeToVideo(!sub.properties.subscribeToVideo);
        sub.properties.subscribeToVideo = !sub.properties.subscribeToVideo
    }

    const deathAndOpenChat = () => {
        setDead(!dead);

    }

    const changeOption = (event) => {
        switch (event.target.id) {
            case "meetingTime":
                setMeetingTime(event.target.value);
                break;
            case "citizenCount":
                setCitizenCount(event.target.value);
                break;
            case "sarkCount":
                setSarkCount(event.target.value);
                break;
            case "doctorCount":
                setDoctorCount(event.target.value);
                break;
            case "policeCount":
                setPoliceCount(event.target.value);
                break;
            case "detectiveCount":
                setDetectiveCount(event.target.value);
                break;
            case "psychologistCount":
                setPsychologistCount(event.target.value);
                break;
            case "bullyCount":
                setBullyCount(event.target.value);
                break;
        }
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
                    id="buttonGameStart"
                    onClick={gameStart}
                    value="게임 시작하기"
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
                <input
                    className="btn btn-large btn-danger"
                    type="button"
                    id="buttonLeaveSession"
                    onClick={()=> console.log(location)}
                    value={`심리학자`}
                />
                {selectedTarget ? <button onClick={selectConfirm}>대상확정</button> : <button onClick={selectConfirm}>투표스킵</button>}
                {isTwilightVote ? <div>
                    <button onClick={agreeExpulsion}>찬성</button>
                    <button onClick={disagreeExpulsion}>반대</button>
                </div> : null}
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
                        onClick={() => {
                            toggleSubbsVideoHandler(sub);
                            selectAction(JSON.parse(sub.stream.connection.data));
                        }}
                    >
                        <span>{sub.id}</span>
                        <UserVideoComponent streamManager={sub} />
                    </div>
                ))}
            </div>
            <div id='game-option-container'>
                <label for='meetingTime'>회의시간</label>
                <input onChange={changeOption} value={meetingTime} type='number' id='meetingTime' name="meetingTime" min="15" max="300" step="15"></input>
                <label for='citizenCount'>시민</label>
                <input onChange={changeOption} value={citizenCount} type='number' id='citizenCount' name="citizenCount" min="1" max="10"></input>
                <label for='sarkCount'>마피아</label>
                <input onChange={changeOption} value={sarkCount} type='number' id='sarkCount' name="sarkCount" min="1" max="10"></input>
                <label for='doctorCount'>의사</label>
                <input onChange={changeOption} value={doctorCount} type='number' id='doctorCount' name="doctorCount" min="1" max="10"></input>
                <label for='policeCount'>경찰</label>
                <input onChange={changeOption} value={policeCount} type='number' id='policeCount' name="policeCount" min="1" max="10"></input>
                <label for='detectiveCount'>탐정</label>
                <input onChange={changeOption} value={detectiveCount} type='number' id='detectiveCount' name="detectiveCount" min="1" max="10"></input>
                <label for='psychologistCount'>심리학자</label>
                <input onChange={changeOption} value={psychologistCount} type='number' id='psychologistCount' name="psychologistCount" min="1" max="10"></input>
                <label for='bullyCount'>냥아치</label>
                <input onChange={changeOption} value={bullyCount} type='number' id='bullyCount' name="bullyCount" min="1" max="10"></input>
            </div>
            {dead ? <Chat sessionId={mySessionId} userName={myUserName} /> : null}

        </div>
    );

}

export default Room;