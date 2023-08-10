import React, { memo, useState, useEffect, useRef } from 'react';
import camcatImage from '../../img/camcat2.png';
import OpenViduVideoComponent from './OvVideo';
import { loadModels, faceMyDetect, stopFace } from '../job/Psychologist';
import styled from 'styled-components';
import { useGameContext } from '../../GameContext';

const Box = styled.div
  `
  position: absolute;
  border: 2px solid red;
`;


const CamCat = ({id}) => {
  const { players } = useRoomContext();
  const [running, setRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [boxPosition, setBoxPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const {psyTarget} = useGameContext();
  const player = players.get(id);
  const stream = player.stream;

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    loadModels();
    startFaceDetection();
  }, [psyTarget]);

  //faceapi 실행
  //심리학자 여기가 아니라 camarray 있는 곳에서 받아서 해야함
  const startFaceDetection = () => {
    if(player.playerId===psyTarget){
      const id = faceMyDetect(stream.videos[1].video, setBoxPosition, running, setRunning);
      setIntervalId(id);
    }
  };
  //끄는거 
  const stopFaceDetection = () => {
    stopFace(intervalId, setRunning, setBoxPosition);
  };

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'visible', // 변경: streamcomponent 영역을 벗어난 부분도 보이게 함
        display: 'flex',
        justifyContent: 'center',
        backgroundRepeat: 'no-repeat',
        flexDirection: 'column',
        alignItems: 'center',
        width: '90%',
        height: '100%',
      }}
    >

      <div className="streamcomponent" style={{ flex: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderStyle : 'solid', borderRadius : '10%', borderWidth : '0.7em', borderColor : '#343434', backgroundColor:'white',}}>
        <div style={{ flex: 0.6 }}>
          <OpenViduVideoComponent streamManager={stream} />
        </div>
        {/* cam on/off했을 때 귀 너비 수정해야 함 (어차피 sunset도 해야하니까...) */}
        <img
          src={camcatImage}
          alt="CamCat"
          style={{
            position: 'absolute',
            top: '-12%',
            left: '-1.0%',
            width: '101.5%',
            height: '34%',
            overflow: 'visible',
          }}
        />
      </div>

    </div>
  )
}

export default CamCat;
