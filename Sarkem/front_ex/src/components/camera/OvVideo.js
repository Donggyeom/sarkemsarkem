import React, { Component } from 'react';

export default class OpenViduVideoComponent extends Component {

    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
    }
    
    componentDidUpdate(props) {
        if (this.props?.streamManager && !!this.videoRef) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    componentDidMount() {
        if (this.props?.streamManager && !!this.videoRef) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    render() {
        return <video autoPlay={true} ref={this.videoRef} muted={this.props.isMuted} style={{transform: 'scaleX(-1)', width : '100%', borderRadius : '10% 10% 1.5% 1.5%'}} />;
    }

}
