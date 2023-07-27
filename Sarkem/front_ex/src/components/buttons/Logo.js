import React from 'react';
import styled from 'styled-components';
import logoImage from '../../img/logo.png'; // 이미지 경로를 올바르게 수정해주세요.

const StyledLogo = styled.img`
  /* 로고 이미지의 비율을 계산하여 크기를 조정 */
  width: ${props => props.size || '65%'}; /* props.size가 없으면 기본값으로 65%를 사용합니다. */
  max-width: 1491px;
  aspect-ratio: 1491 / 684;
`;

const Logo = ({ size }) => {
  return <StyledLogo src={logoImage} alt="로고" size={size} />;
};

export default Logo;