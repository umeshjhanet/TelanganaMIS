import React from 'react';
import { Route,Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useContext } from 'react';

const PrivateRoute = ({ element: Element, ...rest }) => {
    const { isAuthenticated } = useContext(AuthContext);
  
    return (
      <Route
        {...rest}
        element={isAuthenticated ? <Element /> : <Navigate to="/" replace />}
      />
    );
  };

export default PrivateRoute;
