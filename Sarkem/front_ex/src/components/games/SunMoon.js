/* eslint-disable */

import React from 'react';
import styled from 'styled-components';
import sunMoonImageSrc from '../../img/sunmoon.gif';

const SunMoonImage = styled.img`
    width: 90px;
    height: 80px;
    position: absolute;
    left: 20px;
    top: 10px;
`;

const SunMoon = ({ alt }) => {

  return (
    <SunMoonImage
      src={sunMoonImageSrc}
      alt={alt}
    />
  );
};

export default SunMoon;
