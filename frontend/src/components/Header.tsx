import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-darkBg border-b border-wireBorder h-16 flex items-center justify-between px-6">
      <div className="flex-1 max-w-md">
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full bg-transparent border border-wireBorder rounded-md px-4 py-1.5 text-sm text-wireText placeholder-wireMuted focus:outline-none focus:border-wireMuted transition-colors"
        />
      </div>
      
      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        <div className="flex items-center space-x-3 text-sm">
          <span className="text-wireMuted">{user?.name}</span>
          <div className="flex items-center border border-wireBorder rounded-full overflow-hidden text-xs">
            <span className="px-3 py-1 bg-transparent text-wireMuted border-r border-wireBorder capitalize">{user?.role?.toLowerCase().replace('_', ' ')}</span>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-2 py-1 bg-statusBlue/20 text-statusBlue font-medium flex items-center justify-center cursor-pointer hover:bg-statusBlue/30 transition-colors focus:outline-none" 
            >
              {getInitials(user?.name || '')}
            </button>
          </div>
        </div>

        {/* Floating Profile Window */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-3 w-64 bg-darkCard border border-wireBorder rounded-lg shadow-2xl overflow-hidden z-50">
            <div className="p-4 border-b border-wireBorder bg-darkBg/50">
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-wireMuted mt-1">{user?.email}</p>
              <p className="text-[10px] uppercase tracking-wider text-statusBlue mt-2 font-medium">{user?.role?.replace('_', ' ')}</p>
            </div>
            
            <div className="p-2 space-y-1">
              <button 
                onClick={() => alert('Profile editing is not available in the demo.')}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-wireText hover:bg-white/5 rounded-md transition-colors"
              >
                <User size={16} className="text-wireMuted" />
                <span>Edit Profile</span>
              </button>
              
              <button 
                onClick={logout}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-statusRed hover:bg-statusRed/10 rounded-md transition-colors"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
