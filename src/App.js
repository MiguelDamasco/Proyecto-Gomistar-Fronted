import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import PrivateRoute from './PrivateRoute';
import './App.css';
import UserDashboard from './UserDashboard';
import AdminDashboard from './component/AdminDashboard';
import UserTest from './component/UserTest';
import CreateUser from './component/CreateUserComponent'
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './component/ProtectedRoute';
import ShipDashboard from './component/ShipDashboard';
//import { useAuth, AuthProvider } from './AuthProvider';

const App = () => {
 // const { user } = useAuth(); 
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute roleRequired="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/ship"
            element={
              <ProtectedRoute roleRequired="ADMIN">
                <ShipDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute roleRequired="USER">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userDashboard"
            element={
              <ProtectedRoute roleRequired="USER">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/userTest"
            element={
                <CreateUser />
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  ); };

export default App;

