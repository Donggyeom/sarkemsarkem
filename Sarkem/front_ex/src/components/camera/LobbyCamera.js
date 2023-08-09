import React from 'react';
import styled from 'styled-components';
import CamCat from './camcat';

const LeftSectionWrapper = styled.div`
  flex: 55%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content : center;
  position: relative;
`;

const CamCatGrid = styled.div`
// left : 1.5%;
position : relative;
display: grid;
align-items: center;
justify-items: center;
// overflow: hidden;
${({ style }) =>
  style && `
  width: ${style.width};
  height : ${style.height};
  left : ${style.left};
`}
`;

const calculateGrid = (camCount) => {
  if (camCount === 1) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr',
      width: '100%',
    };
  } else if (camCount === 2) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr 1fr',
      width: '100%',
    };
  } else if (camCount === 3) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      width: '100%',
    };
  } else if (camCount === 4) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      width: '100%',
    };
  } else if (camCount === 5) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      width: '90%',
    };
  } else if (camCount === 6) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      width: '65%',
      height : '100%',
    };
  } else if (camCount === 7) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      width: '100%',
      height : '100%',
    };
  } else if (camCount === 8) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      width: '100%',
      height : '100%',
    };
  } else if (camCount === 9) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      width: '100%',
      height : '100%',
    };
  } else if (camCount === 10) {
    return {
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      width: '100%',
      height : '100%',
    };
  } else {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
    };
  }
};

const CamCatWrapper = styled.div`
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
  camCount === 5 && index === 0
  ? `
    position: relative;
    width : 75%;
    left : 50%;
  `
  :
  camCount === 5 && index === 1
  ? `
    position: relative;
    width : 75%;
    top : 100%;
  `
  :
  camCount === 5 && index === 2
  ? `
    position: relative;
    width : 75%;
  `
  :
  camCount === 5 && index === 3
  ? `
    position: relative;
    width : 75%;
    top : 100%;
  `
  :
  camCount === 5 && index === 4
  ? `
    position: relative;
    width : 75%;
  `
  :
  camCount === 7 && index === 0
  ? `
    position: relative;
    left : 100%;
  `
  :
  camCount === 7 && index === 1
  ? `
    position: relative;
    top : 100%;
  `
  :
  camCount === 7 && index === 2
  ? `
    position: relative;
    top : 100%;
  `
  :
  camCount === 7 && index === 3
  ? `
    position: relative;
  `
  :
  camCount === 7 && index === 4
  ? `
    position: relative;
    top : 100%;
  `
  :
  camCount === 7 && index === 5
  ? `
    position: relative;
    top : 100%;
  `
  :
  camCount === 7 && index === 6
  ? `
    position: relative;
  `
  :
  camCount === 8 && index === 0
  ? `
    position: relative;
    left : 50%;
  `
  :
  camCount === 8 && index === 1
  ? `
    position: relative;
    left : 50%;
  `
  :
  camCount === 8 && index === 2
  ? `
    position: relative;
    top : 100%;
  `
  :
  camCount === 8 && index === 3
  ? `
    position: relative;
  `
  :
  camCount === 8 && index === 4
  ? `
    position: relative;
  `
  :
  camCount === 8 && index === 5
  ? `
    position: relative;
    top : 100%;
  `
  :
  camCount === 8 && index === 6
  ? `
    position: relative;
  `
  :
  camCount === 8 && index === 7
  ? `
    position: relative;
  `
  :
  camCount === 10 && index === 0
  ? `
    position: relative;
    left : 100%;
  `
  :
  camCount === 10 && index === 1
  ? `
    position: relative;
    left : 100%;
  `
  :
  camCount === 10 && index === 2
  ? `
    position: relative;
    top : 100%;
  `
  :
  camCount === 10 && index === 3
  ? `
    position: relative;
    top : 100%;
  `
  :
  camCount === 10 && index === 4
  ? `
    position: relative;
  `
  :
  camCount === 10 && index === 5
  ? `
    position: relative;
  `
  :
  camCount === 10 && index === 6
  ? `
    position: relative;
    top : 100%;
  `
  :
  camCount === 10 && index === 7
  ? `
    position: relative;
    top : 100%;
  `
  :
  camCount === 10 && index === 8
  ? `
    position: relative;
  `
  :
  camCount === 10 && index === 9
  ? `
    position: relative;
  `
  : ''};
`;

const LobbyCamera = React.memo(( {ids} ) => {
  const camCount = ids.length;
  const gridStyles = calculateGrid(camCount);
  return (
    <LeftSectionWrapper>
      <CamCatGrid style={gridStyles}>
        {ids && ids.map((id, index) => (
          <CamCatWrapper key={index} camcount={camCount} index={index}>
            <CamCat id={id} />
          </CamCatWrapper>
        ))}
      </CamCatGrid>
    </LeftSectionWrapper>
  );
});

export default LobbyCamera;