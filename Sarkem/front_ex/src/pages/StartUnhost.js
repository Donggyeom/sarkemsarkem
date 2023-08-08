import React from 'react';
import { useNavigate } from 'react-router-dom'; // React Router의 useNavigate를 import 합니다.
import CommonStart from './CommonStart';
import goImage from '../img/gobutton.png';
import '../index.css';

const StartUnHost = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/lobby');
  };

  return <CommonStart image={goImage} onClick={handleButtonClick} />;
};



export default StartUnHost;