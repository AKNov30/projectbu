import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// สร้าง PrivateRoute component
const PrivateRoute = ({ element, ...rest }) => {
  const isLoggedIn = !!localStorage.getItem('token'); // ตรวจสอบสถานะล็อกอิน

  return (
    <Route 
      {...rest} 
      element={isLoggedIn ? element : <Navigate to="/login" />} // ถ้าไม่ล็อกอินให้เปลี่ยนเส้นทางไปหน้า login
    />
  );
};

export default PrivateRoute;
