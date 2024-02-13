import React from 'react'
import {  Navigate } from 'react-router-dom'
import {useAuth} from './useAuth';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = useAuth();
  return (
    isLoggedIn ? children : <Navigate to="/auth/login" />
  )
}

export default PrivateRoute;