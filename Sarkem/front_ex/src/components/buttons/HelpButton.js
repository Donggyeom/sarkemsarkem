import React  from 'react';
import styled from 'styled-components';
import helpbutton from '../../img/helpbutton.png';
import helpbuttonoff from '../../img/helpbuttonoff.png';
import buttonclickSound from '../../sound/buttonclick.mp3'

const HelpButtonImage = styled.img`
  width: 80%;
  margin-left: 30%; 
  cursor: pointer;
  &:hover {
    filter: brightness(0.8);
  }
  align-items: center;
`;


const HelpButton = ({ alt, onClick, isHelpOn }) => {
  const handleClick = () => {
    const sound = new Audio(buttonclickSound);
    sound.play();
    onClick(); 
  };

  return (
    <HelpButtonImage
      src={isHelpOn ? helpbutton : helpbuttonoff}
      alt={alt}
      onClick={handleClick} // 클릭 이벤트를 핸들링하는 함수 변경
    />
  );
};

export default HelpButton;


