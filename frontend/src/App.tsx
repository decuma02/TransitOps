import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Fleet } from './pages/Fleet';
import { Drivers } from './pages/Drivers';
import { Trips } from './pages/Trips';
import { Maintenance } from './pages/Maintenance';
import { Expenses } from './pages/Expenses';
import { Analytics } from './pages/Analytics';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="fleet" element={<Fleet />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="trips" element={<Trips />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<div className="text-white">Settings</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
