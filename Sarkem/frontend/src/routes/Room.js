import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import React from "react";
import UserVideoComponent from "../components/UserVideoComponent";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Room () {
    const [mySessionId, setMySessionId] = useState('tmpSession42');
    const [myUserName, setMyUserName] = useState('이름모를유저' + Math.floor(Math.random() * 100));
    const [session, setSession] = useState(undefined);
    const [mainStreamManager, setMainStreamManager] = useState(undefined);
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    // openvidu 객체 생성
    const OV = new OpenVidu();
    useEffect(() => {
        console.log(location.state);
        if (location.state === null || location.state.sessionId === null) {
            console.log("세션 정보가 없습니다.")
            navigate("/");
        }
        setMySessionId(location.state.sessionId);
        setMyUserName(location.state.userName);
        setVideoEnabled(location.state.videoEnabled);
        setAudioEnabled(location.state.audioEnabled);
        console.log(location.state);
        console.log(location.state.videoEnabled)
        window.addEventListener('beforeunload', onbeforeunload);
        
        joinSession();
        return () => {
            window.removeEventListener('beforeunload', onbeforeunload);
            leaveSession();
        }
    }, []);


    // useEffect(() => {
    //     setSubscribers((preSubscribers) => [...preSubscribers])
    // }, [publisher, session]);

    const onbeforeunload = () => {
        leaveSession();
        
    }

    const leaveSession = () => {
        if (session) {
            session.disconnect();
        }

        setSession(undefined);
        setSubscribers([]);
        setMySessionId(mySessionId);
        setMyUserName(myUserName + Math.floor(Math.random() * 100));
        setMainStreamManager(undefined);
        setPublisher(undefined);
        navigate("/")
    }

    const toggleVideo = () => {
        const enabled = !videoEnabled;
        setVideoEnabled(enabled);
        publisher.publishVideo(enabled);
    }
    
    const toggleAudio = () => {
        const enabled = !audioEnabled;
        setAudioEnabled(enabled);
        publisher.publishAudio(enabled);
    }
    

    // 세션에 구독중이던 특정 유저 삭제
    const deleteSubscriber = (streamManager) => {
        setSubscribers((preSubscribers) => preSubscribers.filter((subscriber) => subscriber !== streamManager))
    }


    const getToken = async () => {
        const sessionId = await createSession(mySessionId);
        return await createToken(sessionId);
    }

    const createSession = async (sessionId) => {
        const response = await axios.post('/api/sessions', { customSessionId: sessionId }, {
            headers: { 'Content-Type': 'application/json', },
        });
        return response.data; // The sessionId
    }

    const createToken = async (sessionId) => {
        const response = await axios.post('/api/sessions/' + sessionId + '/connections', {}, {
            headers: { 'Content-Type': 'application/json', },
        });
        return response.data; // The token
    }

    useEffect(() => {
        if(session) {
            getToken().then(async (response) => {
                try {
                    await session.connect(response, {clientData: myUserName})
    
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
                    session.publish(publisher);
                    const devices = await OV.getDevices();
                    const videoDevices = devices.filter((device) => device.kind === 'videoinput');
                    
                    // 기본 설정된 캠 정보 추출
                    const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].id;
                    // const currentVideoDevice = videoDevices.find((device) => device.deviceId === currentVideoDeviceId);
                    setPublisher(publisher);
                    setMainStreamManager(publisher);
                    console.log(subscribers);
                } catch (error) {
                    console.log(error);
                }
            });
        }
    }, [session])
    const joinSession = async () => {
    
        // 세션 시작
        const newSession = OV.initSession();
        
        console.log("연결을 몇번을 하는건데");
    
        // 세션에서 발생하는 구체적인 이벤트 정의
        // stream 생성 이벤트 발생 시
        newSession.on('streamCreated', (event) => {
            console.log("새로운 유저 입장")
            const subscriber = newSession.subscribe(event.stream, undefined);
            
            setSubscribers((subscribers) => [...subscribers, subscriber]);

            console.log(subscribers);
        })

        // stream 종료 이벤트 발생 시
        newSession.on('streamDestroyed', (event) => {
            console.log("유저 종료")
            deleteSubscriber(event.stream.streamManager);
        })

        // stream 예외 이벤트 발생 시
        newSession.on('exception', (exception) => console.warn(exception));

        setSession(newSession);
    }

    const copyGameLink = async () => {
        await navigator.clipboard.writeText("localhost:3000/"+mySessionId).then(alert("링크를 복사함"));
        console.log()
    }

    return (
        <div id="session">
            <div id="session-header">
                <h1 id="session-title">roomId: {mySessionId}</h1>
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
                    value="캠 On/Off"
                />

<input
                    className="btn btn-large btn-danger"
                    type="button"
                    id="buttonLeaveSession"
                    onClick={toggleAudio}
                    value="마이크 On/Off"
                />
            </div>
            {/* {mainStreamManager !== undefined ? (
                <div id="main-video" className="col-md-6">
                    <UserVideoComponent streamManager={mainStreamManager} />

                </div>
            ) : null} */}
            <div id="video-container" className="col-md-6">

                {publisher !== undefined ? (
                    <div className="stream-container col-md-6 col-xs-6" onClick={() => console.log(publisher)}>
                        <UserVideoComponent streamManager={publisher} />
                    </div>
                ) : null}
                {subscribers.map((sub, i) => (
                    
                    <div
                        key={i}
                        className="stream-container col-md-6 col-xs-6"
                        onClick={() => console.log(sub)}
                    >
                        <span>{sub.id}</span>
                        <UserVideoComponent streamManager={sub} />
                    </div>
                ))}
            </div>
        </div>
    );
    
}

export default Room;