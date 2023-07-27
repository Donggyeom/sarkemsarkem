

import Background from '../components/backgrounds/BackgroundSunset';
import styled from 'styled-components';
import React, { useState, useEffect, useRef } from 'react';
import boxImage from '../img/box.png';
import camcatImage from '../img/camcat.png';
import sc_police from '../img/sc_경찰.png';
import sc_vet from '../img/sc_수의사.png';
import sc_sark from '../img/sc_삵.png';
import sc_citizen from '../img/sc_시민.png';
import sc_scoop from '../img/sc_탐정.png';
import sc_psychologist from '../img/sc_심리학자.png';
import sc_nyangachi from '../img/sc_냥아치.png';
import timesetting from '../img/timesetting.png';
import settingbuttonImage from '../img/settingbutton.png';
import BackButton from '../components/buttons/backButton';
import CamCat from '../components/camera/camcat';
import { useNavigate, useLocation } from 'react-router-dom';
import StartButton from '../components/buttons/StartButton';
import InviteButton from '../components/buttons/InviteButton';
import { OpenVidu, Session, Subscriber } from 'openvidu-browser';
import axios from 'axios';
import UserVideoComponent from '../components/camera/UserVideoComponent';


const StyledContent = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  background-size : cover;
`;

const RightSection = styled.div`
  /* 오른쪽 섹션 스타일 작성 */
  flex: 5.5;
  /* 60% of the available width */
  background-image: url(${boxImage});
  background-size: 97% 98%;
  background-repeat: no-repeat;
  background-position: center center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px 0px;
  /* 원하는 크기로 설정 */
`;


const DivWrapper = styled.div`
  /* Wrapper for each RightDiv to split into two parts, except for Div 4 */
  display: flex;
  justify-content : space-between;
`;

const LeftPart = styled.div`
  /* Left part of each RightDiv */
  flex: 2.75;
  display: flex;
  justify-content: center;
  align-items: center;
  background-position: center center;
  background-repeat: no-repeat;
`;

const RightPart = styled.div`
  /* Right part of each RightDiv */
  flex: 2.75;
  display: flex;
  justify-content: center;
  align-items: center;
  background-position: center center;
  background-repeat: no-repeat;
`;


const Logo = styled.img`
  /* 로고 이미지 스타일 작성 */
  max-width: 60vw; /* 가로 크기 60% */
  height: auto; /* 세로 크기 자동으로 조정 */
  max-height: 100%; /* 세로 크기 100% */
`;

const LeftSection = styled.div`
  flex: 4.5;
  height : 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 100vh; /* Set a maximum height to adjust to the available space */
  overflow: hidden; /* Hide any overflow content if needed */
`;

const LeftPartWrapper = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-repeat: no-repeat;
  background-position: center center;
  justify-content: center;
  background-size: contain;
  height: 180%;
  width : 120%;
`;
const RightPartWrapper = styled.div`
  flex: 0.75;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-position : center center;
  padding: 13px;
  height: 100%; /* Adjust the height as needed */
  width : 100%;
  margin-right : 0px;

  button {
    font-size: 18px;
    // background: none;
    // border: none;
    margin-right: 10px;
    margin-left : 10px;
  }

  div {
    font-size: 20px;
  }

`;

const ButtonContainer = styled.div`
  width: 60%;
  height: 85%;
`;

