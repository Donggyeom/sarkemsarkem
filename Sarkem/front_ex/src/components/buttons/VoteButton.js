import React from 'react';
import styled from 'styled-components';
import buttonclickSound from '../../sound/buttonclick.mp3'
import voteImg from '../../img/btn_투표확정.png';
import skipImg from '../../img/btn_스킵하기.png';

const ButtonImage = styled.button`
    padding: 0;
    background: url(${props => props.imageSrc}) no-repeat center center;
    background-size: cover;
    width: 80%;
    height: 80%;
    border : none;
    cursor: pointer;
    // z-index: 1;
    &:hover {
        filter: brightness(0.8);
    // background: transparent;
    border: none;
}
`;

const ButtonWithSound = ({ onClick, imageSrc, alt, disabled }) => {
    const handleClick = () => {
    const sound = new Audio(buttonclickSound);
    sound.play();
      onClick(); // Call the provided onClick handler from the parent component
    };

    return (
        <ButtonImage onClick={handleClick} disabled={disabled}>
            <img src={imageSrc} alt={alt} style={{ width: '100%', height: '100%' }} />
        </ButtonImage>
    );
};

const VoteButton = ({ onClick , disabled}) => {
    return <ButtonWithSound
            onClick={onClick}
            imageSrc={voteImg}
            alt="vote"
            disabled={disabled}
        />;
};

const SkipButton = ({ onClick, disabled}) => {
    return <ButtonWithSound
            onClick={onClick}
            imageSrc={skipImg}
            alt="skip"
            disabled={disabled}
            />;
};

export {VoteButton, SkipButton} ;
