import React, { memo, useState, useEffect, useRef } from 'react';
import camcatImage from '../../img/camcat2.png';
import OpenViduVideoComponent from './OvVideo';
import { loadModels, faceMyDetect, stopFace } from '../job/Psychologist';
import styled from 'styled-components';
import { useGameContext } from '../../GameContext';



const CamCat = (props) => {

  const [running, setRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const { psyTarget, psychologist } = useGameContext();
  // const nickName = JSON.parse(streamManager.stream.connection.data).userData;
  // console.log(props.props.videos[1].video);
  useEffect(() => {
    loadModels();
    if (psychologist) {
      startFaceDetection();
    } else {
      stopFaceDetection();
    }
  }, [psychologist]);
  // console.log(JSON.parse(props.props.stream.connection.data).token);
  //faceapi 실행
  //심리학자 여기가 아니라 camarray 있는 곳에서 받아서 해야함
  const startFaceDetection = () => {
    if (JSON.parse(props.props.stream.connection.data).token === psyTarget) {
      const id = faceMyDetect(props.props.videos[1].video, running, setRunning);
      setIntervalId(id);
    }
  };
  //끄는거 
  const stopFaceDetection = () => {
    clearInterval(intervalId);
    setRunning(false);
    stopFace(intervalId, setIntervalId, setRunning);
  };

return (
<div
  style={{
    position: 'relative',
    overflow: 'visible',
    display: 'flex',
    justifyContent: 'center',
    backgroundRepeat: 'no-repeat',
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
    height: '100%',
  }}
>
  <div
    className="streamcomponent"
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: 'solid',
      borderRadius: '10%',
      borderWidth: '0.7em',
      borderColor: '#343434',
      backgroundColor: 'white',
      position: 'relative',
    }}
  >
    {/* 이미지 위치 변경 */}
    <div
      style={{
        flex: 0.34,
        position: 'absolute',
        top: '-15%', // 이미지를 OpenVidu 위쪽으로 이동
        left: '-3%',
        width: '106%',
        height: '34%',
        overflow: 'visible',
        display: 'flex',
        justifyContent: 'center',
        zIndex : '1',
      }}
    >
      <img
        src={camcatImage}
        alt="CamCat"
        style={{
          width: '100%',
          height: '100%',
          // objectFit: 'contain', // 이미지 비율 유지
        }}
      />
    </div>
    <div style={{ flex: 0.6 }}>
      <OpenViduVideoComponent streamManager={props.props} />
    </div>
    <div style={{ flex: 0.4, textAlign: 'center', width: '100%', margin:'3px' }}>
      {JSON.parse(props.props.stream.connection.data).nickname}
    </div>
  </div>
</div>
);
      }

export default CamCat;
