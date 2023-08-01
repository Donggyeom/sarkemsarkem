import React, { useState, useEffect, useRef } from 'react';
import camcatImage from '../../img/camcat.png';
import OpenViduVideoComponent from './OvVideo';
import { loadModels, faceMyDetect, stopFace } from '../job/psychologist';

const CamCat = (props) => {
  const [running, setRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  // const nickName = JSON.parse(streamManager.stream.connection.data).userData;
  console.log(props.props.videos[1].video);
  useEffect(() => {
    loadModels();
  }, []);

  const startFaceDetection = () => {
    const id = faceMyDetect(props.props.videos[1].video, running, setRunning);
    setIntervalId(id);
  };

  const stopFaceDetection = () => {
    stopFace(intervalId, setRunning);
  };

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        backgroundRepeat: 'no-repeat',
        flexDirection : 'column',
        alignItems : 'center',
        backgroundPosition: 'center center',
      }}
    >
      {props.streamManager !== undefined} 
        <div className="streamcomponent" style ={{flex:0.2}}>
            <div style={{ flex: 0.6, justifyContent: 'center' }}><OpenViduVideoComponent streamManager={props.props}/></div>

           <div style={{ flex: 0.4, textAlign: 'center' }}>{JSON.parse(props.props.stream.connection.data).userData}</div>
          <button onClick={startFaceDetection}>심리학자 시작</button>
          <button onClick={stopFaceDetection}>심리학자 종료</button>
          
      </div>
      
    </div>

  );
};

export default CamCat;
