import React from 'react';
import styled from 'styled-components';
import chatbox from '../../img/helpbox2.png';

const ChatContainer = styled.div`
  background-image: url(${chatbox});
  background-size: cover;
  background-color: transparent;
  background-repeat: no-repeat;
  width: 580px;
  height: 540px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  font-family: 'NeoDunggeunmoPro-Regular', sans-serif;
  position: fixed;
  top: ${props => props.top};
  left: ${props => props.left};
  transform: translate(-50%, -50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScrollableText = styled.div`
  max-height: 75%;
  overflow: auto;
`;

const Log = ({ top, left }) => {
  return (
    <ChatContainer top={top} left={left}>
      <span> —̳͟͞💗  —̳͟͞💗 ˚우리의 로그여요 —̳͟͞💗  —̳͟͞💗 ˚</span>
      <ScrollableText>
      .　  　∧,,∧<br/>
    .　　(`･ω･´)　 ｎ__<br/>
    .　η ＞　 ⌒＼/ ､∃<br/>
    .(∃)/ ∧　　＼/<br/>
    .   　＼/　＼　　丶<br/>
    .　　　　／ y　 ﾉ<br/>
    .　　　／ ／　／<br/>
    .　　 (　(　〈<br/>
    .　 　　＼ ＼　＼ <br/>
    .　　 　(＿(＿＿)
    .　  　∧,,∧<br/>
    .　　(`･ω･´)　 ｎ__<br/>
    .　η ＞　 ⌒＼/ ､∃<br/>
    .(∃)/ ∧　　＼/<br/>
    .   　＼/　＼　　丶<br/>
    .　　　　／ y　 ﾉ<br/>
    .　　　／ ／　／<br/>
    .　　 (　(　〈<br/>
    .　 　　＼ ＼　＼ <br/>
    .　　 　(＿(＿＿)
    .　  　∧,,∧<br/>
    .　　(`･ω･´)　 ｎ__<br/>
    .　η ＞　 ⌒＼/ ､∃<br/>
    .(∃)/ ∧　　＼/<br/>
    .   　＼/　＼　　丶<br/>
    .　　　　／ y　 ﾉ<br/>
    .　　　／ ／　／<br/>
    .　　 (　(　〈<br/>
    .　 　　＼ ＼　＼ <br/>
    .　　 　(＿(＿＿) <br/>
    . 으아아으아아으아아으아아으아아으아아d으에에
      </ScrollableText>
    </ChatContainer>
  );
};

export default Log;
