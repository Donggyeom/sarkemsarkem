import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import CamCat from './camcat';
import voteImage from '../../img/votefoot.png';
import { useGameContext } from '../../GameContext';
import { Publisher, Subscriber } from 'openvidu-browser';
import Jungle from '../job/Detective';
import { useRoomContext } from '../../Context';

const Votefoot = styled.img`
  position: absolute;
  transform: translateX(-50%);
`;

const CamCatGrid = styled.div`
    position : absolute;
    display: grid;
    align-items: center;
    justify-items: center;
    ${({ style }) =>
    style && `
      width: ${style.width};
      height : ${style.height};
      max-height: ${style.maxHeight};
      left : ${style.left};

  `}
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  color: white;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;

`;

const VotefootWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${({ show }) => (show ? 'block' : 'none')};
`;

const VotefootImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const calculateGrid = (camCount) => {
  const positions = [
  ];
  if (camCount === 1) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr',
      height: '100%',
      width: '100%',
    };
  } else if (camCount === 2) {
    return {
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr 1fr',
      width: '90%',
    };
  } else if (camCount === 3) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      width: '60%',
    };
  } else if (camCount === 4) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      width: '60%',
    };
  } else if (camCount === 5) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      width: '75%',
    };
  } else if (camCount === 6) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      top: '7.5%',
      width: '80%',
    };
  } else if (camCount === 7) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: 'repeat(4, 1fr)',
      width: '90%',
    };
  } else if (camCount === 8) {
    return {
      gridTemplateRows: 'repeat(2, 1fr)',
      gridTemplateColumns: 'repeat(4, 1fr)',
      width: '85%',
    };
  } else if (camCount === 9) {
    return {
      gridTemplateRows: 'repeat(2, 1fr)',
      gridTemplateColumns: 'repeat(5, 1fr)',
      width: '95%',
      height: '70%',
    };
  } else if (camCount === 10) {
    return {
      gridTemplateRows: 'repeat(2, 1fr)',
      gridTemplateColumns: 'repeat(5, 1fr)',
      left: '5%',
      width: '90%',
      height: '70%',
    };
  } else {
    // Add more cases as needed
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
    };
  }
};

const CamCatWrapper = styled.div`
  position : relative;
  ${({ camCount, index }) =>

    camCount === 3 && index === 0
      ? `
    position: relative;
    left : 50%;
  `
      :
      camCount === 3 && index === 1
        ? `
    position: relative;
    top : 100%;
  `
        :
        camCount === 3 && index === 2
          ? `
    position: relative;
  `
          :
          camCount === 5 && index === 0
            ? `
    position: relative;
    left : 50%;
  `
            :
            camCount === 5 && index === 1
              ? `
    position: relative;
    left : 50%;
  `
              :
              camCount === 5 && index === 2
                ? `
    position: relative;
    top : 100%;
  `
                :
                camCount === 7 && index === 0
                  ? `
    position: relative;
    left : 50%;
  `
                  :
                  camCount === 7 && index === 1
                    ? `
    position: relative;
    left : 50%;
  `
                    :
                    camCount === 7 && index === 2
                      ? `
    position: relative;
    left : 50%;
  `

                      :
                      camCount === 7 && index === 3
                        ? `
    position: relative;
    top : 100%;
  `
                        :
                        camCount === 9 && index === 0
                          ? `
    position: relative;
    left : 50%;
  `
                          :
                          camCount === 9 && index === 1
                            ? `
    position: relative;
    left : 50%;
  `
                            :
                            camCount === 9 && index === 2
                              ? `
    position: relative;
    left : 50%;
  `
                              :
                              camCount === 9 && index === 3
                                ? `
    position: relative;
    left : 50%;
  `
                                :
                                camCount === 9 && index === 4
                                  ? `
    position: relative;
    top : 100%;
  `
                                  : ''};
  `;
     
const DayNightCamera = React.memo(({ ids }) => {
  const camCount = ids.length;
  const gridStyles = calculateGrid(camCount);
  const [clickedCameras, setClickedCameras] = useState([]);

  const [clickedCamera, setClickedCamera] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const { player, players } = useRoomContext();
  const { selectAction, selectConfirm, setSelectedTarget, 
    myVote, startVote, dayCount, predictWebcam, stopPredicting, 
    detectedGesture, voteSituation, phase,
    Roles } = useGameContext();

  useEffect(() => {
    setIsConfirmed(false);
    setClickedCamera(null);
    setIsSkipped(false);
    console.log(phase);

    if (phase === "night") {
      // 모두의 카메라, 마이크 설정
      nightCamAudio();

      // 마피아 넣는 작업
      let sarkArray = [];
      for (let player of players) {
        if (player.role === Roles.SARK) sarkArray.push(player);
      }

      if (player.role === Roles.DETECTIVE) {
        changeVoice(sarkArray);
      }
    } 
    else if (phase === "day") {
      dayCamAudio();
      stopVoiceChange();
    }

  }, [startVote, phase]);

  const getVoteResultForUser = (id) => {
    let player = players.get(id);
    if (voteSituation && voteSituation[id] !== undefined) {
      return `${player.nickName}: ${voteSituation[id]}표`;
    }
    return `${player.nickName}: 0표`;
  };

  const handleCamClick = (id) => {
    console.log(voteSituation, "투표 결과 확인합니다");
    console.log(id, "얘는 캠주인");
    if (!startVote || dayCount === 0 || isConfirmed || isSkipped) {
      return;
    }

    if (clickedCamera === id) {
      setClickedCamera(null);
    } else {
      selectAction({ playerId: id });
      setClickedCamera(id);
    }
  };

  const handleConfirmClick = () => {
    if (clickedCamera && !isConfirmed) {
      setIsConfirmed(true);
      selectConfirm();
    }
  };

  const handleSkipClick = () => {
    if (!isConfirmed && !isSkipped && startVote) {
      setIsSkipped(true);
      setClickedCamera(null);
      setSelectedTarget("");
      selectAction({ playerId: null });
      selectConfirm();
    }
  };

  const startHiddenMission = () => {
    predictWebcam();
  }
  const stopHiddenMission = () => {
    stopPredicting();
  }

  const nightCamAudio = () => {
    if (player.role == Roles.SARK || player.role == Roles.OBSERVER) {
      for (let player of players) {
        if (player.role != Roles.SARK) {
          player.stream.subscribeToVideo(false);
          player.stream.subscribeToAudio(false);
        }
      }
    }
    else if (player.role == Roles.DETECTIVE) {
      // 탐정 플레이어 화면에서 모두의 캠을 끄고, 마피아를 제외한 생존자의 마이크를 끈다.
      for (let player of players) {
        player.stream.subscribeToVideo(false);

        if (player.role != Roles.SARK) {
          player.stream.subscribeToAudio(false);
        }
      }
    }
    else {
      // 마피아, 탐정, 관전자를 제외한 나머지 플레이어의 화면에서 모두의 캠, 오디오를 끈다.
      player.stream.subscribeToVideo(false);
      player.stream.subscribeToAudio(false);
    } 
  }


  const dayCamAudio = () => {
    for (let otherPlayer of players) {
      if (player.playerId == otherPlayer.playerId) continue;  // 내가 아닌 경우에만 설정
      if (otherPlayer.role == Roles.OBSERVER) continue;            // 관전자가 아닌 경우에만 설정

      otherPlayer.stream.subscribeToVideo(true);
      otherPlayer.stream.subscribeToAudio(true);
    }
  }

  //찐시작
  const changeVoice = (sarkArray) => {
    mixedMediaStreamRef.current = getMixedMediaStream(sarkArray);
  }

  const mixedMediaStreamRef = useRef(null);
  const jungleRefs = useRef([]);
  const audioContext = useRef(new (window.AudioContext || window.webkitAudioContext)()).current;

  // 삵들에 대해 음성변조 시작
  const getMixedMediaStream = (sarkArray) => {
    console.log("음성 변조 시작...")
    const mixedMediaStream = new MediaStream();
    sarkArray.forEach((sark) => {
      const mediaStream = sark.stream.stream.mediaStream;

      const audioTrack = mediaStream.getAudioTracks()[0];
      const source = audioContext.createMediaStreamSource(new MediaStream([audioTrack]));
      const jungle = new Jungle(audioContext);
      // const randomPitch = Math.random() < 0.5 ? -1 : 1;
      jungle.setPitchOffset(1);
      source.connect(jungle.input);
      jungle.output.connect(audioContext.destination);
      const audioTrackWithEffects = audioContext.createMediaStreamDestination();
      jungle.output.connect(audioTrackWithEffects);
      mixedMediaStream.addTrack(audioTrackWithEffects.stream.getAudioTracks()[0]);
      jungle.isConnected = true;
      jungleRefs.current.push(jungle);
    });
  }

  // 음성 변조 중지
  const stopVoiceChange = () => {
    console.log("음성 변조 중지");
    jungleRefs.current.forEach((jungle) => {
      if (jungle && jungle.isConnected) {
        console.log(jungle, "음성 변조 중지 중...");
        jungle.output.disconnect(audioContext.destination);
        jungle.isConnected = false;
      }
    });
    jungleRefs.current = [];
    mixedMediaStreamRef.current = null;
  };


  return (
    <CamCatGrid style={gridStyles}>
      {ids && ids.map((id, index) => (
        <CamCatWrapper
          key={index}
          camCount={camCount}
          user={id}
          index={index}
          onClick={() => handleCamClick(id)}
        >
          <CamCat id={id} />
          {/* {clickedCameras.includes(index) && (
              <Votefoot src={voteImage} alt="Vote" />
            )} */}
          <VotefootWrapper show={clickedCamera === id && startVote}>
            <VotefootImage src={voteImage} alt="Vote" />
          </VotefootWrapper>
          <div>{getVoteResultForUser(id)}</div>
        </CamCatWrapper>
      ))}
      <ButtonWrapper>
        {dayCount === 1 ? (
          <>
            {startVote && (
              <ActionButton onClick={handleSkipClick} disabled={isConfirmed || isSkipped}>
                {isSkipped ? '스킵됨' : '스킵하기'}
              </ActionButton>
            )}
          </>
        ) : (
          <>
            {isConfirmed ? (
              <ActionButton disabled>확정됨</ActionButton>
            ) : (
              startVote && (
                <ActionButton onClick={handleConfirmClick} disabled={!clickedCamera || isSkipped}>
                  {clickedCamera ? '확정하기' : '투표할 사람을 선택하세요'}
                </ActionButton>
              )
            )}
            {startVote && (
              <ActionButton onClick={handleSkipClick} disabled={isConfirmed || isSkipped}>
                {isSkipped ? '스킵됨' : '스킵하기'}
              </ActionButton>
            )}
          </>
        )}
        <ActionButton onClick={startHiddenMission}>
          히든미션
        </ActionButton>
        <ActionButton onClick={stopHiddenMission}>
          미션 종료
        </ActionButton>
        <p>Detected Gesture: {detectedGesture}</p>
      </ButtonWrapper>
    </CamCatGrid>
  );
});

export default DayNightCamera;
