import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';
import './App.css';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmployeeHistory from './pages/EmployeeHistory';
import EmployeeDetails from './pages/EmployeeDetails';
import Profile from './pages/Profile';
import AdminStatsPage from './pages/AdminStatsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin/employee-history" element={<EmployeeHistory />} />
        <Route path="/admin/employee-history/:employeeId" element={<EmployeeDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/stats" element={<AdminStatsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
