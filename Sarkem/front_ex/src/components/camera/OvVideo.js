import React, { Component } from 'react';

export default class OpenViduVideoComponent extends Component {

    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
    }
    
    componentDidUpdate(props) {
        if (props && !!this.videoRef) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    componentDidMount() {
        if (this.props && !!this.videoRef) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    render() {
        return <video autoPlay={true} ref={this.videoRef} style={{transform: 'scaleX(-1)', width : '100%', borderRadius : '10%'}} />;
    }

}

// 아래 코드처럼 했는데... iscamon이 전체 어레이라서 여기에서 하면 안되고 publisher의 cam만 off할수있도록 해야함... 근데 ㄹㅇ array진짜열받네......
// !! openvidu에서 지원하지 않는 기능!!!!!!!!!!!!!!!!!!!!!!!! 그냥 그 위에 css 추가해서 이미지 보이게 하는 수밖에 없음!!!!!!!!!!!!!!
// import React, { useEffect, useRef } from 'react';
// import { useRoomContext } from '../../Context';
// import Tempcat from '../../img/tempcat.png';

// const OpenViduVideoComponent = ({ streamManager }) => {
//     const videoRef = useRef();
//     const { isCamOn } = useRoomContext();

//     // 화면 초기화 시에만 addVideoElement를 호출s
//     useEffect(() => {
//         if (isCamOn && streamManager && videoRef.current) {
//             streamManager.addVideoElement(videoRef.current);
//         }
//     }, [isCamOn, streamManager]);

//     // isCamOn이 변경될 때 화면을 갱신
//     useEffect(() => {
//         if (videoRef.current) {
//             if (isCamOn && streamManager) {
//                 streamManager.addVideoElement(videoRef.current);
//                 videoRef.current.style.display = 'block'; // 카메라 켜질 때 화면 보이게 함
//             } else {
//                 videoRef.current.style.display = 'none'; // 카메라 꺼질 때 이미지 보이게 함
//             }
//         }
//     }, [isCamOn, streamManager]);

//     return (
//         <div>
//             {isCamOn ? (
//                 <video autoPlay ref={videoRef} style={{ transform: 'scaleX(-1)', width: '93%', top: '30%', borderRadius: '10%' }} />
//             ) : (
//                 <img src={Tempcat} alt="Tempcat Image" style={{ transform: 'scaleX(-1)', width: '93%', top: '30%', borderRadius: '10%' }} />
//             )}
//         </div>
//     );
// };

// export default OpenViduVideoComponent;