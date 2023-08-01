import React from 'react';
import styled from 'styled-components';
import inviteButtonImage from '../../img/invitebutton.png';

const InviteButtonImage = styled.img`
  width: 100%;
  height: 100%;
  cursor: pointer;
  &:hover {
    filter: brightness(0.8);
  }
`;

const InviteButton = ({ onClick }) => {
  return <InviteButtonImage src={inviteButtonImage} onClick={onClick} alt={"Invite Button"}/>;
};

export default InviteButton;