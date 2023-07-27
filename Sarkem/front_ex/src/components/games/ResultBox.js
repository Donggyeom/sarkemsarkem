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
  width: 1100px;
  height: 650px;
  position: relative;
  box-shadow: 0px 5.16px 5.16px 0px rgba(0, 0, 0, 0.25),
    10.31px 10.31px 0px 0px rgba(0, 0, 0, 1);
  
  top: 65px;
  left: 200px;
`;

const BigSepStyle = styled.svg`
  padding: 20.62px 0px 20.62px 0px;
  align-self: stretch;
  flex-shrink: 0;
  position: relative;
  overflow: visible;
`;

const ResultBox = ({ ...props }) => {
  const resultBoxWidth = 1320; // ResultBoxStyle의 너비

  // path 시작점을 왼쪽으로 15px만큼 이동, 우측 끝점을 너비에 맞춰서 조정
  const pathStartX = -65;
  const pathEndX = resultBoxWidth - 290;

  return (
    <ResultBoxStyle {...props}>
      <BigSepStyle
        width={resultBoxWidth}
        height="104"
        viewBox={`0 0 ${resultBoxWidth} 104`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={`M${pathStartX} 40.334H${pathEndX}`} stroke="black" strokeWidth="5.15599" />
      </BigSepStyle>
    </ResultBoxStyle>
  );
};

export default ResultBox;
