export default function RedisChatting() {
    const connect = (event) => {
        let socket = new SockJS("http://localhost:8080/ws-stomp");
        stompCilent.current = Stomp.over(socket);
        stompCilent.current.connect({}, () => {
         setTimeout(function() {
           onConnected();
         }, 500);
        })
       }
     
       function onConnected(sessionId) {
         // user 개인 구독
         stompCilent.current.subscribe(`/sub/chat/room/CHAT_${sessionId}`, function(message){
           setChatMessages((messages) => [...messages, message.body]);
  
           console.log(message.body);
         })
         // stompClient.current.subscribe('/room/' + chatObj.id + '/queue/messages', onMessageReceived);
       }

       const sendMessage = async (e) => {
        e.preventDefault();
        await stompCilent.current.send("/pub/chat/message", {}, JSON.stringify({type:'TALK', roomId:"CHAT_"+mySessionId, sender:myUserName, message: message}))
        setMessage("");
      }
       const ChangeMessages = (event) => {
        setMessage(event.target.value);
      }

      const enterChatRoom =  () => {
        console.log("채팅방 생성");
        axios.post(`http://localhost:8080/chat/room?name=CHAT_${location.state.sessionId}`)
        .then(res => {
          console.log(res);
        })
        
        axios.get(`http://localhost:8080/chat/room/CHAT_${location.state.sessionId}`)
        .then(res => {
          console.log(res);
        })
        // onConnected();
        stompCilent.current.send("/pub/chat/message", {}, JSON.stringify({type:'ENTER', roomId:"CHAT_"+mySessionId, sender:myUserName}));
      }
}
