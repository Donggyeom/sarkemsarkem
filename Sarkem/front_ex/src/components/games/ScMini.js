/* eslint-disable */
console.error = (message) => {};
// 아무리 생각해도 문제없어서 냅다 이거 박아버림
// 여긴 건드릴 일 없으니 우선 괜찮을 거라 믿어요


import React, { useState, useEffect } from 'react';
import styled,  { keyframes }  from 'styled-components';
import scSarkImageSrc from '../../img/sc_삵.png';
import scPoliceImageSrc from '../../img/sc_경찰.png';
import scNyangImageSrc from '../../img/sc_냥아치.png';
import scVetImageSrc from '../../img/sc_수의사.png';
import scCatImageSrc from '../../img/sc_시민.png';
import scPsychoImageSrc from '../../img/sc_심리학자.png';
import scDetectImageSrc from '../../img/sc_탐정.png';
import scObserverImageSrc from '../../img/observing.png';
import cSarkImageSrc from '../../img/c_삵.png';
import cPoliceImageSrc from '../../img/c_경찰.png';
import cNyangImageSrc from '../../img/c_냥아치.png';
import cVetImageSrc from '../../img/c_수의사.png';
import cCatImageSrc from '../../img/c_시민.png';
import cPsychoImageSrc from '../../img/c_심리학자.png';
import cDetectImageSrc from '../../img/c_탐정.png';


// 직업마다 번호 같은 걸 부여받겠지?
// 부여받은 번호대로 이미지 다르게 뜨게 해야 함. 설정해 줘야 함
// 일단 삵으로 만들어 둠

// 첫날 낮에만 뜨게 해야함

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
  z-Index : 2;
  width: 175px;
  cursor: ${({ role }) => (role === 'OBSERVER' ? 'default' : 'pointer')};
  position: absolute;
  top: 3%;
  right: 2%;
  ${({ role }) => role !== 'OBSERVER' && `
    &:hover {
      filter: brightness(0.8);
    }
  `}
`;

const ScMiniButton = styled.div`

`;

const StyledPopup = styled.div`
  z-Index : 2;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${({ isClosing }) => (isClosing ? slideOut : slideIn)} 0.5s ease;
`;

const PopupImage = styled.img`
  width: 300px;
  z-Index : 2;
`;

const ScMini = ({ alt, role, dayCount }) => {

  const [isPopupOpen, setIsPopupOpen] = useState(dayCount === 1);
  const [isClosing, setIsClosing] = useState(false); // 팝업이 닫히는 상태를 저장하는 state


  const handleScMiniClick = () => {
    
    setIsPopupOpen(true);

  };

  const handlePopupClose = () => {
    setIsClosing(true); // 팝업을 닫는 상태로 변경하여 애니메이션 적용
    setTimeout(() => {
      setIsPopupOpen(false);
      setIsClosing(false); // 팝업이 완전히 사라지면 팝업 닫는 상태를 false로 변경
    }, 450); // 0.5초(500ms) 후에 팝업을 완전히 닫습니다.
  };

  useEffect(() => {
    if (dayCount === 0) {
      setIsPopupOpen(true);
    }
  }, [dayCount]);

  let buttonImageSrc;
  let popupImageSrc;

  if (role === 'SARK') {
    buttonImageSrc = scSarkImageSrc;
    popupImageSrc = cSarkImageSrc;
  } else if (role === 'CITIZEN') {
    buttonImageSrc = scCatImageSrc;
    popupImageSrc = cCatImageSrc;
  } else if (role === 'DOCTOR') {
    buttonImageSrc = scVetImageSrc;
    popupImageSrc = cVetImageSrc;
  } else if (role === 'POLICE') {
    buttonImageSrc = scPoliceImageSrc;
    popupImageSrc = cPoliceImageSrc;
  } else if (role === 'OBSERVER') {
    buttonImageSrc = scObserverImageSrc;
  } else if (role === 'PSYCHO') {
    buttonImageSrc = scPsychoImageSrc;
    popupImageSrc = cPsychoImageSrc;
  } else if (role === 'BULLY') {
    buttonImageSrc = scNyangImageSrc;
    popupImageSrc = cNyangImageSrc;
  } else if (role === 'DETECTIVE') {
    buttonImageSrc = scDetectImageSrc;
    popupImageSrc = cDetectImageSrc;
  }


  return (
    <>
      <ScMiniButton onClick={handleScMiniClick}>
        <ScButtonImage src={buttonImageSrc} alt={alt} />
      </ScMiniButton>
      {role !== 'OBSERVER' && isPopupOpen && (
        <StyledPopup isClosing={isClosing} onClick={handlePopupClose}>
          <PopupImage src={popupImageSrc} alt={alt} />
        </StyledPopup>
      )}
    </>
  );
};

export default ScMini;





