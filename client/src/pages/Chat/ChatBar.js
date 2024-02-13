import React, {useState, useEffect} from 'react'

const ChatBar = ({socket, defaultImg}) => {
    const [users, setUsers] = useState([])
    useEffect(()=> {
        socket.on("newUserResponse", (data) => { 
            return setUsers(data)
        })
    }, [socket, users])
  return (
    <div id="plist" className="people-list">
        <ul className="list-unstyled chat-list mt-2 mb-0 inbox__people">
            {users.map((user) =>  {           
               return ( <li key={user.userid}  className="activeItem">
                    <img src={defaultImg} alt="avatar"/>
                    <div className="about">
                        <div className="name">{user.userName}</div>
                        <div className="status"> <i className="fa fa-circle online"></i>Active</div>                                            
                    </div>
                </li>
               )}
            )}
        </ul>
    </div>
   )
}

export default ChatBar