import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import React, { Component } from "react";
import UserVideoComponent from "./components/UserVideoComponent";
import { useEffect, useState } from "react";

function Room () {
    const [mySessionId, setMySessionId] = useState('tmpSession38');
    const [myUserName, setMyUserName] = useState('이름모를유저' + Math.floor(Math.random() * 100));
    const [session, setSession] = useState(undefined);
    const [mainStreamManager, setMainStreamManager] = useState(undefined);
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);

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

    const joinSession = async () => {
        
        // openvidu 객체 생성
        const OV = new OpenVidu();

        // 세션 시작
        const newSession = OV.initSession();
        
        console.log("연결을 몇번을 하는건데");
    
        // 세션에서 발생하는 구체적인 이벤트 정의
        // stream 생성 이벤트 발생 시
        newSession.on('streamCreated', (event) => {
            console.log("before:" , subscribers);
            const subscriber = newSession.subscribe(event.stream, undefined);
            // let newSubscribers = subscribers;
            // newSubscribers.push(subscriber);
            // setSubscribers(newSubscribers);
            setSubscribers([...subscribers, subscriber]);
            console.log(subscribers);
        })

        // stream 종료 이벤트 발생 시
        newSession.on('streamDestroyed', (event) => {
            deleteSubscriber(event.stream.streamManager);
        })

        // stream 예외 이벤트 발생 시
        newSession.on('exception', (exception) => console.warn(exception));

        const token = await getToken();

        // 토큰을 통해 세션 연결
        newSession.connect(token, { clientData: myUserName })
        .then(async () => {
            // 참여자 정보 생성
            const publisher = await OV.initPublisherAsync(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: true,
            });
            // 세션에 참여자 정보 게시
            newSession.publish(publisher);
            console.log(newSession);
            // video 디바이스 추출
            const devices = await OV.getDevices();
            //console.log(devices);
            const videoDevices = devices.filter((device) => device.kind === 'videoinput');
            
            // 기본 설정된 캠 정보 추출
            // const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].deviceId;
            const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].id;
            //console.log(publisher.stream.getMediaStream().getVideoTracks()[0].id);
            //console.log(videoDevices);
            const currentVideoDevice = videoDevices.find((device) => device.deviceId === currentVideoDeviceId);
            
            // 게시자 업데이트
            setPublisher(publisher);
            setMainStreamManager(publisher);

            
            let newSubscribers = subscribers;
            newSubscribers.push(publisher);
            setSubscribers(newSubscribers);
            console.log(subscribers);
            setSubscribers(prevSubscribers => {
                console.log("3️⃣ [tracking] 전체 서브스크라이브 업데이트 중.")
                const newSubscribers = [...prevSubscribers]
                console.log("3️⃣ [tracking] 전체 서브스크라이브 업데이트 중..")
                return newSubscribers
              })
            
        });
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