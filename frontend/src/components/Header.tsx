import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <header className="bg-darkBg border-b border-wireBorder h-16 flex items-center justify-between px-6">
      <div className="flex-1 max-w-md">
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full bg-transparent border border-wireBorder rounded-md px-4 py-1.5 text-sm text-wireText placeholder-wireMuted focus:outline-none focus:border-wireMuted transition-colors"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 text-sm">
          <span className="text-wireMuted">{user?.name}</span>
          <div className="flex items-center border border-wireBorder rounded-full overflow-hidden text-xs">
            <span className="px-3 py-1 bg-transparent text-wireMuted border-r border-wireBorder capitalize">{user?.role?.toLowerCase().replace('_', ' ')}</span>
            <span 
              onClick={logout}
              className="px-2 py-1 bg-statusBlue/20 text-statusBlue font-medium flex items-center justify-center cursor-pointer hover:bg-statusBlue/30 transition-colors" 
              title="Logout" 
            >
              {getInitials(user?.name || '')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
