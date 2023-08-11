import React from 'react';
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


const PsychologistBox = () => {
    // const { 심리학자어쩌구 } = useGameContext();
    const { player } = useRoomContext(); //target도 추가해야 함
    const role = player.role;
    console.log('ㅇㅇ됨');

    if (role === 'PSYCHO') { //&&  target===true
        console.log('조건됨')
    return (
      <Psychologistboxdiv>
        {/* {Psychologist} */}
        <div>happy</div>
        <div>sad</div>
        <div>disgusting</div>
        <div>go home</div>
      </Psychologistboxdiv>
    );
  }
  
  };
  
  export default PsychologistBox;
  