// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const isAuthenticated = () => {
//   const user = localStorage.getItem('user');
//   return user !== null;
// };

// const PrivateRoute = ({ element }) => {
//   return isAuthenticated() ? element : <Navigate to="/" replace />;
// };

// export default PrivateRoute;


// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import useInactivityTimer from './useInactivityTimer'; // Add this import

const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  console.log("user" + user);
  return user !== null;
};

const PrivateRoute = ({ element }) => {
  // Auto logout function
  const handleAutoLogout = () => {
    console.log('Auto logging out due to inactivity');
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/"; // Use window.location to ensure complete redirect
  };

  // Auto logout only on protected routes - 10 minutes (600000ms)
  useInactivityTimer(handleAutoLogout, 36000000);

  return isAuthenticated() ? element : <Navigate to="/" replace />;
};

export default PrivateRoute;