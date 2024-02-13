import React, {useState} from 'react'
import { jwtDecode } from "jwt-decode";
import { getToken} from '../../common/useAuth';

const ChatFooter = ({socket}) => {
    const [message, setMessage] = useState("")
    let token = getToken();
    const decoded = jwtDecode(token);
    //console.log(decoded);

    const handleTyping = () => socket.emit("typing",`${decoded.name} is typing`)

    const handleSendMessage = (e) => {
        e.preventDefault()
        if(message.trim() && decoded.name) {
        socket.emit("message", 
            {
            text: message, 
            name: decoded.name, 
            id: `${socket.id}${Math.random()}`,
            socketID: socket.id,
            userid : decoded._id
            }
        )
        }
        setMessage("")
    }
  return (
    <div className="chat-message clearfix">
        <form className="message_form input-group mb-0" onSubmit={handleSendMessage}>
            <input type="text" className="form-control message_form__input"  placeholder="Enter text here..." value={message} onChange={e => setMessage(e.target.value)} onKeyDown={handleTyping}/>
            <input type="hidden" id="hidden_reciver_socket_id" value=""/>
            <input type="hidden" id="hidden_sender_socket_id" value=""/>
            <input type="hidden" id="hidden_curr_usrid" value=""/>
            <div className="input-group-prepend">
                <button className="message_form__button input-group-text sendBtn" type="submit"><i className="fa fa-send"></i></button>                                        
            </div>  
        </form>
    </div>
  )
}

export default ChatFooter