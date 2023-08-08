import React, { memo, useState, useEffect, useRef } from 'react';
import camcatImage from '../../img/camcat2.png';
import OpenViduVideoComponent from './OvVideo';
import { loadModels, faceMyDetect, stopFace } from '../job/Psychologist';
import styled from 'styled-components';

const Box = styled.div
  `
  position: absolute;
  border: 2px solid red;
`;


const CamCat = (props) => {

  const [running, setRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [boxPosition, setBoxPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // const nickName = JSON.parse(streamManager.stream.connection.data).userData;
  // console.log(props.props.videos[1].video);
  useEffect(() => {
    loadModels();
  }, []);

  //faceapi 실행
  //심리학자 여기가 아니라 camarray 있는 곳에서 받아서 해야함
  const startFaceDetection = () => {
    const id = faceMyDetect(props.props.videos[1].video, setBoxPosition, running, setRunning);
    console.log(props.props.videos);
    setIntervalId(id);
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
        width: '100%',
        height: '100%',
      }}
    >

      <div className="streamcomponent" style={{ flex: 'auto' }}>
        <div style={{ flex: 0.6, justifyContent: 'center' }}>

          <OpenViduVideoComponent streamManager={props.props} />
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
          {JSON.parse(props.props.stream.connection.data).nickname}
        </div>
        {/* <button onClick={startFaceDetection}>심리학자 시작</button>
        <button onClick={stopFaceDetection}>심리학자 종료</button> */}
      </div>
    </div>
  );
};

export default CamCat;
