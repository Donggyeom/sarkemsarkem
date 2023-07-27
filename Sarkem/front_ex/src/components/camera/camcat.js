import React, { useState, useEffect, useRef } from 'react';
import camcatImage from '../../img/camcat.png';
import OpenViduVideoComponent from './OvVideo';

const CamCat = (props) => {
  // const nickName = JSON.parse(streamManager.stream.connection.data).userData;
  console.log(props.props);
  
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        backgroundImage: `url(${camcatImage})`,
        backgroundSize: '100% 100%', // Increase the background image size to 120% to make it larger
        backgroundRepeat: 'no-repeat',
        flexDirection : 'column',
        alignItems : 'center',
        backgroundPosition: 'center center',
      }}
    >
      {props.streamManager !== undefined} 
        <div className="streamcomponent" style ={{flex:0.7}}>
            <div style={{ flex: 0.4, display: 'flex', paddingTop: '25%', justifyContent: 'center' }}><OpenViduVideoComponent streamManager={props.props}/></div>

           <div style={{ flex: 0.3, textAlign: 'center' }}>{JSON.parse(props.props.stream.connection.data).userData}</div>

          
      </div>
      
    </div>

  );
};

export default CamCat;
