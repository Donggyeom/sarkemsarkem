import React from 'react';
import styled from 'styled-components';
import agreeButtonImage from '../../img/찬성.png';
import disagreeButtonImage from '../../img/반대.png';


const SmallButton = styled.button`
  padding: 0;
  background: none;
  cursor: pointer;
  border: none;
  &:hover {
    filter: brightness(0.8);
  }
`;

const AgreeButton = ({ onClick, disabled }) => (
  <SmallButton onClick={onClick} disabled={disabled}>
    <img src={agreeButtonImage} alt="찬성" style={{ width: '50%', height: '100%' }} />
  </SmallButton>
);

const DisagreeButton = ({ onClick, disabled }) => (
  <SmallButton onClick={onClick} disabled={disabled}>
    <img src={disagreeButtonImage} alt="반대" style={{ width: '50%', height: '100%' }} />
  </SmallButton>
);


export { AgreeButton, DisagreeButton };