import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import React, { Component } from "react";
import UserVideoComponent from "./components/UserVideoComponent";
import { useEffect, useState } from "react";

function Room () {
    const [mySessionId, setMySessionId] = useState('tmpSession42');
    const [myUserName, setMyUserName] = useState('이름모를유저' + Math.floor(Math.random() * 100));
    const [session, setSession] = useState(undefined);
    const [mainStreamManager, setMainStreamManager] = useState(undefined);
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);
    // openvidu 객체 생성
    const OV = new OpenVidu();
    useEffect(() => {
        window.addEventListener('beforeunload', onbeforeunload);
        
        joinSession();
        return () => {
            window.removeEventListener('beforeunload', onbeforeunload);
            leaveSession();
        }
    }, []);


    useEffect(() => {
        setSubscribers((preSubscribers) => [...preSubscribers])
    }, [publisher, session]);

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
        const response = await axios.post('https://demos.openvidu.io/api/sessions', { customSessionId: sessionId }, {
            headers: { 'Content-Type': 'application/json', },
        });
        return response.data; // The sessionId
    }

    const createToken = async (sessionId) => {
        const response = await axios.post('https://demos.openvidu.io/api/sessions/' + sessionId + '/connections', {}, {
            headers: { 'Content-Type': 'application/json', },
        });
        return response.data; // The token
    }

    useEffect(() => {
        if(session) {
            getToken().then(async (response) => {
                try {
                    await session.connect(response, {cliendtData: myUserName})
    
                    let publisher = await OV.initPublisherAsync(undefined, {
                        audioSource: undefined,
                        videoSource: undefined,
                        publishAudio: true,
                        publishVideo: true,
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
            setSubscribers([...subscribers, subscriber]);
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


    return (
        <div id="session">
            <div id="session-header">
                <h1 id="session-title">{mySessionId}</h1>
                <input
                    className="btn btn-large btn-danger"
                    type="button"
                    id="buttonLeaveSession"
                    onClick={leaveSession}
                    value="Leave session"
                />
            </div>
            {mainStreamManager !== undefined ? (
                            <div id="main-video" className="col-md-6">
                                <UserVideoComponent streamManager={mainStreamManager} />

                            </div>
                        ) : null}
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