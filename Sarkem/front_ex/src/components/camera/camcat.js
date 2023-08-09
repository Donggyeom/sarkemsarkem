import React, { memo, useState, useEffect, useRef } from 'react';
import camcatImage from '../../img/camcat2.png';
import OpenViduVideoComponent from './OvVideo';
import { loadModels, faceMyDetect, stopFace } from '../job/Psychologist';
import styled from 'styled-components';
import { useGameContext } from '../../GameContext';



const CamCat = (props) => {

  const [running, setRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const {psyTarget} = useGameContext();
  // const nickName = JSON.parse(streamManager.stream.connection.data).userData;
  // console.log(props.props.videos[1].video);
  useEffect(() => {
    loadModels();
    console.log(psyTarget==="");
    if(psyTarget===""){
      stopFaceDetection();
    }else{
    startFaceDetection();
    }
  }, [psyTarget]);
  // console.log(JSON.parse(props.props.stream.connection.data).token);
  //faceapi 실행
  //심리학자 여기가 아니라 camarray 있는 곳에서 받아서 해야함
  const startFaceDetection = () => {
    if(JSON.parse(props.props.stream.connection.data).token===psyTarget){
      const id = faceMyDetect(props.props.videos[1].video, running, setRunning);
      setIntervalId(id);
    }
  };
  //끄는거 
  const stopFaceDetection = () => {
    clearInterval(intervalId);
    setRunning(false);
    stopFace(intervalId, setRunning);
  };


//   return (
//     <div
//       style={{
//         position: 'relative',
//         overflow: 'visible', // 변경: streamcomponent 영역을 벗어난 부분도 보이게 함
//         display: 'flex',
//         justifyContent: 'center',
//         backgroundRepeat: 'no-repeat',
//         flexDirection: 'column',
//         alignItems: 'center',
//         width: '100%',
//         height: '100%',
//       }}
//     >

//       <div className="streamcomponent" style={{ flex: 'auto' }}>
//         <div style={{ flex: 0.6, justifyContent: 'center' }}>
//           <OpenViduVideoComponent streamManager={props.props} />
//           {/* cam on/off했을 때 귀 너비 수정해야 함 (어차피 sunset도 해야하니까...) */}
//           <img
//             src={camcatImage}
//             alt="CamCat"
//             style={{
//               position: 'absolute',
//               top: '-15%',
//               left: '-1.5%',
//               width: '96%',
//               height: '40%',
//               overflow: 'visible',
//             }}
//           />
//           {/* {running && (
//           )} */}
//         </div>

//         <div style={{ flex: 0.4, textAlign: 'center', width: '95%' }}>
//           {JSON.parse(props.props.stream.connection.data).nickname}
//         </div>
//         {/* <button onClick={startFaceDetection}>심리학자 시작</button>
//         <button onClick={stopFaceDetection}>심리학자 종료</button> */}
//       </div>
//     </div>
//   );
// };

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
        <OpenViduVideoComponent streamManager={props.props} />
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
      <div style={{ flex: 0.4, textAlign: 'center', width: '100%', }}>
        {JSON.parse(props.props.stream.connection.data).nickname}
      </div>
    </div>
  </div>
);
      }

export default CamCat;
