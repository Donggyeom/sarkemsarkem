import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import CamCat from './camcat';
import voteImage from '../../img/votefoot.png';
import { useGameContext } from '../../GameContext';
import { useRoomContext } from '../../Context';
import { Publisher, Subscriber } from 'openvidu-browser';
import Jungle from '../job/Detective';




const Votefoot = styled.img`
  position: absolute;
  transform: translateX(-50%);
`;

const CamCatGrid = styled.div`
    // overflow : hidden;
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
      width: '59%',
      gridRowGap : '5%',
      gridColumnGap : '5%'
    };
  } else if (camCount === 4) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      width: '55%',
      gridRowGap : '5%',
      gridColumnGap : '5%',
    };
  } else if (camCount === 5) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      width: '75%',
      gridRowGap : '7%',

    };
  } else if (camCount === 6) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      top: '7.5%',
      width: '80%',
      gridRowGap : '3%',
      bottom : '1%',
    };
  } else if (camCount === 7) {
    return {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: 'repeat(4, 1fr)',
      width: '90%',
      gridRowGap : '7%',
    };
  } else if (camCount === 8) {
    return {
      gridTemplateRows: 'repeat(2, 1fr)',
      gridTemplateColumns: 'repeat(4, 1fr)',
      width: '85%',
      gridRowGap : '3%',
      bottom : '1%',
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
      gridRowGap : '3%',
      bottom : '1%',
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
    left : 56.5%;
    `
    :
    camCount === 3 && index === 1
    ? `
    position: relative;
    top : 110%;
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
    top : 114%;
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
    top : 114%;
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
const DayNightCamera = React.memo(({ camArray }) => {
  const camCount = camArray.length;
  const gridStyles = calculateGrid(camCount);
  const [clickedCamera, setClickedCamera] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const { publisher } = useRoomContext();
  const { selectAction, selectConfirm, setSelectedTarget, myVote, startVote, dayCount, predictWebcam, stopPredicting, detectedGesture, voteSituation, playersRoles, myRole, phase, mafias, setMafias, jungleRefs, mixedMediaStreamRef, audioContext, voteTargetId, deadIds, hiddenMission, setHiddenMission } = useGameContext();
  // const jungleRefs = useRef([]);

  useEffect(() => {
    setIsConfirmed(false);
    setClickedCamera(null);
    setIsSkipped(false);
    console.log(phase);

    if (phase === "night") {
      nightCamAudio();
      if (myRole === "DETECTIVE") {
        console.log(mafias);
        changeVoice();
      }
    } else if (phase === "day") {
      console.log(jungleRefs);
      dayCamAudio();
      stopVoiceChange();
      if (myRole === "OBSERVER" && publisher) {
        publisher.publishVideo(false);
        publisher.publishAudio(false);
      }
    }
  }, [startVote, phase]);


  // const getVoteResultForUser = (userToken) => {
  //   if (voteSituation && voteSituation[userToken] !== undefined) {
  //     return `${userToken}: ${voteSituation[userToken]}, 미확정표`;
  //   }
  //   return `${userToken}: 0표`;
  // };

  const getVoteResultForUser = (userToken, phase) => {
    if (phase === "day") {
      if (voteSituation && voteSituation[userToken] !== undefined) {
        return `${userToken}: ${voteSituation[userToken]}, 미확정표`;
      }
      return `${userToken}: 0표`;

    } else if (phase === "night") {
      if (myRole === "SARK" || myRole === "OBSERVER") {
        if (voteSituation[userToken]) {
          return `${userToken}: 삵이 죽일 사람`;
        }
        return `${userToken}: 투표하지 않음`;
      }
      return ''; // sark나 observer가 아닌 경우
    }
    return ''; // day나 night가 아닌 경우
  };

  const calculateAdjustedCamCount = () => {
    const filteredCamArray = camArray.filter((user) => {
      const userToken = JSON.parse(user.stream.connection.data).token;
      return !deadIds.includes(userToken);
    });

    let adjustedCamCount = filteredCamArray.length;

    filteredCamArray.forEach((user) => {
      const userToken = JSON.parse(user.stream.connection.data).token;

      if (deadIds.includes(userToken)) {
        adjustedCamCount -= 1;
      }
    });

    return adjustedCamCount;
  };

  const adjustedCamCount = calculateAdjustedCamCount();

  const handleCamClick = (user) => {
    console.log(voteSituation, "투표 결과 확인합니다");
    console.log(startVote);
    console.log(dayCount);
    console.log(JSON.parse(user.stream.connection.data).token, "얘는 캠주인");
    if (!startVote || dayCount === 0 || isConfirmed || isSkipped) {
      return;
    }

    if (clickedCamera === user) {
      setClickedCamera(null);
      selectAction({ playerId: null });
    } else {
      selectAction({ playerId: JSON.parse(user.stream.connection.data).token });
      setClickedCamera(user);
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
  useEffect(() => {
    console.log("히든미션 바뀜", hiddenMission);
    if (hiddenMission) {
      console.log("미션시작이요~~");
      startHiddenMission();
    }else{
      stopHiddenMission();
    }
  }, [hiddenMission])
  const startHiddenMission = () => {
    predictWebcam();
  }
  const stopHiddenMission = () => {
    stopPredicting();
  }

  const nightCamAudio = () => {
    if (myRole === 'CITIZEN' || myRole === 'DOCTOR' || myRole === 'POLICE' || myRole === 'PSYCHO' || myRole === 'BULLY') {
      for (let i = 0; i < camCount; i++) {
        const sarks = Object.keys(playersRoles).filter(playerId => playersRoles[playerId] === "SARK");
        if (camArray[i] instanceof Subscriber && (sarks.includes(JSON.parse(camArray[i].stream.connection.data).token))) {
          camArray[i].subscribeToVideo(false);
          camArray[i].subscribeToAudio(false);
        }
      }
    } else if (myRole === 'DETECTIVE') {
      for (let i = 0; i < camCount; i++) {
        const sarks = Object.keys(playersRoles).filter(playerId => playersRoles[playerId] === "SARK");
        if (camArray[i] instanceof Subscriber && (sarks.includes(JSON.parse(camArray[i].stream.connection.data).token))) {
          camArray[i].subscribeToVideo(false);
        }
      }
    }
  }
  const dayCamAudio = () => {
    if (myRole === 'CITIZEN' || myRole === 'DOCTOR' || myRole === 'POLICE' || myRole === 'PSYCHO' || myRole === 'BULLY' || myRole === 'DETECTIVE') {
      for (let i = 0; i < camCount; i++) {
        console.log(camArray[i] instanceof Subscriber);
        if (camArray[i] instanceof Subscriber) {
          camArray[i].subscribeToVideo(true);
          camArray[i].subscribeToAudio(true);
        }
      }
    }
  }

  //찐시작
  const changeVoice = () => {
    console.log(mafias);
    mixedMediaStreamRef.current = getMixedMediaStream();
  }

  // const mixedMediaStreamRef = useRef(null);
  // const jungleRefs = useRef([]);
  // const audioContext = useRef(new (window.AudioContext || window.webkitAudioContext)()).current;

  // 삵들에 대해 음성변조 시작
  const getMixedMediaStream = () => {
    console.log("음성 변조 시작...")
    const mixedMediaStream = new MediaStream();
    mafias.forEach((mediaStream) => {
      const audioTrack = mediaStream.getAudioTracks()[0];
      const source = audioContext.createMediaStreamSource(new MediaStream([audioTrack]));
      const jungle = new Jungle(audioContext);
      const randomPitch = Math.random() < 0.5 ? -1 : 1;
      jungle.setPitchOffset(1);
      source.connect(jungle.input);
      jungle.output.connect(audioContext.destination);
      const audioTrackWithEffects = audioContext.createMediaStreamDestination();
      jungle.output.connect(audioTrackWithEffects);
      mixedMediaStream.addTrack(audioTrackWithEffects.stream.getAudioTracks()[0]);
      jungle.isConnected = true;
      jungleRefs.current.push(jungle);
      console.log(jungleRefs);
    })
  }

  // 음성 변조 중지
  const stopVoiceChange = () => {
    console.log("음성 변조 중지")
    console.log(jungleRefs);
    jungleRefs.current.forEach((jungle) => {
      if (jungle && jungle.isConnected) {
        console.log(jungle, "음성 변조 중지 중...");
        jungle.output.disconnect(audioContext.destination);
        jungle.isConnected = false;
      }
    });
    // setMafias([]);
    jungleRefs.current = [];
    mixedMediaStreamRef.current = null;
  };




  return (
    <CamCatGrid style={gridStyles}>
      {camArray
        .filter((user) => {
          const userToken = JSON.parse(user.stream.connection.data).token;
          return !deadIds.includes(userToken);
        })
        .map((user, index) => (
          <CamCatWrapper
            key={index}
            camCount={adjustedCamCount}
            user={user}
            index={index}
            onClick={() => handleCamClick(user)}
          >
            <CamCat props={user} user={user} />
            <VotefootWrapper show={clickedCamera === user && startVote}>
              <VotefootImage src={voteImage} alt="Vote" />
            </VotefootWrapper>
            <div>{getVoteResultForUser(JSON.parse(user.stream.connection.data).token, phase)}</div>
          </CamCatWrapper>
        ))}
      <ButtonWrapper>
        {dayCount === 1 && phase === "day" ? (
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
        {/* <ActionButton onClick={startHiddenMission}>
          히든미션
        </ActionButton>
        <ActionButton onClick={stopHiddenMission}>
          미션 종료
        </ActionButton> */}
        {/* <p>Detected Gesture: {detectedGesture}</p> */}
      </ButtonWrapper>
    </CamCatGrid>
  );
});

export default DayNightCamera;
