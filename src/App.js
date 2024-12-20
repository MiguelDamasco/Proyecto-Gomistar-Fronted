import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import PrivateRoute from './PrivateRoute';
import './App.css';
import UserDashboard from './UserDashboard';
import AdminDashboard from './component/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './component/ProtectedRoute';
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
        </Routes>
      </Router>
    </AuthProvider>
  ); };

export default App;

