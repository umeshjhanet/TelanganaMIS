// PrivateRoute.js
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
import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user'); // Retrieve user from localStorage

  // If neither token nor user is found, return false
  if (!token && !user) {
    console.log('No token or user found in localStorage.');
    return false;
  }

  // Check if token exists
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);

      // Check token expiration
      const currentTime = Date.now() / 1000; // Current time in seconds
      if (decodedToken.exp < currentTime) {
        console.log('Token expired at', new Date(decodedToken.exp * 1000));
        return false;
      }

      console.log('Token is valid.');
      return true; // Token is valid
    } catch (error) {
      console.error('Token decoding failed:', error);
      return false;
    }
  }

  // If only user exists (without token), return true
  if (user) {
    console.log('User found in localStorage.');
    return true;
  }

  return false;
};

const PrivateRoute = ({ element }) => {
  const isUserAuthenticated = isAuthenticated();

  console.log('isAuthenticated:', isUserAuthenticated);

  return isUserAuthenticated ? element : <Navigate to="/" replace />;
};

export default PrivateRoute;