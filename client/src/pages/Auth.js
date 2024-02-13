import React, { useState } from "react";
import { NavLink,useNavigate  } from "react-router-dom";
import HeaderMenu from '../common/HeaderMenu';
import { PROXY_URL } from "../utils/constants";
import {useAuth, getToken} from '../common/useAuth';

// Components
const BeforeLoginReg = (props) => {
  return (
    <form action="" onSubmit={props.formSubmit} id="register-form" method="POST">
      <div className="container">
      <div className="status-message">{ props.message  }</div>
      <h1>Register</h1>
      <p>Please fill in this form to create an account.</p>
      <hr/>
      <div className="formInput" id="formouterBx">
        <label htmlFor="first_name"><b>First Name</b></label>
        <input type="text" placeholder="Enter First Name" name="first_name" id="first_name" value={props.first_name} onChange={props.inputChange}/>

        <label htmlFor="last_name"><b>Last Name</b></label>
        <input type="text" placeholder="Enter Last Name" name="last_name" id="last_name" value={props.last_name} onChange={props.inputChange}/>

        <label htmlFor="email"><b>Email</b></label>
        <input type="text" placeholder="Enter Email" name="email" id="email" value={props.email} onChange={props.inputChange}/>
    
        <label htmlFor="password"><b>Password</b></label>
        <input type="password" placeholder="Enter Password" name="password" id="password" value={props.password} onChange={props.inputChange}/>
    
        <label htmlFor="phone"><b>Phone</b></label>
        <input type="text" placeholder="Repeat Password" name="phone" id="phone" value={props.phone} onChange={props.inputChange}/>
        <hr/>
    
        <button type="submit" className="registerbtn">Register</button>
      </div>
      </div>
  
      <div className="container signin">
      <p>Already have an account? <NavLink  to="/auth/login">Sign in</NavLink >.</p>
      </div>
  </form>
  )
}

const BeforeLogin = (props) => {  
    return (
      <div className="form-bx">
        <form action="" onSubmit={props.formSubmit} id="login-form" method="POST">
          <div className="container">
          <div className="status-message">{ props.message  }</div>
            <h1>Login</h1>
            <p>Login here.</p>
            <hr/>
            <div id="return-msg"></div>
            <label htmlFor="email"><b>Email</b></label>
            <input type="text" placeholder="Enter Email" name="email" id="email" value={props.email} onChange={props.inputChange} />        
            <label htmlFor="password"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="password" id="password" value={props.password} onChange={props.inputChange} />
            <hr/>        
            <button type="submit" className="loginbtn">Login</button>          
          </div>      
          <div className="container signin">
          <p>Create an account? <NavLink  to="/auth/register">Signup</NavLink >.</p>
        </div>
      </form>
    </div>
    )
  }

const AfterLogin = () => {
  return (
    <div className="aftr-login-bx">
      <p>You are already loggedin. <NavLink  to="/auth/logout">Logout?</NavLink ></p>
    </div>
  )
}

// Render Functions
export const Register = () => {
  const isLoggedIn = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name : '',
    phone: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();      
    try {
      await fetch(`${PROXY_URL}/api/auth/register`, {
        method: 'POST',
        body : JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        },
      }).then((response)=> response.json())
      .then((data) => {
        if(data.status === "failed") {
          setMessage(<p className="msg-error">{data.message}</p>);
        } else if(data.status === "success") {
          document.getElementById("formouterBx").remove();
          setMessage(<p className="msg-success">{data.message}. click to <NavLink  to="/auth/login">Sign in</NavLink ></p>);
        }
      });
    } catch (error) {
      setMessage(error);
    }    
  };

  let returnHTML;

  if(!isLoggedIn) {
    returnHTML = <BeforeLoginReg 
      formSubmit={handleSubmit} 
      inputChange={handleInputChange} 
      message={message}
      email = {formData.email}
      password = {formData.password}
      first_name = {formData.first_name}
      last_name = {formData.last_name}
      phone = {formData.phone}
    />;
  } else {
    returnHTML = <AfterLogin/>
  }

  return(
    <div className="main-container">
      <div className="row clearfix">
        <div className="col-lg-12">
          <HeaderMenu/>
        </div>
      </div>      
      {returnHTML}
    </div>
  )
}

export const Login = ({socket}) => {
   const navigate = useNavigate()
    const isLoggedIn = useAuth();
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
    const [message, setMessage] = useState(null);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();      
      try {
        await fetch(`${PROXY_URL}/api/auth/login`, {
          method: 'POST',
          body : JSON.stringify(formData),
          headers: {
              'Content-Type': 'application/json'
          },
        }).then((response)=> response.json())
        .then((data) => {
          if(data.status === "failed") {
            setMessage(<p className="msg-error">{data.message}</p>);
          } else if(data.status === "success") {
            setMessage(<p className="msg-success">{data.message}</p>);
            localStorage.setItem("access_token", data.result.token);
            
            const userName = data.result.first_name +" "+data.result.last_name;
            const userid = data.result._id;
            socket.emit("newUser", {userName, userid ,socketID: socket.id})
            navigate("/account/dashboard")
          }
        });
      } catch (error) {
        setMessage(error);
      }    
    };
  
    let returnHTML;
  
    if(!isLoggedIn) {
      returnHTML = <BeforeLogin 
        formSubmit={handleSubmit} 
        inputChange={handleInputChange} 
        message={message}
        email = {formData.email}
        password = {formData.password}
      />;
    } else {
      returnHTML = <AfterLogin/>
    }
    
  
    return(
      <div className="main-container">
        <div className="row clearfix">
          <div className="col-lg-12">
            <HeaderMenu/>
          </div>
        </div>
        {returnHTML}
  
      </div>
    )
}

export const Logout = async () => {
   try {
      let token = getToken();
      if(!token) return ({"message" : "Invalid Token"});
      localStorage.removeItem('access_token')
      window.location.href = "/";
   } catch (error) {
      return ({"message" : error.message});
   } 
}