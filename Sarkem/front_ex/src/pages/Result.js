import React from 'react';
import styled from 'styled-components';
import Background from '../components/backgrounds/BackgroundSunset';

const StyledSunsetPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative; /* position을 relative로 설정합니다. */
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const Result = () => {
    return ( 
			<Background>


				<StyledSunsetPage>
					<div>결과창</div>

				</StyledSunsetPage>
			</Background>
			
    );

}

export default Result;