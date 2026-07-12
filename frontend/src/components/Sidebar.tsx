import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Sidebar = () => {
  const { user } = useAuth();
  const menu = [
    { name: 'Dashboard', path: '/' },
    { name: 'Fleet', path: '/fleet' },
    { name: 'Drivers', path: '/drivers' },
    { name: 'Trips', path: '/trips' },
    { name: 'Maintenance', path: '/maintenance' },
    { name: 'Fuel & Expenses', path: '/expenses' },
    { name: 'Analytics', path: '/analytics' },
  ];

  if (user?.role === 'ADMIN' || user?.role === 'FLEET_MANAGER') {
    menu.push({ name: 'Settings', path: '/settings' });
  }

  return (
    <div className="w-64 bg-darkBg border-r border-wireBorder flex flex-col h-screen">
      <div className="p-6 text-2xl tracking-wide flex items-center space-x-2 border-b border-wireBorder mb-4">
        <span className="text-wireText font-light">TransitOps</span>
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? 'border border-primary text-wireText shadow-[0_0_8px_rgba(217,119,6,0.2)]'
                  : 'text-wireMuted hover:text-wireText border border-transparent'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
