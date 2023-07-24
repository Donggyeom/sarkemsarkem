import React, { useState } from 'react';
import styled from 'styled-components';
import camButtonImageSrc from '../../img/cambutton.png';
import camOffButtonImageSrc from '../../img/camoffbutton.png';

const CamButtonImage = styled.img`
  width: 60px;
  height: 60px;
  cursor: pointer;
  position: absolute;
  left: 30px;
  top: 150px;
  overflow: visible;
}
`;

const CamButton = ({ alt, onClick }) => {
  const [isOn, setIsOn] = useState(true); // State를 사용하여 버튼 상태 관리

  const handleButtonClick = () => {
    setIsOn(!isOn); // 클릭 시 버튼 상태를 변경
    onClick(); // 상위 컴포넌트로부터 전달받은 onClick 함수 호출
  };

  return (
    <CamButtonImage
      src={isOn ? camButtonImageSrc : camOffButtonImageSrc}
      alt={alt}
      onClick={handleButtonClick} // 클릭 이벤트를 핸들링하는 함수 변경
    />
  );
};

export default CamButton;
