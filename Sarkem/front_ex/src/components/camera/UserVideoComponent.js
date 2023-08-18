import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';
import Tempcat from '../../img/tempcat.png';

const containerStyle = {
  position: 'relative', // Set container to relative position
  height: '100%',
};

const videoContainerStyle = {
  position: 'absolute', // Set video container to absolute position
  top: '20%', // Place the video container 20% from the top of the container
  left: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const nicknameStyle = {
  position: 'absolute', // Set nickname to absolute position
  bottom: 0,
  left: 0,
  right: 0,
  height: '20%', // Set nickname height to 20%
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default class UserVideoComponent extends Component {
  getNicknameTag() {
    // Gets the nickName of the user
    return JSON.parse(this.props.streamManager.stream.connection.data).nickName;
  }
  render() {
    return (
      <div style={containerStyle}>
        {this.props.streamManager !== undefined ? (
          <div style={videoContainerStyle}>
            <OpenViduVideoComponent streamManager={this.props.streamManager} />
          </div>
        ) : 
          (
            <div style={videoContainerStyle}>
            <img src={TempcatImage} alt="Tempcat" />
          </div>
          )
        
        }
        <div style={nicknameStyle}>
          <p>{this.getNicknameTag()}</p>
        </div>
      </div>
    );
  }
}