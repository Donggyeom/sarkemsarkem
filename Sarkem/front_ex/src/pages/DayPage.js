/* eslint-disable */

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundDay';
/* Code generated with AutoHTML Plugin for Figma */
import CamButton from '../components/buttons/CamButton';
import MicButton from '../components/buttons/MicButton';
import SunMoon from '../components/games/SunMoon';
import ScMini from '../components/games/ScMini';
import DayPopup from '../components/games/DayPopup';
// 
import CamCat from '../components/camera/camcat';
import { useNavigate, useLocation } from 'react-router-dom';
import { OpenVidu, Session, Subscriber } from 'openvidu-browser';
import axios from 'axios';


const CamCatGrid = styled.div`
  display: grid;
  grid-template-rows: ${({ camCount }) => `repeat(${camCount / 2}, 1fr)`};
  gap: 10px;
  justify-items: center;
  align-items: center;
  width: 100%;
  max-height: 80vh;
  overflow: auto;
`;


const StyledDayPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative; /* position을 relative로 설정합니다. */
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const TimeSecond = styled.text`
    color: #000000;
    text-align: left;
    font: 400 42px "ONE Mobile POP", sans-serif;
    position: absolute; /* position을 absolute로 설정합니다. */
    left: 22px; /* 원하는 위치 값을 지정합니다. */
    top: 90px; /* 원하는 위치 값을 지정합니다. */
`;

const handleCamButtonClick = () => {
    // 버튼이 클릭되었을 때 실행되어야 할 작업을 여기에 정의
    console.log('Cam Button clicked!');
};

const handleMicButtonClick = () => {
    // 버튼이 클릭되었을 때 실행되어야 할 작업을 여기에 정의
    console.log('Mic Button clicked!');
};

const handleScMiniClick = () => {
    // 버튼이 클릭되었을 때 실행되어야 할 작업을 여기에 정의
    console.log('ScMini clicked!');
};

const DayPage = () => {

  
  const OV = new OpenVidu();
  const navigate = useNavigate();
  const location = useLocation();
  const isHost = location.state?.isHost ? true : false;
  const roomId = location.state?.roomId;
  const nickName = location.state?.nickName;

  const [userCount, setUserCount] = useState(8);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [session, setSession] = useState(undefined);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [token, setToken] = useState(null);
  const [camArray, setCamArray] = useState([]);

  useEffect(() => {
    console.log(roomId);
    if (roomId === undefined){
      console.log("세션 정보가 없습니다.")
      navigate("/");
      return;
    }
    joinSession();

    // 윈도우 객체에 화면 종료 이벤트 추가
    window.addEventListener('beforeunload', onbeforeunload);
    // return () => {
    //     window.removeEventListener('beforeunload', onbeforeunload);
    //     leaveSession();
    // }
  }, [])

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
      setPublisher(undefined);
      navigate("/")
  }

    // useEffect(() => {
    //   renderCamCats();
    // }, [userCount]);

    useEffect(() => {

      console.log(nickName);
      if (session) {
        // 토큰 발급
        getToken().then(async (token) => {
          try{
            setToken(token);
            console.log(token);
            // 세션에 유저 데이터 입력 후 연결 시도
            await session.connect(token, {userData: nickName});

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
    }, [session]);

    // 특정 유저가 룸을 떠날 시 subscribers 배열에서 삭제
    const deleteSubscriber = (streamManager) => {
      setSubscribers((preSubscribers) => preSubscribers.filter((subscriber) => subscriber !== streamManager))
      setCamArray((prevCamArray) => prevCamArray.filter((user) => user != streamManager));
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

    const handleGamePageClick = () => {
      // Logic to navigate to the GamePage when the user is a host
      // Replace the following line with the actual logic to navigate to the GamePage
      console.log('Navigate to the GamePage');
    };

    // Function to handle the click event when the user wants to invite others
    const handleInviteClick = async () => {
      await navigator.clipboard.writeText("localhost:3000/"+roomId).then(alert("게임 링크가 복사되었습니다."));
      console.log('Invite functionality for hosts');
    };

    // const renderCamCats = () => {
    //   const camCats = [];
    //   for (let i = 0; i < userCount; i++) {
        
    //     camCats.push(<CamCat key={i}/>);
    //   }
    //   return camCats;
    // };

        // 토큰 생성하는 함수
    const getToken = async () => {
      // 내 세션ID에 해당하는 세션 생성
      if (isHost){
          console.log("방장이므로 세션을 생성합니다.")
          await createSession(roomId);
      }
      // 세션에 해당하는 토큰 요청
      return await createToken(roomId);
    }
    
    // 서버에 요청하여 화상 채팅 세션 생성하는 함수
    const createSession = async (roomId) => {
      console.log(`${roomId} 세션에 대한 토큰을 발급 받습니다.`);
      const response = await axios.post('/api/game', { customSessionId: roomId, nickName:nickName }, {
        headers: { 'Content-Type': 'application/json', },
      });
      return response.data; // The sessionId
    }
      
      
      // 서버에 요청하여 토큰 생성하는 함수
    const createToken = async (sessionId) => {
      const response = await axios.put('/api/game/' + sessionId, 
      {nickName: nickName},
      );
      console.log(response);
      return response.data; // The token
    }

  const CamCatGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 10px;
    justify-items: center;
    align-items: center;
    width: 100%;
    max-height: 80vh; /* Set a maximum height to adjust to the available space */
    overflow: auto; /* Add overflow property to handle overflow if needed */
  `;

  // const LeftSection = styled.div`
  // flex: 4.5;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // max-height: 80vh; /* Set a maximum height to adjust to the available space */
  // overflow: hidden; /* Hide any overflow content if needed */
  // `;

  const calculateCamCatHeight = () => {
    const leftSectionHeight = leftSectionRef.current.offsetHeight;
    const maxCamCatCount = 10; 
    const camCatCount = Math.min(camArray.length, maxCamCatCount);
    return `${leftSectionHeight / camCatCount}px`;
  };

  const leftSectionRef = useRef(null);

    
    return (
    <Background>
        <StyledDayPage>
            <SunMoon alt="SunMoon"></SunMoon>
            <TimeSecond>60s</TimeSecond>
            <CamButton alt="Camera Button" onClick={handleCamButtonClick} />
            <MicButton alt="Mic Button" onClick={handleMicButtonClick} />
            
            <DayPopup></DayPopup>
            <div ref={leftSectionRef}>
              <CamCatGrid camCount={camArray.length}>
                {camArray.map((user, index) => (
                  <CamCat key={index} props={user} style={{ height: calculateCamCatHeight() }} />
                ))}
              </CamCatGrid>
            <ScMini alt="ScMini Button" onClick={handleScMiniClick}></ScMini>
            </div>
            
        </StyledDayPage>
    </Background>
  );
};

export default DayPage;