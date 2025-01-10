import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import PrivateRoute from './PrivateRoute';
//import './App.css';
import UserDashboard from './UserDashboard';
import AdminDashboard from './component/AdminDashboard';
import UserTest from './component/UserTest';
import CreateUser from './component/CreateUserComponent'
import { AuthProvider, useAuth } from './context/AuthContext';
import ShipManagement from './component/ShipManagement';
import ProtectedRoute from './component/ProtectedRoute';
import ShipDashboard from './component/ShipDashboard';
import EmployeeShipDashboard from './component/EmployeeShipDashboard';
import CargoShipEmployee from './component/CargoShipEmployee';
import PassengerShipEmployee from './component/PassengerShipEmployee';
import DocumentShipManagement from './component/DocumentShipManagement';
import ShipDocuments from './component/ShipDocuments';
import Modal from 'react-modal';
//import { useAuth, AuthProvider } from './AuthProvider';

export const userContext = React.createContext();


const App = () => {
 
  const [user, setUser] = useState(null);

  const username = localStorage.getItem('username');
  const storedList = localStorage.getItem('roles');
  const roleList = storedList ? JSON.parse(storedList) : [];

  console.log("lista de roles: " + roleList);
  console.log("username: " + username);

  return (

    <userContext.Provider value={{user, setUser}}>
    <BrowserRouter>
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute
              isAllowed={!!username && roleList.includes('USER')}
              redirectTo="/login"
            />
          }
        >
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/configuration" element={<UserDashboard />} />
          <Route path="*" element={<Dashboard />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              isAllowed={!!username && roleList.includes('ADMIN')}
              redirectTo="/login"
            />
          }
        >
          <Route path="/admin_panel" element={<AdminDashboard />}></Route>
          <Route path="/barcos" element={<ShipDashboard />}></Route>
          <Route path="/gestion_usuario" element={<CreateUser />}></Route>
          <Route path="/gestion" element={<CreateUser />}></Route>
          <Route path="/gestion_barcos" element={<ShipManagement />}></Route>
          <Route path="/gestion_tripulantes" element={<EmployeeShipDashboard />}></Route>
          <Route path="/barco_carga_tripulantes" element={<CargoShipEmployee />}></Route>
          <Route path="/barco_pasajeros_tripulantes" element={<PassengerShipEmployee />}></Route>
          <Route path="/documentos_embarcación" element={<DocumentShipManagement />}></Route>
          <Route path="/documentos_barco" element={<ShipDocuments />}></Route>

        </Route>
      </Routes>
    </BrowserRouter>
    </userContext.Provider>
  ); };

export default App;

