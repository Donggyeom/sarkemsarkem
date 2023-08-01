import React from 'react';
import styled from 'styled-components';
import backgroundImage from '../../img/back1.png';

const StyledBackground = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100vh;
`;

const Background = ({ children }) => {
  return <StyledBackground>{children}</StyledBackground>;
};

export default Background;
