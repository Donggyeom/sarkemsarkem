import React, { useState } from 'react';
import styled from 'styled-components';
import CamCat from './camcat';
import voteImage from '../../img/votefoot.png'


const Votefoot = styled.img`
  position: absolute;
  transform: translateX(-50%);
`;

const CamCatGrid = styled.div`
    position : absolute;
    display: grid;
    // grid-gap: 10px;
    align-items: center;
    justify-items: center;
    ${({ style }) =>
      style && `
      width: ${style.width};
      height : ${style.height};
      max-height: ${style.maxHeight};
      left : ${style.left};

  `}
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  color: white;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
`;

const calculateGrid = (camCount) => {
  const positions = [
  ];
  if (camCount === 1) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr',
      height : '100%',
      width: '100%',
    };
  } else if (camCount === 2) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr 1fr',
      width: '90%',
    };
  } else if (camCount === 3) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      width: '60%',
    };
  } else if (camCount === 4) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      width : '60%',
    };
  } else if (camCount === 5) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      width : '75%',
    };
} else if (camCount === 6) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      top : '7.5%',
      width : '80%',
    };
  } else if (camCount === 7) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: 'repeat(4, 1fr)',
      width : '90%',
    };
  } else if (camCount === 8) {
    return {
      gridTemplateRows: 'repeat(2, 1fr)',
      gridTemplateColumns: 'repeat(4, 1fr)',
      width: '85%',
    };
  } else if (camCount === 9) {
    return {
      gridTemplateRows: 'repeat(2, 1fr)',
      gridTemplateColumns: 'repeat(5, 1fr)',
      width: '95%',
      height : '70%',
    };
  } else if (camCount === 10) {
    return {
      gridTemplateRows: 'repeat(2, 1fr)',
      gridTemplateColumns: 'repeat(5, 1fr)',
      left : '5%',
      width: '90%',
      height : '70%',
    };
  } else {
    // Add more cases as needed
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
    };
  }
};

const CamCatWrapper = styled.div`
  position : relative;
  ${({ camCount, index }) =>

  camCount === 3 && index === 0
  ? `
    position: relative;
    left : 50%;
  `
  :
  camCount === 3 && index === 1
  ? `
    position: relative;
    top : 100%;
  `
  :
  camCount === 3 && index === 2
  ? `
    position: relative;
  `
  :
  camCount === 5 && index === 0
  ? `
    position: relative;
    left : 50%;
  `
  :
  camCount === 5 && index === 1
  ? `
    position: relative;
    left : 50%;
  `
  :
  camCount === 5 && index === 2
  ? `
    position: relative;
    top : 100%;
  `
  :
  camCount === 7 && index === 0
  ? `
    position: relative;
    left : 50%;
  `
  :
  camCount === 7 && index === 1
  ? `
    position: relative;
    left : 50%;
  `
  :
  camCount === 7 && index === 2
  ? `
    position: relative;
    left : 50%;
  `

  :
  camCount === 7 && index === 3
  ? `
    position: relative;
    top : 100%;
  `
  :
  camCount === 9 && index === 0
  ? `
    position: relative;
    left : 50%;
  `
  :
  camCount === 9 && index === 1
  ? `
    position: relative;
    left : 50%;
  `
  :
  camCount === 9 && index === 2
  ? `
    position: relative;
    left : 50%;
  `
  :
  camCount === 9 && index === 3
  ? `
    position: relative;
    left : 50%;
  `
  :
  camCount === 9 && index === 4
  ? `
    position: relative;
    top : 100%;
  `
  : ''};
  `;
  
  const DayNightCamera = React.memo(({ camArray }) => {
    const camCount = camArray.length;
    const gridStyles = calculateGrid(camCount);
    const [clickedCameras, setClickedCameras] = useState([]);
    const [isConfirmed, setIsConfirmed] = useState(false);
  
    const handleCamClick = (index) => {
      if (isConfirmed) {
        return; // Do not allow changing vote after confirming
      }
  
      if (clickedCameras.includes(index)) {
        // If the camera was already clicked, unclick it
        setClickedCameras((prevClicked) => prevClicked.filter((clickedIndex) => clickedIndex !== index));
      } else {
        // If the camera was not clicked, check if another camera is already clicked
        if (clickedCameras.length === 0) {
          setClickedCameras([index]);
        }
      }
    };
  
    const handleConfirmClick = () => {
      if (clickedCameras.length > 0) {
        setIsConfirmed(true);
      }
    };
  
    const handleSkipClick = () => {
      if (!isConfirmed) {
        setClickedCameras([]); // Reset clicked cameras if skipping before confirming
      }
    };
  
    return (
      <CamCatGrid style={gridStyles}>
        {camArray.slice().reverse().map((user, index) => (
          <CamCatWrapper key={index} camCount={camCount} index={index} onClick={() => handleCamClick(index)}>
            <CamCat props={camArray[index]} />
            {clickedCameras.includes(index) && (
              <Votefoot src={voteImage} alt="Vote" />
            )}
          </CamCatWrapper>
        ))}
        <ButtonWrapper>
          {!isConfirmed && (
            <>
              {clickedCameras.length > 0 ? (
                <ActionButton onClick={handleConfirmClick}>확정하기</ActionButton>
              ) : (
                <ActionButton onClick={handleSkipClick}>스킵하기</ActionButton>
              )}
            </>
          )}
          {isConfirmed && (
            <ActionButton disabled>확정됨</ActionButton>
          )}
        </ButtonWrapper>
      </CamCatGrid>
    );
  });
  export default DayNightCamera;

  
  
  
  
  