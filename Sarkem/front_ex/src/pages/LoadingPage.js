import React from 'react';
import Background from '../components/backgrounds/BackgroundSunset';
import styled from 'styled-components';
import logoImage from '../img/logo.png';
import loadingImage from '../img/loading1.jpg';

const StyledHeader = styled.div`
  /* 헤더 스타일 작성 */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 15vh; /* 화면 높이의 15%로 설정 */
  width: 100%;
  background-color: rgba(196, 196, 196, 0.3);
`;

const Logo = styled.img`
  /* 로고 이미지 스타일 작성 */
  max-width: 60vw; /* 가로 크기 60% */
  height: auto; /* 세로 크기 자동으로 조정 */
  max-height: 100%; /* 세로 크기 100% */
`;

const LoadingPage = () => {
  return (
    <div>
      <h1>로딩 페이지</h1>
      {/* 여기에 로딩 페이지의 내용을 추가할 수 있습니다. */}
    </div>
  );
};

const CenteredImage = styled.img`
  /* 이미지를 화면 가운데에 위치시키기 위해 필요한 스타일 작성 */
  display: block;
  margin: 20vh auto 0; /* Adjust the top margin to move the image down */
  max-width: 100%;
  max-height: 100%;
`;

export default () => {
  return (
    <Background>
      <StyledHeader>
        <Logo src={logoImage} alt="로고" />
      </StyledHeader>
      <CenteredImage src={loadingImage} alt="로딩 중" />
    </Background>
  );
};