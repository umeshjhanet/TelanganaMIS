// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return user !== null;
};

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" replace />;
};

export default PrivateRoute;
