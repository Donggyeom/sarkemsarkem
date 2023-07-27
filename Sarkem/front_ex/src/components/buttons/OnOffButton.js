import React, { useState } from 'react';
import styled from 'styled-components';

import offImage from '../../img/off.png';
import onImage from '../../img/on.png';

const StartButtonImage = styled.img`
  width: 200px;
  cursor: pointer;
`;

const StartButton = () => {
  const [isOn, setIsOn] = useState(false);

  const handleButtonClick = () => {
    setIsOn((prevIsOn) => !prevIsOn);
  };

  return (
    <StartButtonImage
      src={isOn ? onImage : offImage}
      alt="OnOff Button"
      onClick={handleButtonClick}
    />
  );
};

export default StartButton;