import React, { useState, useEffect } from 'react';
import camcatImage from '../../img/camcat2.png';
import OpenViduVideoComponent from './OvVideo';
import { loadModels, faceMyDetect, stopFace } from '../job/Psychologist';
import styled from 'styled-components';
import { useGameContext } from '../../GameContext';
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
  const { psyTarget, psychologist, voteSituation, phase } = useGameContext();
  const player = players.current.get(id);
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

  const getVoteResultForUser = (id) => {
    let player = players.current.get(id);
    if (phase === 'day') {
      if (voteSituation && voteSituation[id] !== undefined) {
        return `X  ${voteSituation[id]}`;
      }
      return `X 0`;

    }
    else if (phase === 'night'){
      console.log(player.role, "직업");
        if (voteSituation && voteSituation[id]) {
          return `삵이 죽일 사람`;
      }
    }
  }
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
              top: '-15%',
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
              }}
            />
          </div>
          <div style={{ flex: 0.6 }}>
            <OpenViduVideoComponent streamManager={stream} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', margin: '3px' }}>
            <div style={{ flex: 1, textAlign: 'right' }}>
              {player.nickName}
            </div>
            <div style={{ flex: 0.8, textAlign: 'center' }}>
              {getVoteResultForUser(player.playerId)}
            </div>
          </div>
        </div>
      </div>
  );
}

export default CamCat;
