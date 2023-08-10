import React from 'react';
import styled from 'styled-components';
import buttonclickSound from '../../sound/buttonclick.mp3'

const ReButtonStyle = styled.div`
  box-sizing: border-box;
  background: #f3b7bf;
  border-radius: 30.94px;
  border-style: solid;
  border-color: #000000;
  border-width: 5.16px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 40px;
  flex-direction: column;
  gap: 12.89px;
  align-items: flex-start;
  justify-content: flex-start;
  width: 150px;
  height: 50px;
  position: relative;
  box-shadow: 0px 5.16px 5.16px 0px rgba(0, 0, 0, 0.25),
    5px 5px 0px 0px rgba(0, 0, 0, 1);
  cursor: pointer;
  &:hover {
    filter: brightness(0.8);
    
  }

  color: #ffffff;
  font-size: 25px;
  text-align: center;
  text-shadow: 1px 1px black;
  -webkit-text-stroke: 1px black; /* For webkit-based browsers like Chrome, Safari */
  text-stroke: 1px black; /* Standard property for future compatibility */
`;

const ReButton = ({ onClick, ...props }) => {
  const handleClick = () => {
    const sound = new Audio(buttonclickSound);
    sound.play();
    onClick(); // Call the provided onClick handler from the parent component
  };
  return <ReButtonStyle onClick={handleClick} {...props} />;
};

export default ReButton;
