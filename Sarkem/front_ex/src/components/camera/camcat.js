import React, { memo, useState, useEffect, useRef } from 'react';
import camcatImage from '../../img/camcat2.png';
import OpenViduVideoComponent from './OvVideo';

const CamCat = (props) => {
  console.log(props.props);

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
      {/* 이미지를 위치시킬 div */}
      {/* <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-1%',
          width: '96%',
          height: '40%',
          zIndex: 1,
          overflow: 'visible', 
        }}
      >
        <img src={camcatImage} alt="CamCat" style={{ width: '100%', height: '100%' }} />
      </div> */}

      <div className="streamcomponent" style={{ flex: 0.2 }}>
        <div style={{ flex: 0.6, justifyContent: 'center' }}>
          <img
            src={camcatImage}
            alt="CamCat"
            style={{
              position: 'absolute',
              top: '-15%',
              left: '-1%',
              width: '96%',
              height: '40%',
              zIndex: 1,
              overflow: 'visible', 
            }}
          />
          <OpenViduVideoComponent streamManager={props.props} />
        </div>

        <div style={{ flex: 0.4, textAlign: 'center' }}>
          {JSON.parse(props.props.stream.connection.data).userData}
        </div>
      </div>
    </div>
  );
};

export default CamCat;
