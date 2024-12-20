import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { auth } = useContext(AuthContext);

  // Si no hay token, redirige a login
  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene, redirige a login
  if (roleRequired && !auth.roles.includes(roleRequired)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
