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

const LineStyle = styled.div`
  width: 112%; /* Set the desired width for your line */
  height: 5px; /* Set the desired height for your line */
  background-color: black; /* Color of the line */
  margin-left: -6%;
  margin-top: 5%;
`

const ResultBox = ({ ...props }) => {
  return (
    <ResultBoxStyle {...props}>
           <LineStyle></LineStyle>

    </ResultBoxStyle>
  );
};

export default ResultBox;