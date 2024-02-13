import React, { useState, useEffect } from "react";
import { NavLink  } from "react-router-dom";
import { PROXY_URL } from "../utils/constants"; 
import HeaderMenu from '../common/HeaderMenu';
import { getToken} from '../common/useAuth';

// Render Functions
export const Dashboard = () => {
  const [usrName, setusrName] = useState('');

  useEffect(() => {
    let token = getToken();
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
          setusrName(data.result.first_name);
        } else if(data.status === "failed" && data.message === "jwt expired"){
           window.location.replace('/auth/logout');
        }
      });
    } catch (error) {
      console.log(error.message);
    } 
  }, []); 
  return(
    <div className="container">
        <div className="row clearfix">
            <div className="col-lg-12">
                <HeaderMenu/>       
                <div className="card chat-app">
                    <div className="blog-outer">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="well">
                                    <h4>Welcome, {usrName}</h4>
                                    <p>We're excited to have you here on your personalized dashboard. This is your space to access important information, manage your account, and explore our services.</p>
    <p>Feel free to navigate through the different sections, and if you have any questions or need assistance, our support team is just a click away.</p>
    <p>Thank you for choosing our platform!</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="well">
                                    <h4>User Blog</h4>
                                    <p><NavLink to="/account/user-blogs">click here</NavLink></p>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="well">
                                    <h4>Chat</h4>
                                    <p><NavLink to="/chat">click here</NavLink></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
