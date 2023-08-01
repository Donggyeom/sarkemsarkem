import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundSunset';
import NotFoundButton from '../components/games/NotFoundPopup';
import ReButton from '../components/buttons/reButton';
import { useNavigate } from 'react-router-dom';

const StyledSunsetPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const NotFound = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const fadeOutTimeout = setTimeout(() => {
      setShowPopup(false);
    }, 4000);

    return () => clearTimeout(fadeOutTimeout);
  }, []);

  const goToHome = () => {
    navigate('/');
  };

  return ( 
    <Background>
      <StyledSunsetPage>
        <NotFoundButton showPopup={showPopup} />
        {showPopup ? null : <ReButton alt="Go to Home" onClick={goToHome}>나가기</ReButton> }
      </StyledSunsetPage>  
    </Background>
  );
};

export default NotFound;
