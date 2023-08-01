import React, { memo, useState, useEffect, useRef } from 'react';
import camcatImage from '../../img/camcat2.png';
import OpenViduVideoComponent from './OvVideo';

const CamCat = (props) => {
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

      <div className="streamcomponent" style={{ flex: 0.2 }}>
        <div style={{ flex: 0.6, justifyContent: 'center' }}>
          
          <OpenViduVideoComponent streamManager={props.props} />
          <img
            src={camcatImage}
            alt="CamCat"
            style={{
              position: 'absolute',
              top: '-15%',
              left: '-1%',
              width: '96%',
              height: '40%',
              overflow: 'visible', 
            }}
          />
        </div>

        <div style={{ flex: 0.4, textAlign: 'center', width: '95%' }}>
          {JSON.parse(props.props.stream.connection.data).userData}
        </div>
      </div>
    </div>
  );
};

export default CamCat;
