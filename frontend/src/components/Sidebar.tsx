import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Sidebar = () => {
  const { user } = useAuth();
  const allMenu = [
    { name: 'Dashboard', path: '/', roles: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
    { name: 'Fleet', path: '/fleet', roles: ['FLEET_MANAGER', 'SAFETY_OFFICER'] },
    { name: 'Drivers', path: '/drivers', roles: ['FLEET_MANAGER', 'SAFETY_OFFICER'] },
    { name: 'Trips', path: '/trips', roles: ['FLEET_MANAGER', 'DRIVER'] },
    { name: 'Maintenance', path: '/maintenance', roles: ['FLEET_MANAGER', 'SAFETY_OFFICER'] },
    { name: 'Fuel & Expenses', path: '/expenses', roles: ['FLEET_MANAGER', 'FINANCIAL_ANALYST'] },
    { name: 'Analytics', path: '/analytics', roles: ['FLEET_MANAGER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
    { name: 'Settings', path: '/settings', roles: ['FLEET_MANAGER'] },
  ];

  const menu = allMenu.filter(item => user?.role && item.roles.includes(user.role));

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
