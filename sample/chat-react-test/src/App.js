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
  const scrollRef = useRef();

  useEffect(() => {
    connect();
    enterCharRoom();
  })

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
    stompCilent.current.subscribe('/sub/chat/room/1', function(message){
      console.log(message);
    })
    // stompClient.current.subscribe('/room/' + chatObj.id + '/queue/messages', onMessageReceived);
  }
  const enterCharRoom = async () => {
    console.log("채팅방 생성");
    await axios.post('/chat/room?name=1')
    .then(res => {
      console.log(res);
    })
    
    await axios.get("/chat/room/1")
    .then(res => {
      console.log(res);
    })
  }
  const sendMessage = async () => {
    await stompCilent.current.send("/pub/chat/message", {}, JSON.stringify({type:'ENTER', roomId:1, sender:"hyuntall"}))
  }

  return (
    <div className="App">
      <header className="App-header">

          <button onClick={sendMessage}></button>

      </header>
    </div>
  );
}

export default App;
