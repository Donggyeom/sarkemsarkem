import React, { Component } from 'react';

export default class OpenViduVideoComponent extends Component {

    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
        console.log(this.props.streamManager);
    }
    
    componentDidUpdate(props) {
        console.log(this.props.streamManager);
        if (props && !!this.videoRef) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    componentDidMount() {
        console.log(this.props.streamManager);
        if (this.props && !!this.videoRef) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    render() {
        return <video autoPlay={true} ref={this.videoRef} style={{width : '93%', top : '30%', borderRadius : '10%'}} />;
    }

}
