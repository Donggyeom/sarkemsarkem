// import React from 'react';
// import styled from 'styled-components';
// import agreeButtonImage from '../../img/찬성.png';
// import disagreeButtonImage from '../../img/반대.png';

// const Button = styled.button`
//   background: none;
//   border: none;
//   cursor: pointer;
// `;

// const AgreeButton = ({ onClick, disabled }) => (
//   <Button onClick={onClick} disabled={disabled}>
//     <img src={agreeButtonImage} alt="찬성" />
//   </Button>
// );

// const DisagreeButton = ({ onClick, disabled }) => (
//   <Button onClick={onClick} disabled={disabled}>
//     <img src={disagreeButtonImage} alt="반대" />
//   </Button>
// );

// export { AgreeButton, DisagreeButton };

import React from 'react';
import styled from 'styled-components';
import agreeButtonImage from '../../img/찬성.png';
import disagreeButtonImage from '../../img/반대.png';

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const SmallButton = styled(Button)`
  width: 20%;
  height: 100%;
`;

const AgreeButton = ({ onClick, disabled }) => (
  <SmallButton onClick={onClick} disabled={disabled}>
    <img src={agreeButtonImage} alt="찬성" style={{ width: '100%', height: '100%' }} />
  </SmallButton>
);

const DisagreeButton = ({ onClick, disabled }) => (
  <SmallButton onClick={onClick} disabled={disabled}>
    <img src={disagreeButtonImage} alt="반대" style={{ width: '100%', height: '100%' }} />
  </SmallButton>
);

export { AgreeButton, DisagreeButton };