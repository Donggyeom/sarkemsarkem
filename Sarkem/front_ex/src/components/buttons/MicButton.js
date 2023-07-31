import React, { useState } from 'react';
import styled from 'styled-components';
import micButtonImageSrc from '../../img/micbutton.png';
import micOffButtonImageSrc from '../../img/micoffbutton.png';

const MicButtonImage = styled.img`
  width: 60px;
  height: 60px;
  cursor: pointer;
  position: absolute;
  left: 30px;
  top: 220px;
  overflow: visible;
`;

const MicButton = ({ alt, onClick, isMicOn }) => {
  return (
    <MicButtonImage
      src={isMicOn ? micButtonImageSrc : micOffButtonImageSrc} // 이미지는 더 이상 상태에 따라 변경할 필요가 없으므로 삭제
      alt={alt}
      onClick={onClick} // 클릭 이벤트를 핸들링하는 함수 변경
    />
  );
};

export default MicButton;


