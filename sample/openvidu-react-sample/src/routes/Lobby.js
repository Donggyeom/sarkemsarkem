import { useState, useEffect } from 'react';
import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import UserVideoComponent from '../components/UserVideoComponent';
import { useLocation } from 'react-router-dom';

// const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'production' ? '' : 'localhost:5000';

const Lobby = () => {
    // 게임 설정 화면으로부터 파라미터 전달 받음
    const state = useLocation().state;
    console.log(state);

    // 현재 로비의 세션ID
    const [mySessionId, setMySessionId] = useState(state.sessionId);
    // 이전 화면에서 설정한 유저 네임
    const [myUserName, setMyUserName] = useState(state.userName + Math.floor(Math.random() * 100));
    // openvidu 세션
    const [session, setSession] = useState(undefined);
    const [mainStreamManager, setMainStreamManager] = useState(undefined);
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);

    // window 객체에 onBeforeUnload 함수 등록
    useEffect(() => {
        window.addEventListener('beforeunload', onBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
        };
    }, []);

    // 사이트 벗어날 때 세션 해제
    const onBeforeUnload = () => {
        leaveSession();
    };

    // 세션에 구독중인 특정 유저 삭제
    const deleteSubscriber = (streamManager) => {
        setSubscribers((prevSubscribers) => prevSubscribers.filter((subscriber) => subscriber !== streamManager));
    };
    

    // 세션에 가입하는 함수
    const joinSession = async () => {

        // --- 1) openvidu 객체 생성 ---
        const OV = new OpenVidu();

        // --- 2) openvidu session 생성 ---
        const newSession = OV.initSession();
        setSession(newSession);

        // --- 3) 세션에서 발생하는 구체적인 이벤트 정의 ---
        // stream 생성 이벤트 발생 시
        newSession.on('streamCreated', (event) => {
            // 세션 구독자 목록에 추가
            const subscriber = newSession.subscribe(event.stream, undefined);
            setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
        });

        // stream 종료 이벤트 발생 시
        newSession.on('streamDestroyed', (event) => {
            // 
            deleteSubscriber(event.stream.streamManager);
        });
        
        // 그 외 예외 이벤트 발생 시 오류 출력
        newSession.on('exception', (exception) => {
            console.warn(exception);
        });

        // --- 4) 유저 토큰을 통해 세션에 연결 ---
        // 토큰 생성
        const token = await getToken();
        // 토큰을 통해 세션에 연결
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

                // openvidu device 정보 호출 후 videoinput만 추출 (webcam)
                const devices = await OV.getDevices();
                const videoDevices = devices.filter((device) => device.kind === 'videoinput');
                // 기본으로 설정된 캠 정보 불러오기
                const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
                const currentVideoDevice = videoDevices.find((device) => device.deviceId === currentVideoDeviceId);

                // 게시자 업데이트
                setPublisher(publisher);
                // 메인스트림 업데이트 (캠들 사이에서 가장 크게 보이는 캠, 삭제 예정)
                setMainStreamManager(publisher);
                // 현재 웹캠 정보 업데이트
                setCurrentVideoDevice(currentVideoDevice);
            })
            .catch((error) => {
                console.log('There was an error connecting to the session:', error.code, error.message);
            });
    };

    // 화면을 떠날 시 세션 연결 해제 및 초기화
    const leaveSession = () => {
        if (session) {
            session.disconnect();
        }

        setSession(undefined);
        setSubscribers([]);
        setMySessionId(state.sessionId);
        setMyUserName(state.userName + Math.floor(Math.random() * 100));
        setMainStreamManager(undefined);
        setPublisher(undefined);
    };

    // 컴포넌트 마운트 시 joinSession 최초 1회 실행
    useEffect(() => {
        joinSession();
    }, [])
    const renderSession = () => (
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


    // token 얻어오는 함수
    const getToken = async () => {
        const sessionId = await createSession(mySessionId);
        return await createToken(sessionId);
    };

    // 백엔드로부터 호출하여 sessionId 등록
    const createSession = async (sessionId) => {
        const response = await axios.post(
            '/api/sessions',
            { customSessionId: sessionId },
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data; // The sessionId
    };

    // 백엔드로부터 호출하여 해당 세션에 맞는 토큰 생성
    const createToken = async (sessionId) => {
        const response = await axios.post(
            '/api/sessions/' + sessionId + '/connections',
            {},
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data; // The token
    };

    return (
        <div className="container">
            {session !== undefined ? renderSession() : null}
        </div>
    );
};

export default Lobby;
