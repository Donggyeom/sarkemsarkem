import './App.css';
import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import {Stomp} from "@stomp/stompjs";
import axios from 'axios';

function App() {
  
  let stompCilent = useRef({});
  const [playerId, setPlayerId] = useState("host");
  const [roomId, setRoomId] = useState("");
  const [systemMessage, setSystemMessage] = useState([]);

  useEffect(() => {
    connect();
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
 
   const onConnected = () => {
    console.log("server websocker 연결 완료");
   }

   const createTestGameRoom = () => {
     axios.post("http://localhost:8080/test/gameroom")
     .then(res => {
       console.log("테스트 게임방 생성")
       setRoomId("testroom");
     })
     .catch((err) => {
      console.log("테스트 게임방 생성 실패")
     })
   }

   const ChangeRoomId = (event) => {
    setRoomId(event.target.value);
   }

   const ChangePlayerId = (event) => {
    setPlayerId(event.target.value);
   }

   const connectGameRoom = () => {
     // 게임방 redis 구독
     stompCilent.current.subscribe('/sub/game/system/' + roomId, function(message){
       // 시스템 메시지 처리
      setSystemMessage((messages) => [...messages, message.body]);
      console.log(systemMessage);
      console.log(message.body);
     })
   }

   const gameStart = () => {
    console.log("게임시작 클릭")
    stompCilent.current.send("/pub/game/action", {}, 
      JSON.stringify({
        code:'GAME_START', 
        roomId: roomId, 
        actionCode: 'GAME_START',
        playerId: playerId
      })
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={createTestGameRoom}>테스트 게임방 생성</button>
        <input onChange={ChangeRoomId} value={roomId} placeholder='게임방 번호'></input>
        <input onChange={ChangePlayerId} value={playerId} placeholder='플레이어ID'></input>
        <button onClick={connectGameRoom}>게임방 연결</button>
        <button onClick={gameStart}>게임시작</button>
        <ol>
          {systemMessage.map((list, index) => 
            <li key={index}><pre>roomId: {JSON.parse(list).roomId} code: {JSON.parse(list).code}</pre>
            </li>)}
        </ol>
      </header>
    </div>
  );
}

export default App;
