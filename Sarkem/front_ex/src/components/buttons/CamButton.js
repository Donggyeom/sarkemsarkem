import React from 'react';
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
  z-index: 1;
`;

const CamButton = ({ alt, onClick, isCamOn }) => {
  return (
    <CamButtonImage
      src={isCamOn ? camButtonImageSrc : camOffButtonImageSrc}
      alt={alt}
      onClick={onClick}
    />
  );
};

export default CamButton;
