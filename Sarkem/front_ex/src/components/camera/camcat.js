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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${camcatImage})`,
        backgroundSize: '100% 100%', // Increase the background image size to 120% to make it larger
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      }}
    >
      {props.streamManager !== undefined} 
        <div className="streamcomponent">
          <OpenViduVideoComponent streamManager={props.props}/>
          <div>
           <p style={{ textAlign: 'center' }}>{JSON.parse(props.props.stream.connection.data).userData}</p>

          </div>
      </div>
      
    </div>

  );
};

export default CamCat;
