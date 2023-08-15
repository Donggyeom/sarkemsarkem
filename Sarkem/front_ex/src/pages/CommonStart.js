
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import logoImage from '../img/logo.png';
import camcatImage from '../img/camcat2.png';
import boxImage from '../img/box.png';
import Background from '../components/backgrounds/BackgroundSunset';
import usernicknameImage from '../img/usernickname.png';
import usernicknameinputImage from '../img/usernicknameinput.png';
// import offImage from '../img/off.png';
// import onImage from '../img/on.png'
import micImage from '../img/mic.png';
import camImage from '../img/cam.png';
import GoroomButton from '../components/buttons/goroomButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRoomContext } from '../Context';
import ToggleButton from '../components/buttons/ToggleButton';
import HelpButton from '../components/buttons/HelpButton';
import Help from '../components/games/Help';

const StyledStartPage = styled.div`
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 15vh; /* 화면 높이의 15%로 설정 */
  width: 100%;
  background-color: rgba(196, 196, 196, 0.3);
`;

const StyledContent = styled.div`
  display: flex;
  height: 85vh; /* 화면 높이의 85%로 설정 */
  width: 100%;
`;

const LeftSection = styled.div`
  flex: 4;
  display: flex;
  justify-content: center;
  margin-left : 2.5%;
  // margin-top : 1%;
`;

const RightSection = styled.div`
  /* 오른쪽 섹션 스타일 작성 */
  flex: 6; /* 60% of the available width */
  background-image: url(${boxImage});
  background-size: 90% 85%;
  background-repeat: no-repeat;
  background-position: center center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px 30px; /* 원하는 크기로 설정 */
`;

const DivWrapper = styled.div`
  /* Wrapper for each RightDiv to split into two parts, except for Div 4 */
  display: flex;
  width : 100%;
  height : 100%;
  justify-content: center;
`;

const LeftPart = styled.div`
  /* Left part of each RightDiv */
  flex: 4;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: 15vw;
  background-position: center center;
  padding : 50px 0px 0px 150px ;
  background-repeat: no-repeat;
`;

const RightPart = styled.div`
  /* Right part of each RightDiv */
  flex: 6;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: 15vw;
  background-position: center center;
  background-repeat: no-repeat;
  padding: 50px 10px 50px 10px;
  font-family: "RixInooAriDuriR";
  font-size: 35px;

  /* Input styling */
  input {
    width: 300px; /* 원하는 너비로 설정 */
    height: 50px; /* 원하는 높이로 설정 */
    padding: 5px;
    font-size: 30px;
    border: none;
    background-color: transparent;
    outline: none;
    // text-align: center; 
    font-family: "RixInooAriDuriR";
    font-weight: 10% !important;
  }
  span {
    margin: 0 50px; /* You can adjust the margin as needed */
  }
`;

const ButtonContainer = styled.div`
  width: 60%;
  height: 85%;
`;
const LeftPart2 = styled.div`
  /* Left part of each RightDiv */
  flex: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: 15vw;
  background-position: center center;
  // padding: 0px 10px 50px 10px;
  background-repeat: no-repeat;
  margin-left: 20px;
`;

const RightPart2 = styled.div`
  /* Right part of each RightDiv */
  flex: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: 15vw;
  background-position: center center;
  // padding: 0px 10px 50px 10px;
  background-repeat: no-repeat;
`;

const Logo = styled.img`
  /* 로고 이미지 스타일 작성 */
  max-width: 60vw; /* 가로 크기 60% */
  height: auto; /* 세로 크기 자동으로 조정 */
  max-height: 100%; /* 세로 크기 100% */
`;



