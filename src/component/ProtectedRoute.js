import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && !auth.roles.includes(roleRequired)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
