import React from 'react';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundSunset';
import '../index.css';

const CamCatGrid = styled.div`
  flex: 1;
  overflow: hidden;
  display: grid;
  align-items: center;
  justify-items: center;
  ${({ style }) =>
    style &&
    `
    grid-template-rows: ${style.gridTemplateRows};
    grid-template-columns: ${style.gridTemplateColumns};
    width: ${style.width};
    max-height: ${style.maxHeight};
    height: auto;
  `}
`;

const calculateGrid = (camCount) => {
  const positions = [];

  if (camCount === 1) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr',
      positions: [{ row: 1, col: 1 }],
      width: '100%',
      backgroundColor: 'red', // Set your desired background color here for camCount 1
    };
  } else if (camCount === 2) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr 1fr',
      positions: [
        { row: 1, col: 1 },
        { row: 1, col: 2 },
      ],
      width: '100%',
      height: '100%',
      backgroundColor: 'blue', // Set your desired background color here for camCount 2
    };
  } else if (camCount === 3) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr 3fr 1fr',
      positions: [
        { row: 1, col: 1 },
        { row: 2, col: 1 },
        { row: 2, col: 2 },
      ],
      left: '5%',
      width: '90%',
      backgroundColor: 'green', // Set your desired background color here for camCount 3
    };
  } else if (camCount === 4) {
    return {
      gridTemplateRows: '0fr 0fr',
      gridTemplateColumns: '1fr 2.5fr 1fr',
      positions: [
        { row: 1, col: 1 },
        { row: 1, col: 3 },
        { row: 2, col: 1 },
        { row: 2, col: 3 },
      ],
      width: '65%',
      left: '17.5%',
      backgroundColor: 'yellow', // Set your desired background color here for camCount 4
    };
  } else if (camCount === 5) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      positions: positions.slice(0, camCount),
      width: '62%',
      backgroundColor: 'purple', // Set your desired background color here for camCount 5
    };
  } else if (camCount === 6) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      positions: positions.slice(0, camCount),
      width: '62%',
      backgroundColor: 'orange', // Set your desired background color here for camCount 6
    };
  } else if (camCount === 7) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      positions: positions.slice(0, camCount),
      width: '92%',
      backgroundColor: 'pink', // Set your desired background color here for camCount 7
    };
  } else if (camCount === 8) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      positions: positions.slice(0, camCount),
      width: '92%',
      backgroundColor: 'cyan', // Set your desired background color here for camCount 8
    };
  } else if (camCount === 9) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      positions: positions.slice(0, camCount),
      width: '92%',
      backgroundColor: 'grey', // Set your desired background color here for camCount 9
    };
  } else if (camCount === 10) {
    return {
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      positions: positions.slice(0, camCount),
      width: '92%',
      backgroundColor: 'brown', // Set your desired background color here for camCount 10
    };
  } else {
    // Add more cases as needed
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      positions: positions.slice(0, camCount),
      backgroundColor: 'white', // Set your default background color here for other camCounts
    };
  }
};

const TimeSecond = styled.text`
  /* Your style content here */
`;

const SunsetCam = () => {
  const camCount = 5; // Replace this with the actual camCount value you want to use

  // Calculate the grid layout and background color based on the camCount
  const gridStyle = calculateGrid(camCount);

  // Create an array to store the individual CamCat components with different colors

  return (
    <Background>
      <CamCatGrid style={gridStyle}></CamCatGrid>
    </Background>
  );
};

export default SunsetCam;