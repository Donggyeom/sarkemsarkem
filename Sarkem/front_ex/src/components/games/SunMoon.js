/* eslint-disable */

import React from 'react';
import styled from 'styled-components';
// import sunImageSrc from '../../img/sun1.png';
import sunMoonImageSrc from '../../img/sunmoon.gif';
// import sunMoonImageSrc from '../../img/sun1.png';
// import moonImageSrc from '../../img/micoffbutton.png';

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
