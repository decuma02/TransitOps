import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-darkCard border-b border-gray-700 h-16 flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold text-white">Project: <span className="text-primary">TransitOps Core</span></h2>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-gray-300">
          <User size={18} />
          <span>{user?.name} ({user?.role})</span>
        </div>
        <button
          onClick={logout}
          className="text-gray-400 hover:text-red-400 transition flex items-center space-x-1"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
