import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import {Stomp} from "@stomp/stompjs";
import axios, { AxiosError } from 'axios';
function App() {

  let stompCilent = useRef({});
  const [message, setMessage] = useState("");
  const [chatMessage, setChatMessage] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [sender, setSender] = useState("이름모를유저");
  const scrollRef = useRef();

  useEffect(() => {
    connect();
    // enterChatRoom();
  }, []);

  const connect = (event) => {
   let socket = new SockJS("http://localhost:8080/ws-stomp");
   stompCilent.current = Stomp.over(socket);
   stompCilent.current.connect({}, () => {
    setTimeout(function() {
      onConnected();
    }, 500);
   })
  }

  function onConnected() {
    axios.post("http://localhost:8080/test/gameroom")
    .then(res => {
      console.log("테스트 게임방 생성")
    })

    // user 개인 구독
    stompCilent.current.subscribe('/sub/game/system/testroom', function(message){
      setChatMessage((messages) => [...messages, message.body]);
      console.log(chatMessage);
      console.log(message.body);
    })
    // stompClient.current.subscribe('/room/' + chatObj.id + '/queue/messages', onMessageReceived);
  }
  const enterChatRoom =  () => {
    // console.log("채팅방 생성");
    // axios.post(`/game/system?name=${roomId}`)
    // .then(res => {
    //   console.log(res);
    // })
    
    // axios.get(`/chat/room/${roomId}`)
    // .then(res => {
    //   console.log(res);
    // })
    stompCilent.current.send("/pub/game/action", {}, JSON.stringify({code:'GAME_START', roomId:roomId, actionCode: 'GAME_START', param: {citizenCount: '1'}}));
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    await stompCilent.current.send("/pub/chat/message", {}, JSON.stringify({type:'TALK', roomId:roomId, sender:sender, message: message}))
    setMessage("");
  }

  const ChangeRoomId = (event) => {
    setRoomId(event.target.value);
  }
  const ChangeSender = (event) => {
    setSender(event.target.value);
  }
  const ChangeMessage = (event) => {
    setMessage(event.target.value);
  }

  return (
    <div className="App">
      <header className="App-header">
          <input onChange={ChangeRoomId} placeholder='채팅방 번호'></input>
          <button onClick={enterChatRoom}>게임시작</button>
          <input placeholder={sender} onChange={ChangeSender}></input>
          <form onSubmit={sendMessage}>
          <input onChange={ChangeMessage} placeholder='메시지 입력'></input>
          </form>
          {chatMessage.map((i) => 
          <div>{i}</div>)}
      </header>
    </div>
  );
}

export default App;
