import React, { useState, useEffect, useRef } from "react";
import { PROXY_URL, SITE_URL } from "../utils/constants"; 
import { MainLayout } from '../common/MainLayout';
import { getToken} from '../common/useAuth';
//import Messages from './Chat/Messages'
import ChatBar from './Chat/ChatBar'
import ChatBody from './Chat/ChatBody'
import ChatFooter from './Chat/ChatFooter'

// Chat
const Chat = ({socket}) => { 
    let token = getToken();
    if(!token) window.location.replace('/auth/logout');

    const [messages, setMessages] = useState([])
   // const [typingStatus, setTypingStatus] = useState("")
    const lastMessageRef = useRef(null);

    useEffect(()=> {
        try {
            fetch(`${PROXY_URL}/api/user/me`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
            }).then((response)=> response.json())
            .then((data) => {
              if(data.status === "success") {
                //setusrName(data.result.first_name);
                const userName = data.result.first_name +" "+data.result.last_name;
                const userid = data.result._id;
                socket.emit("newUser", {userName, userid ,socketID: socket.id})
              } else if(data.status === "failed" && data.message === "jwt expired"){
                 window.location.replace('/auth/logout');
              }
            });
          } catch (error) {
            console.log(error.message);
          }
    }, [socket, token])
    
  
    useEffect(()=> {
      socket.on("messageResponse", data => setMessages([...messages, data]))
    }, [socket, messages])
  
    // useEffect(()=> {
    //   socket.on("typingResponse", data => setTypingStatus(data))
    // }, [socket])
  
    useEffect(() => {
      lastMessageRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);
    
    const defaultImg = `${SITE_URL}/img/nouserplcaeholeder.png`; 

    return (
        <>
        <MainLayout>            
            <div className="blog-outer">
                <div className="card chat-app">
                        <ChatBar socket={socket} defaultImg={defaultImg}/>
                    <div className="chat">
                        <ChatBody messages={messages} lastMessageRef={lastMessageRef} defaultImg={defaultImg}/>
                        <ChatFooter socket={socket}/>
                    </div>
                </div>
            </div>
        </MainLayout>
      </>
    )
  }

export default Chat;

