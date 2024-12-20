import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    username: null,
    roles: [],
    id: null,
  });

  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedRoles = JSON.parse(localStorage.getItem('roles')) || [];
    const storedId = localStorage.getItem('id');

    setAuth({
      token: storedToken,
      username: storedUsername,
      roles: storedRoles,
      id: storedId,
    });
  }, []);

  // Función para iniciar sesión
  const login = (userData) => {
    setAuth(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('roles', JSON.stringify(userData.roles));
    localStorage.setItem('id', userData.id);
  };

  // Función para cerrar sesión
  const logout = () => {
    setAuth({
      token: null,
      username: null,
      roles: [],
      id: null,
    });
    localStorage.clear(); // Limpiar todo el almacenamiento local
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
