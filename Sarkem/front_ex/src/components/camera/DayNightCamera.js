
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CamCat from './camcat';
import voteImage from '../../img/votefoot.png';
import { useGameContext } from '../../GameContext';


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
    const [isSkipped, setIsSkipped] = useState(false);
    const { selectAction, selectConfirm, setSelectedTarget, myVote, startVote, dayCount } = useGameContext();
  
    useEffect(() => {
      if (!startVote) {
        setIsConfirmed(false);
        setClickedCameras([]);
        setIsSkipped(false);
      }
    }, [startVote]);
  
    const handleCamClick = (index) => {
      if (!startVote) {
        return;
      }
  
      if (isConfirmed) {
        return; // Confirm 후에는 변경 불가능
      }
  
      if (clickedCameras.includes(index)) {
        setClickedCameras((prevClicked) => prevClicked.filter((clickedIndex) => clickedIndex !== index));
      } else {
        if (clickedCameras.length === 0) {
          setClickedCameras([index]);
        }
      }
  
      selectAction({ playerId: JSON.parse(camArray[index].stream.session.connection.data).token });
    };
  
    const handleConfirmClick = () => {
      if (clickedCameras.length > 0) {
        setIsConfirmed(true);
        selectConfirm();
      }
    };
  
    const handleSkipClick = () => {
      if (!isConfirmed && !isSkipped && startVote) {
        setIsSkipped(true);
        setClickedCameras([]);
        setSelectedTarget("");
        selectConfirm();
      }
    };
  
    return (
      <CamCatGrid style={gridStyles}>
        {camArray.slice().reverse().map((user, index) => (
          <CamCatWrapper key={index} camCount={camCount} index={index} onClick={() => handleCamClick(index)}>
            <CamCat props={camArray[index]} />
            {clickedCameras.includes(index) && startVote && (
              <Votefoot src={voteImage} alt="Vote" />
            )}
          </CamCatWrapper>
        ))}
        <ButtonWrapper>
          {dayCount === 1 ? (
            <>
              {startVote && ( // 이 부분 추가
                <ActionButton onClick={handleSkipClick} disabled={isConfirmed || isSkipped}>
                  {isSkipped ? '스킵됨' : '스킵하기'}
                </ActionButton>
              )}
            </>
          ) : (
            <>
              {isConfirmed ? (
                <ActionButton disabled>확정됨</ActionButton>
              ) : (
                startVote && (
                  <ActionButton onClick={handleConfirmClick} disabled={clickedCameras.length === 0}>
                    확정하기
                  </ActionButton>
                )
              )}
              {startVote && (
                <ActionButton onClick={handleSkipClick} disabled={isConfirmed || isSkipped}>
                  {isSkipped ? '스킵됨' : '스킵하기'}
                </ActionButton>
              )}
            </>
          )}
        </ButtonWrapper>
      </CamCatGrid>
    );
  });
  
  export default DayNightCamera;