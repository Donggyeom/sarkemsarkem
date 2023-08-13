import React, { useEffect } from 'react';
import styled from 'styled-components';
import psychologistBox from '../../img/psychologistbox.png'
import { useGameContext } from '../../GameContext';
import { useRoomContext } from '../../Context';

const Psychologistboxdiv = styled.div`
  background-image: url(${psychologistBox});
  background-size: cover;
  background-color: transparent;
  background-repeat: no-repeat;
  width: 175px;
  height: 175px; 
  justify-content: center;
  display: flex;
  flex-direction: column;
  font-family: 'NeoDunggeunmoPro-Regular', sans-serif;
  font-size: 20px;
  color: #723a00;
  position: absolute;
  top: 13%;
  right: 2%;
//   transform: translate(-50%, -50%);
  z-index: 5;
  align-items: center;
`;


const PsychologistBox = ({detectExpressions}) => {
    console.log(detectExpressions);
    let happy = 0;
    let sad = 0;
    let disgusted = 0;
    let neutral = 0;
    let angry = 0;
    let surprised = 0;
    let fearful = 0;
    if((detectExpressions!==undefined)&&(detectExpressions!==null)){
      happy = Math.round(detectExpressions.expressions.happy * 100) / 10;
      sad = Math.round(detectExpressions.expressions.sad * 100) / 10;
      disgusted = Math.round(detectExpressions.expressions.disgusted * 100) / 10;
      neutral = Math.round(detectExpressions.expressions.neutral * 100) / 10;
      angry = Math.round(detectExpressions.expressions.angry * 100) / 10;
      surprised = Math.round(detectExpressions.expressions.surprised * 100) / 10;
      fearful = Math.round(detectExpressions.expressions.fearful * 100) / 10;
    }
    const { player } = useRoomContext();
    const role = player.current.role;

    if (role === 'PSYCHO') { //&&  target===true
    return (
      <Psychologistboxdiv>
        {/* {Psychologist} */}
        <div>happy : {happy}</div>
        <div>sad : {sad}</div>
        <div>disgusted : {disgusted}</div>
        <div>neutral : {neutral}</div>
        <div>angry : {angry}</div>
        <div>surprised: {surprised}</div>
        <div>fearful : {fearful}</div>
      </Psychologistboxdiv>
    );
  }
  
  };
  
  export default PsychologistBox;
  