const CommonLobby = ()=>{

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
    if (roomId === undefined){
      console.log("세션 정보가 없습니다.")
      navigate("/");
      return;
    }
    joinSession();

    // 윈도우 객체에 화면 종료 이벤트 추가
    window.addEventListener('beforeunload', onbeforeunload);
    return () => {
        window.removeEventListener('beforeunload', onbeforeunload);
        leaveSession();
    }
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
    navigate(`/${roomId}`)
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
  grid-auto-rows: auto;
  grid-template-rows: ${({ camCount }) => {
    if (camCount === 1) {
      return 'repeat(1, minmax(300px, 1fr))';
    } else if (camCount === 2 || camCount === 3) {
      return 'repeat(1, minmax(100px, 1fr))';
    } else {
      return 'repeat(auto-fill, minmax(200px, 1fr))'; // Default row height for other camCount values
    }
  }};
  grid-template-columns: ${({ camCount }) => {
    if (camCount === 1) {
      return 'repeat(1, minmax(300px, 1fr))';
    } else if (camCount === 2) {
      return 'repeat(2, minmax(100px, 1fr))';
    } else if (camCount === 3) {
      return 'repeat(1, minmax(100px, 1fr))'; // Change this line to have 1 column for the upper row
    } else {
      const numColumns = Math.min(camCount, 3);
      return `repeat(${numColumns}, minmax(300px, 1fr))`;
    }
  }};
  gap: 10px;
  justify-items: center;
  align-items: center;
  width: 100%;
  overflow: hidden; /* 내용물이 넘어갈 경우를 처리하기 위해 overflow 속성을 추가합니다. */
`;

const calculateCamCatHeight = () => {
  const leftSectionHeight = leftSectionRef.current.offsetHeight;
  const maxCamCatCount = 10; 
  const camCatCount = Math.min(camArray.length, maxCamCatCount);
  return `${leftSectionHeight / camCatCount}px`;
};

  const [peopleCount, setPeopleCount] = useState({
    sark: 0,
    citizen: 0,
    vet: 0,
    police: 0,
    scoop: 0,
    psychologist: 0,
    nyangachi: 0,
    timesetting: 0,
  });

  const handlePeopleCountChange = (part, value) => {
    setPeopleCount((prevPeopleCount) => ({
      ...prevPeopleCount,
      [part]: value,
    }));
  };

const leftSectionRef = useRef(null);

  return (
    <Background>
      <BackButton />
      <StyledContent>
        <LeftSection ref={leftSectionRef}>
          {/* Use the dynamic CamCatGrid */}
          {/* <CamCatGrid camCount={camArray.length}>
<<<<<<< HEAD
=======
            {camArray.map((user, index) => (
              <CamCat key={index} props={user} style={{ height: calculateCamCatHeight() }} />
            ))}
          </CamCatGrid> */}
            <CamCatGrid camCount={camArray.length}> {/* camCount를 camArray.length로 설정하여 동적으로 레이아웃을 조정합니다. */}
            {/* Render the first cam in the upper row */}
            {camArray.slice(0, 1).map((user, index) => (
              <CamCat key={index} props={user} />
            ))}
            {/* Render the rest of the cams in the lower row */}
            <CamCatGrid camCount={camArray.length - 1}>
              {camArray.slice(1).map((user, index) => (
                <CamCat key={index} props={user} />
              ))}
            </CamCatGrid>
          </CamCatGrid>
        </LeftSection>

        <RightSection>
          <DivWrapper
            style={{ backgroundRepeat: 'no-repeat', backgroundPosition : 'center center', backgroundSize: '95% 100%', backgroundImage: `url(${settingbuttonImage})`, width: '100%', height : '15%'}}
          />
        <DivWrapper>
          <LeftPart>
          <LeftPartWrapper style={{ backgroundImage: `url(${sc_sark})` }} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('sark', peopleCount.sark + 1)}>+</button>
                <div>{peopleCount.sark}</div>
                <button onClick={() => handlePeopleCountChange('sark', peopleCount.sark - 1)}>-</button>
              </RightPartWrapper>
            </LeftPart>
            <RightPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_citizen})` }} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('citizen', peopleCount.citizen + 1)}>+</button>
                <div>{peopleCount.citizen}</div>
                <button onClick={() => handlePeopleCountChange('citizen', peopleCount.citizen - 1)}>-</button>
              </RightPartWrapper>
            </RightPart>
          </DivWrapper>
          <DivWrapper>
            <LeftPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_vet})` }} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('vet', peopleCount.vet + 1)}>+</button>
                <div>{peopleCount.vet}</div>
                <button onClick={() => handlePeopleCountChange('vet', peopleCount.vet - 1)}>-</button>
              </RightPartWrapper>
            </LeftPart>
            <RightPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_police})` }} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('police', peopleCount.police + 1)}>+</button>
                <div>{peopleCount.police}</div>
                <button onClick={() => handlePeopleCountChange('police', peopleCount.police - 1)}>-</button>
              </RightPartWrapper>
        </RightPart>
      </DivWrapper>
      <DivWrapper>
            <LeftPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_scoop})` }} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('scoop', peopleCount.scoop + 1)}>+</button>
                <div>{peopleCount.scoop}</div>
                <button onClick={() => handlePeopleCountChange('scoop', peopleCount.scoop - 1)}>-</button>
              </RightPartWrapper>
            </LeftPart>
            <RightPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_psychologist})` }} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('psychologist', peopleCount.psychologist + 1)}>+</button>
                <div>{peopleCount.psychologist}</div>
                <button onClick={() => handlePeopleCountChange('psychologist', peopleCount.psychologist - 1)}>-</button>
              </RightPartWrapper>
        </RightPart>
      </DivWrapper>
      <DivWrapper>
            <LeftPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${sc_nyangachi})` }} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('nyangachi', peopleCount.nyangachi + 1)}>+</button>
                <div>{peopleCount.nyangachi}</div>
                <button onClick={() => handlePeopleCountChange('nyangachi', peopleCount.nyangachi - 1)}>-</button>
              </RightPartWrapper>
            </LeftPart>
            <RightPart>
              <LeftPartWrapper style={{ backgroundImage: `url(${timesetting})` }} />
              <RightPartWrapper>
                <button onClick={() => handlePeopleCountChange('timesetting', peopleCount.timesetting + 60)}>+</button>
                <div>{peopleCount.timesetting}</div>
                <button onClick={() => handlePeopleCountChange('timesetting', peopleCount.timesetting - 60)}>-</button>
              </RightPartWrapper>
        </RightPart>
      </DivWrapper>
          <DivWrapper>
            {isHost ? (
              <>
                <LeftPart>
                <ButtonContainer>
                <StartButton url="/${roomId}/day" onClick={() => navigate(`/${roomId}/day`, {state: {isHost: isHost, roomId: roomId, nickName: nickName}})} alt="Start Game"/>
                </ButtonContainer>
                </LeftPart>
                <RightPart>
                <ButtonContainer>
                  <InviteButton onClick={handleInviteClick} />
                  </ButtonContainer>
                </RightPart>
                
              </>
            ) : (
              <>
                <RightPart>
                  <ButtonContainer style ={{flex : '0.3'}}>
                  <InviteButton onClick={handleInviteClick} />
                  </ButtonContainer>
                </RightPart>
              </>
            )}
          </DivWrapper>
        
        </RightSection>
      </StyledContent>
    </Background>
  );
};

export default CommonLobby;

