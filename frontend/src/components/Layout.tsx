import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Layout = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-darkBg text-wireText font-sans selection:bg-primary/30">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 bg-darkBg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
