import React, { useState } from 'react';
import styled,  { keyframes }  from 'styled-components';
import scSarkImageSrc from '../../img/sc_삵.png';
// import scCopImageSrc from '../../img/sc_경찰.png';
// import scNyangImageSrc from '../../img/sc_냥아치.png';
// import scVetImageSrc from '../../img/sc_수의사.png';
// import scCatImageSrc from '../../img/sc_시민.png';
// import scMindImageSrc from '../../img/sc_심리학자.png';
// import scDetectImageSrc from '../../img/sc_탐정.png';
import cSarkImageSrc from '../../img/c_삵.png';

// 직업마다 번호 같은 걸 부여받겠지?
// 부여받은 번호대로 이미지 다르게 뜨게 해야 함. 설정해 줘야 함
// 일단 삵으로 만들어 둠

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;
const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const ScButtonImage = styled.img`
  width: 175px;
  cursor: pointer;
  position: absolute;
  top: 3%;
  right: 2%;
`;

const ScMiniButton = styled.div`
`;

const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${({ isClosing }) => (isClosing ? slideOut : slideIn)} 0.5s ease; /* 팝업이 사라질 때 애니메이션 적용 */
`;

const PopupImage = styled.img`
  width: 300px;
`;

const ScMini = ({ alt }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // 팝업이 닫히는 상태를 저장하는 state

  const handleScMiniClick = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsClosing(true); // 팝업을 닫는 상태로 변경하여 애니메이션 적용
    setTimeout(() => {
      setIsPopupOpen(false);
      setIsClosing(false); // 팝업이 완전히 사라지면 팝업 닫는 상태를 false로 변경
    }, 500); // 0.5초(500ms) 후에 팝업을 완전히 닫습니다.
  };

  return (
    <>
      <ScMiniButton onClick={handleScMiniClick}>
        <ScButtonImage src={scSarkImageSrc} alt={alt} />
      </ScMiniButton>
      {isPopupOpen && (
        <Popup isClosing={isClosing} onClick={handlePopupClose}>
          <PopupImage src={cSarkImageSrc} alt={alt} />
        </Popup>
      )}
    </>
  );
};

export default ScMini;