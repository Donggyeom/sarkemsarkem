import React from 'react';
import styled from 'styled-components';
import backgroundImage from '../../img/back2.png';

const StyledBackground = styled.div`
  background-image: url(${backgroundImage});
  background-size: '100% 100%';
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
`;

const Background = ({ children }) => {
  return <StyledBackground>{children}</StyledBackground>;
};

export default Background;