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
    // user 개인 구독
    stompCilent.current.subscribe('/sub/chat/room/'+roomId, function(message){
      setChatMessage((messages) => [...messages, message.body]);
      console.log(chatMessage);
      console.log(message.body);
    })
    // stompClient.current.subscribe('/room/' + chatObj.id + '/queue/messages', onMessageReceived);
  }
  const enterChatRoom =  () => {
    console.log("채팅방 생성");
    axios.post(`/chat/room?name=${roomId}`)
    .then(res => {
      console.log(res);
    })
    
    axios.get(`/chat/room/${roomId}`)
    .then(res => {
      console.log(res);
    })
    onConnected();
    stompCilent.current.send("/pub/chat/message", {}, JSON.stringify({type:'ENTER', roomId:roomId, sender:sender}));
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
          <button onClick={enterChatRoom}>채팅방 입장</button>
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
