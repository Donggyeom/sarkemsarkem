import React from 'react';
import { useNavigate } from 'react-router-dom'; // React Router의 useNavigate를 import 합니다.
import CommonStart from '../components/backgrounds/CommonStart';
import makeroomImage from '../img/makebutton.png';

const StartHost = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/lobby');
  };

  return <CommonStart image={makeroomImage} onClick={handleButtonClick} />;
};

export default StartHost;