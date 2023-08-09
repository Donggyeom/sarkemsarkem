import React from 'react';
import styled from 'styled-components';

const ResultBoxStyle = styled.div`
  box-sizing: border-box;
  background: #f3b7bf;
  border-radius: 30.94px;
  border-style: solid;
  border-color: #000000;
  border-width: 5.16px;
  padding: 61.87px;
  display: flex;
  flex-direction: column;
  gap: 12.89px;
  align-items: flex-start;
  justify-content: flex-start;
  width: 76%;
  height: 85%;
  position: relative;
  box-shadow: 0px 5.16px 5.16px 0px rgba(0, 0, 0, 0.25),
    10.31px 10.31px 0px 0px rgba(0, 0, 0, 1);
  
  top: 1%;
  left: 10%;
`;

const BigSepStyle = styled.svg`
  padding: 2% 0; /* Adjust padding using relative units */
  align-self: stretch;
  flex-shrink: 0;
  position: relative;
  overflow: visible;
`;

const ResultBox = ({ ...props }) => {
  const resultBoxWidth = 76; // Percentage width of ResultBoxStyle

  // Calculate the path coordinates based on the percentage width
  const pathStartX = (resultBoxWidth / 100) * -15;
  const pathEndX = (resultBoxWidth / 100) * 50; // Adjust the value as needed

  return (
    <ResultBoxStyle {...props}>
      <BigSepStyle
        width={`${resultBoxWidth}%`}
        height="104"
        viewBox={`0 0 100 104`} /* Use a fixed viewBox width */
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={`M${pathStartX} 40.334H${pathEndX}`}
          stroke="black"
          strokeWidth="5.15599"
        />
      </BigSepStyle>
    </ResultBoxStyle>
  );
};

export default ResultBox;