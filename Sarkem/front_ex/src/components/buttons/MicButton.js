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

const MicButton = ({ alt, onClick }) => {
  const [isOn, setIsOn] = useState(true); // State를 사용하여 버튼 상태 관리

  const handleButtonClick = () => {
    setIsOn(!isOn); // 클릭 시 버튼 상태를 변경
    onClick(); // 상위 컴포넌트로부터 전달받은 onClick 함수 호출
  };

  return (
    <MicButtonImage
      src={isOn ? micButtonImageSrc : micOffButtonImageSrc}
      alt={alt}
      onClick={handleButtonClick} // 클릭 이벤트를 핸들링하는 함수 변경
    />
  );
};

export default MicButton;
