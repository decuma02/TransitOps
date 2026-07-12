import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Fleet } from './pages/Fleet';
import { Drivers } from './pages/Drivers';
import { Trips } from './pages/Trips';
import { Maintenance } from './pages/Maintenance';
import { Expenses } from './pages/Expenses';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={
              <ProtectedRoute allowedRoles={['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="fleet" element={
              <ProtectedRoute allowedRoles={['FLEET_MANAGER', 'SAFETY_OFFICER']}>
                <Fleet />
              </ProtectedRoute>
            } />
            <Route path="drivers" element={
              <ProtectedRoute allowedRoles={['FLEET_MANAGER', 'SAFETY_OFFICER']}>
                <Drivers />
              </ProtectedRoute>
            } />
            <Route path="trips" element={
              <ProtectedRoute allowedRoles={['FLEET_MANAGER', 'DRIVER']}>
                <Trips />
              </ProtectedRoute>
            } />
            <Route path="maintenance" element={
              <ProtectedRoute allowedRoles={['FLEET_MANAGER', 'SAFETY_OFFICER']}>
                <Maintenance />
              </ProtectedRoute>
            } />
            <Route path="expenses" element={
              <ProtectedRoute allowedRoles={['FLEET_MANAGER', 'FINANCIAL_ANALYST']}>
                <Expenses />
              </ProtectedRoute>
            } />
            <Route path="analytics" element={
              <ProtectedRoute allowedRoles={['FLEET_MANAGER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST']}>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="settings" element={
              <ProtectedRoute allowedRoles={['FLEET_MANAGER']}>
                <Settings />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
