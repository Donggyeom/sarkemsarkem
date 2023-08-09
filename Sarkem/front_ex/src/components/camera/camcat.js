import React, { memo, useState, useEffect, useRef } from 'react';
import camcatImage from '../../img/camcat2.png';
import OpenViduVideoComponent from './OvVideo';
import { loadModels, faceMyDetect, stopFace } from '../job/Psychologist';
import styled from 'styled-components';
import { useRoomContext } from '../../Context';

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
  const player = players.get(id);
  const stream = player.stream;

  console.log(`CamCat`);
  console.log(players);
  console.log(id);
  console.log(stream);
  
  useEffect(() => {
    loadModels();
  }, []);

  //faceapi 실행
  //심리학자 여기가 아니라 camarray 있는 곳에서 받아서 해야함
  const startFaceDetection = () => {
    // TODO: 변수명 id 수정 필요
    // const id = faceMyDetect(stream.videos[1].video, setBoxPosition, running, setRunning);
    // console.log(stream.videos);
    // setIntervalId(id);
  };
  //끄는거 
  const stopFaceDetection = () => {
    // stopFace(intervalId, setRunning, setBoxPosition);
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
        width: '100%',
        height: '100%',
      }}
    >

      <div className="streamcomponent" style={{ flex: 'auto' }}>
        <div style={{ flex: 0.6, justifyContent: 'center' }}>
          {/* {JSON.stringify(stream)}
          {console.log(typeof stream)} */}
          <OpenViduVideoComponent streamManager={stream} />
          {/* cam on/off했을 때 귀 너비 수정해야 함 (어차피 sunset도 해야하니까...) */}
          <img
            src={camcatImage}
            alt="CamCat"
            style={{
              position: 'absolute',
              top: '-15%',
              left: '-1.5%',
              width: '96%',
              height: '40%',
              overflow: 'visible',
            }}
          />
          {running && (
            <Box
              style={{
                left: boxPosition.x,
                top: boxPosition.y,
                width: boxPosition.width,
                height: boxPosition.height,
              }}
            />
          )}
        </div>

        <div style={{ flex: 0.4, textAlign: 'center', width: '95%' }}>
          {player.nickName}
        </div>
        {/* <button onClick={startFaceDetection}>심리학자 시작</button>
        <button onClick={stopFaceDetection}>심리학자 종료</button> */}
      </div>
    </div>
  );
};

export default CamCat;
