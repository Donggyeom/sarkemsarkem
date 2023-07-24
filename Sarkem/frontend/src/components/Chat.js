import React from 'react'
import '../css/Chat.css'
import SockJS from 'sockjs-client';
import {Stomp} from "@stomp/stompjs";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Message from './Message';

export default function Chat({sessionId, userName}) {

    let stompCilent = useRef({});

    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        connect();
    }, [])

    useEffect(() => {
      if(stompCilent.current.connected) enterChatRoom();
    }, [stompCilent.current.connected])

    const connect = (event) => {
        let socket = new SockJS("http://localhost:8080/ws-stomp");
        stompCilent.current = Stomp.over(socket);
        stompCilent.current.connect({}, () => {
         setTimeout(function() {
           onConnected();
         }, 500);
        })
        console.log(stompCilent.current.connected);
        setIsConnected(true);
        console.log(isConnected);
       }
     
       function onConnected() {
         // user 개인 구독
         stompCilent.current.subscribe(`/sub/chat/room/CHAT_${sessionId}`, function(message){
           setChatMessages((messages) => [...messages, message.body]);
  
           console.log(message.body);
         })
         // stompClient.current.subscribe('/room/' + chatObj.id + '/queue/messages', onMessageReceived);
       }

       const sendMessage = async (e) => {
        e.preventDefault();
        if (message === '') return;
        await stompCilent.current.send("/pub/chat/message", {}, JSON.stringify({type:'TALK', roomId:"CHAT_"+sessionId, sender:userName, message: message}))
        setMessage("");
      }
       const ChangeMessages = (event) => {
        setMessage(event.target.value);
      }

      const enterChatRoom =  () => {
        console.log("채팅방 생성");
        console.log(isConnected);
        axios.post(`/api/chat/room?name=CHAT_${sessionId}`)
        .then(res => {
          console.log(res);
        })
        
        axios.get(`/api/chat/room/CHAT_${sessionId}`)
        .then(res => {
          console.log(res);
        })
        stompCilent.current.send("/pub/chat/message", {}, JSON.stringify({type:'ENTER', roomId:"CHAT_"+sessionId, sender:userName}));
        document.getElementById("messageInput").disabled = false;
      }

  return (
    <div className="chat-container">
        <button onClick={enterChatRoom}>채팅방 입장</button>
        <form onSubmit={sendMessage}>
        <input id="messageInput"onChange={ChangeMessages} placeholder='메시지 입력' value={message} disabled></input>
        </form>
        {chatMessages.map((i) => 
        <Message info={i}/>)}
    </div>
  )
}