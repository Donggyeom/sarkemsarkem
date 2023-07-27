import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // React Router의 useNavigate를 import 합니다.
import CommonStart from './CommonStart';
import makeroomImage from '../img/makebutton.png';

const StartHost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.pathname.slice(1);
  const isHost = location.state.isHost;

  const [userName, setUserName] = useState('이름모를유저' + Math.floor(Math.random() * 100))
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const handleButtonClick = () => {
    navigate('/lobby');
  };

  return <CommonStart image={makeroomImage} onClick={handleButtonClick} />;
};

export default StartHost;