const CommonStart = ({onClick} ) => {
  const { player, setPlayer, roomSession, setRoomSession, getGameRoom } = useRoomContext();
  const [ roomId, setRoomId ] = useState("");
  const [ nickName, setNickName ] = useState('냥냥' + Math.floor(Math.random() * 100));
  const navigate = useNavigate();
  const location = useLocation();

  const videoRef = useRef(null);
  const audioRef = useRef(null);


  ////////////   CommonStart Effect   ////////////


  useEffect(() => {

    // 룸아이디 유무 여부 확인하고 룸아이디 있으면 오류 X, 없으면 오류페이지 O 확인하기
    let roomId = location.pathname.split("/")[1];
    setRoomId(roomId);
    if (roomId === ""){
      alert("roomId 정보가 없습니다.");
      navigate("/");
      return;
    }

    // 게임방 존재 여부 확인
    checkGameRoom(roomId);
    
    // 카메라 세팅
    getUserCamera();

    // 마이크 세팅
    getUserAudio();

  }, []);

  useEffect(() => {
    setPlayer([{key: 'nickName', value: nickName}]);
  }, [nickName]);

  ////////////  CommonStart 함수  ////////////

  const checkGameRoom = async (roomId) => {
    console.log('checkGameRoom');
    var gameRoom = await getGameRoom(roomId);
    if (gameRoom == null) {
      setPlayer([{key: 'isHost', value: true}]);
    }
    else {
      setPlayer([{key: 'isHost', value: false}]);
      setRoomSession((prev) => {
        return ({
          ...prev,
          roomId: gameRoom.roomId,
          gameId: gameRoom.gameId
        });
      });
    }
  };

  const getUserCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.style.transform = 'scaleX(-1)';
      setPlayer([{key: 'isCamOn', value: true}]);
    }
    catch (error) {
      console.error("Failed to start video: ", error);
    }
  };

  const getUserAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRef.current.srcObject = stream;
      setPlayer([{key: 'isMicOn', value: true}]);
    }
    catch (error) {
      console.error("Failed to start audio: ", error);
    }
  };

  const handleMicToggle = () => {
    const micOn = !player.current.isMicOn;
    try{
      const tracks = audioRef.current.srcObject.getTracks();
      tracks.forEach((track) => {
        track.enabled = micOn;
      });
    } catch(error) {
      console.log("마이크 정보가 없습니다.");
    }
    setPlayer([{key: 'isMicOn', value: micOn}]);
  };

  const handleCamToggle = () => {
    const camOn = !player.current.isCamOn;
    try{
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => {
        track.enabled = camOn;
      });
    } catch(error) {
      console.log("카메라 정보가 없습니다.");
    }
    setPlayer([{key: 'isCamOn', value: camOn}]);

  };

  const handleNickNameChange = (event) => {
    setNickName(event.target.value);
  };

    //도움말
    const [isHelpOn, setIsHelpOn] = useState(true);
    const handleHelpButtonClick = () => {
      setIsHelpOn((prevIsHelpOn) => !prevIsHelpOn);
    };


  return (
    <Background>
      {!isHelpOn && <Help top="43%" left="65%" />}
      <StyledStartPage>
        <StyledHeader>
          <Logo src={logoImage} alt="로고" />
        </StyledHeader>

        <StyledContent>

          <LeftSection>
          <div style={{ position: 'relative', width: '85%', height: '63%', borderRadius: '10%' }}>
          <video
              ref={videoRef}
              autoPlay
              style={{
                marginTop: "25%",
                width: '96%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '10%',
                borderStyle : 'solid', borderRadius : '10%', borderWidth : '0.7em', borderColor : '#343434'

              }}
            />

            <img
              src={camcatImage}
              alt="CamCat"
              style={{
                position: 'absolute',
                top: '35%',
                left: '50.5%',
                transform: 'translate(-50%, -50%)', // Center the image
                width: '102.5%', // Adjust the size of the image as needed
                height: '32%',
                zIndex: 1, // Ensure the image is above the video (z-index: 0 by default)
              }}
            />
             <audio ref={audioRef} autoPlay />
          </div>
          </LeftSection>

          <RightSection>
            <DivWrapper>
              <LeftPart style={{ backgroundImage: `url(${usernicknameImage})` }}></LeftPart>
              <RightPart style={{ backgroundSize: '85%', backgroundImage: `url(${usernicknameinputImage})` }}>
            {/* Input field */}
            <input
              type="text"
              value={nickName}
              onChange={handleNickNameChange}
              placeholder="닉네임 입력"
              maxLength={9} // 최대 글자수 제한
            />
            </RightPart>
            </DivWrapper>
            <DivWrapper>
              <LeftPart style={{ backgroundImage: `url(${camImage})` }}></LeftPart>
              {/* <RightPart onClick={handleCamToggle} style={{ backgroundImage: `url(${isCamOn ? onImage : offImage})` }}></RightPart> */}
              <RightPart>
                <span>OFF</span> <ToggleButton checked={true} onChange={handleCamToggle} /> <span>ON</span>
              </RightPart>
            </DivWrapper>
            <DivWrapper>
              <LeftPart style={{ backgroundImage: `url(${micImage})` }}></LeftPart>
              {/* <RightPart onClick={handleMicToggle} style={{ backgroundImage: `url(${isMicOn ? onImage : offImage})` }}></RightPart> */}
              <RightPart>
                <span>OFF</span> <ToggleButton checked={true} onChange={handleMicToggle} /> <span>ON</span>
              </RightPart>
            </DivWrapper>
            <DivWrapper>
              <LeftPart2>
                <ButtonContainer>
                  <HelpButton onClick={handleHelpButtonClick} isHelpOn={isHelpOn} />
                </ButtonContainer>
              </LeftPart2>
              <RightPart2>
                <ButtonContainer>
                   {/* 조건부 렌더링을 사용하여 버튼 선택 */}
                   <GoroomButton onClick={onClick} roomId={roomId} />
                </ButtonContainer>
              </RightPart2>
              
            </DivWrapper>
          </RightSection>
        </StyledContent>
      </StyledStartPage>
    </Background>
  );
};

export default CommonStart;