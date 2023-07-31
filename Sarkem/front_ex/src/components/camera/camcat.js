import React, { useState, useEffect, useRef } from 'react';
import camcatImage from '../../img/camcat.png';
import OpenViduVideoComponent from './OvVideo';

const CamCat = (props) => {
  // const nickName = JSON.parse(streamManager.stream.connection.data).userData;
  console.log(props.props);
  
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

          
      </div>
      
    </div>

  );
};

export default CamCat;
