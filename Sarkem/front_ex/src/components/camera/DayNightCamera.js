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
  
  const DayNightCamera = React.memo(({ players }) => {
    const camCount = players.size;
    const gridStyles = calculateGrid(camCount);
    const [clickedCameras, setClickedCameras] = useState([]);
    
    const camArray = [];

    players.forEach((player, index) => {
      if (player.stream == undefined) return;

      camArray.push(player.stream);
    });

    const handleCamClick = (index) => {
      setClickedCameras((prevClicked) => {
        const newClicked = [...prevClicked];
        if (newClicked.includes(index)) {
          // Camera was already clicked, remove it from the clickedCameras array
          const indexToRemove = newClicked.indexOf(index);
          newClicked.splice(indexToRemove, 1);
        } else {
          // Camera was not clicked, add it to the clickedCameras array
          newClicked.push(index);
        }
        return newClicked;
      });
    };
  
    return (
      <CamCatGrid style={gridStyles}>
        {camArray && camArray.map((user, index) => (
          <CamCatWrapper key={index} camcount={camCount} index={index} onClick={() => handleCamClick(index)}>
            <CamCat props={user} />
            {clickedCameras.includes(index) && (
              <Votefoot src={voteImage} alt="Vote" />
            )}
          </CamCatWrapper>
        ))}
      </CamCatGrid>
    );
  });
  
  export default DayNightCamera;