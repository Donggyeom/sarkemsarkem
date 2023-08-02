import React, { useState, useEffect, useRef } from 'react';
import camcatImage from '../../img/camcat.png';
import OpenViduVideoComponent from './OvVideo';
import { loadModels, faceMyDetect, stopFace } from '../job/psychologist';
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

  const startFaceDetection = () => {
    const id = faceMyDetect(props.props.videos[1].video, setBoxPosition, running, setRunning);
    setIntervalId(id);
  };

  const stopFaceDetection = () => {
    stopFace(intervalId, setRunning, setBoxPosition);
  };

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        backgroundRepeat: 'no-repeat',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundPosition: 'center center',
      }}
    >
      {props.streamManager !== undefined}
      <div className="streamcomponent" style={{ flex: 0.2 }}>
        <div style={{ flex: 0.6, justifyContent: 'center' }}>
          <OpenViduVideoComponent streamManager={props.props} />
        
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

        <div style={{ flex: 0.4, textAlign: 'center' }}>{JSON.parse(props.props.stream.connection.data).userData}</div>
        <button onClick={startFaceDetection}>심리학자 시작</button>
        <button onClick={stopFaceDetection}>심리학자 종료</button>

      </div>

    </div>

  );
};

export default CamCat;
