import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route  } from "react-router-dom";
import io from "socket.io-client"
import reportWebVitals from './reportWebVitals';

// Import Pages
import PrivateRoute from './common/PrivateRoute';
import { PROXY_URL } from './utils/constants';
import { AllBlogs, Blogdetail } from './pages/Allblog';
import {Register, Login, Logout} from './pages/Auth';
import {Dashboard} from './pages/Dashboard';
import {Userblogs, Addblog, EditBlog} from './pages/Userblogs';
import Chat from './pages/Chat';
import NoPage from './pages/Nopage';

const socket = io.connect(PROXY_URL)
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<AllBlogs />} />
          <Route path="/blogs/:slug" element={<Blogdetail />} />
          <Route path="account">
            <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="user-blogs" element={<PrivateRoute><Userblogs /></PrivateRoute>} />
            <Route path="user-blogs/add" element={<PrivateRoute><Addblog /></PrivateRoute>} />
            <Route path="user-blogs/edit/:id" element={<PrivateRoute><EditBlog /></PrivateRoute>} />
          </Route>
          <Route path="chat" element={<PrivateRoute><Chat socket={socket}/></PrivateRoute>} />
          <Route path="auth">
            <Route path="login" element={<Login socket={socket}/>} />
            <Route path="register" element={<Register />} />
            <Route path="logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
          </Route>
          <Route path="*" element={<NoPage />} />          
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>    
    <App />
  </React.StrictMode>
);

reportWebVitals();
