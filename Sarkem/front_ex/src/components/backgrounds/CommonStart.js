import React, { useState } from 'react';
import styled from 'styled-components';
import logoImage from '../../img/logo.png';
import camcatImage from '../../img/camcat.png';
import boxImage from '../../img/box.png';
import Background from '../backgrounds/BackgroundSunset';
import usernicknameImage from '../../img/usernickname.png';
import usernicknameinputImage from '../../img/usernicknameinput.png';
import offImage from '../../img/off.png';
import onImage from '../../img/on.png';
import micImage from '../../img/mic.png';
import camImage from '../../img/cam.png';

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
  /* 왼쪽 섹션 스타일 작성 */
  flex: 4; /* 40% of the available width */
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${camcatImage});
  background-size: 85% 85%;
  background-repeat: no-repeat;
  background-position: center center;
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
  padding : 50px 0px 50px 150px;
`;

const Logo = styled.img`
  /* 로고 이미지 스타일 작성 */
  max-width: 60vw; /* 가로 크기 60% */
  height: auto; /* 세로 크기 자동으로 조정 */
  max-height: 100%; /* 세로 크기 100% */
`;

const CommonStart = ({image, onClick} ) => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(false);

  const handleMicToggle = () => {
    setIsMicOn((prevIsMicOn) => !prevIsMicOn);
  };

  const handleCamToggle = () => {
    setIsCamOn((prevIsCamOn) => !prevIsCamOn);
  };

  return (
    <Background>
      <StyledStartPage>
        <StyledHeader>
          <Logo src={logoImage} alt="로고" />
        </StyledHeader>

        <StyledContent>
          <LeftSection></LeftSection>
          <RightSection>
            <DivWrapper>
              <LeftPart style={{ backgroundImage: `url(${usernicknameImage})` }}></LeftPart>
              <RightPart style={{ backgroundSize: '85%', backgroundImage: `url(${usernicknameinputImage})` }}></RightPart>
            </DivWrapper>
            <DivWrapper>
              <LeftPart style={{ backgroundImage: `url(${camImage})` }}></LeftPart>
              <RightPart onClick={handleCamToggle} style={{ backgroundImage: `url(${isCamOn ? onImage : offImage})` }}></RightPart>
            </DivWrapper>
            <DivWrapper>
              <LeftPart style={{ backgroundImage: `url(${micImage})` }}></LeftPart>
              <RightPart onClick={handleMicToggle} style={{ backgroundImage: `url(${isMicOn ? onImage : offImage})` }}></RightPart>
            </DivWrapper>
            <DivWrapper>
          {/* 이미지에 대한 버튼을 추가하려는 곳 */}
          {/* 클릭 이벤트를 onClick prop으로 받은 함수로 설정 */}
          <img
            src={image}
            alt="버튼 이미지"
            style={{ width: '40%', height: '80%', margin: 'auto', cursor: 'pointer' }}
            onClick={onClick}
          />
        </DivWrapper>
          </RightSection>
        </StyledContent>
      </StyledStartPage>
    </Background>
  );
};

export default CommonStart;