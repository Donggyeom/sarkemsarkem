import React from 'react';
import styled from 'styled-components';
import buttonclickSound from '../../sound/buttonclick.mp3'

const ReButtonStyle = styled.div`
  box-sizing: border-box;
  flex-direction: column;
  gap: 12.89px;
  align-items: flex-start;
  justify-content: flex-start;
  width: 150px;
  height: 50px;
  position: relative;
  z-index:99;
  // box-shadow: 0px 5.16px 5.16px 0px rgba(0, 0, 0, 0.25),
  //   5px 5px 0px 0px rgba(0, 0, 0, 1);
  cursor: pointer;
  &:hover {
    filter: brightness(0.8);
  }
`;
const ReButtonImage = styled.img`
  width: 100%;
  height: 100%;
`;

const ReButton = ({ src, onClick, ...props }) => {
  const handleClick = () => {
    const sound = new Audio(buttonclickSound);
    var playPromise = sound.play();
    if (playPromise !== undefined) {
    playPromise.then(_ => {
      sound.pause();
    })
    .catch(error => {
      console.log("재시작 하는데에 오류가 발생했습니다.")
    });}


    
    onClick(); // Call the provided onClick handler from the parent component
  };
  return (
  <ReButtonStyle onClick={handleClick} {...props} >
      <ReButtonImage src={src} alt="Button Image" />
  </ReButtonStyle>);
};

export default ReButton;
