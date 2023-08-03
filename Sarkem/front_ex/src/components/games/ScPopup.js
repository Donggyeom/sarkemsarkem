import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PopupContainer = styled.div`
  position: fixed;
  top: ${props => props.top};
  left: ${props => props.left};
  transform: translate(-50%, -50%);
  z-index: 9999;
`;

const PopupImage = styled.img`
  width: 180px;
  height: auto;
  pointer-events: none;
`;

const Popup = ({ src, top, left }) => {
    return (
      <PopupContainer top={top} left={left}>
        <PopupImage src={src} alt="Popup" />
      </PopupContainer>
    );
  };
  
  export default Popup;