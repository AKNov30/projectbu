import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user_role');

  if (!token || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />; // Redirect ไปหน้าอื่นถ้าไม่มีสิทธิ์
  }

  return children;
};

export default PrivateRoute;
