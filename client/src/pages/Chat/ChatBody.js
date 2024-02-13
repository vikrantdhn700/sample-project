import React from 'react'
import {NavLink} from "react-router-dom"
import ReactEmoji from 'react-emoji';
//import { SITE_URL } from '../../utils/constants'
import { jwtDecode } from "jwt-decode";
import { getToken} from '../../common/useAuth';

const ChatBody = ({messages, typingStatus, lastMessageRef, defaultImg}) => { 
  //const navigate = useNavigate()
  let token = getToken();
  const decoded = jwtDecode(token);
  
//   const handleLeaveChat = () => {   
//     window.location.reload(SITE_URL)
//   }

  const newDate = new Date();
  const publish_date = newDate.getFullYear()+"-"+(newDate.getMonth()+1)+"-"+newDate.getDate()+" "+newDate.getHours()+":"+newDate.getMinutes() + ":" + newDate.getSeconds();
  
  return (
    <>
     <div className="chat-header clearfix">
        <div className="row">
            <div className="col-lg-6">
                <NavLink to={"#"}>
                    <img src={defaultImg} alt="avatar"/>
                </NavLink>
                <div className="chat-about">
                    <h6 className="m-b-0">{decoded.name}</h6>
                    <small>Active Now</small>
                </div>
            </div>
        </div>
    </div>
    <div className="chat-history">
        <ul className="m-b-0 messages__history">
        {messages.map(message => (
            message.userid === decoded._id ? (
            <li className="clearfix" key={message.id}>
                <div className="message-data text-right">
                    <span className="message-data-time">{publish_date} </span>                                        
                </div>
                <div className="message other-message float-right">{ReactEmoji.emojify(message.text)}</div>
            </li>
            ): (
            <li className="clearfix" key={message.id}>
                <div className="message-data">
                    <span className="message-data-time">{publish_date} </span>
                    <span className="message__author">{message.name}</span>
                </div>
                <div className="message my-message">{ReactEmoji.emojify(message.text)}</div>
            </li>
            )
            ))}
        </ul>
        {/* <div className='message__status'><p>{typingStatus}</p></div> */}
        <div ref={lastMessageRef} /> 
    </div>
   </>
  )
}

export default ChatBody