import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Map, Wrench, FileText, BarChart2, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Sidebar = () => {
  const { user } = useAuth();
  const menu = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Fleet', path: '/fleet', icon: <Truck size={20} /> },
    { name: 'Drivers', path: '/drivers', icon: <Users size={20} /> },
    { name: 'Trips', path: '/trips', icon: <Map size={20} /> },
    { name: 'Maintenance', path: '/maintenance', icon: <Wrench size={20} /> },
    { name: 'Fuel & Expenses', path: '/expenses', icon: <FileText size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
  ];

  if (user?.role === 'ADMIN' || user?.role === 'FLEET_MANAGER') {
    menu.push({ name: 'Settings', path: '/settings', icon: <Settings size={20} /> });
  }

  return (
    <div className="w-64 bg-darkCard border-r border-gray-700 flex flex-col h-screen">
      <div className="p-6 text-xl font-bold flex items-center space-x-2 border-b border-gray-700">
        <Truck className="text-primary" />
        <span className="text-white">TransitOps</span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-gray-800 text-primary font-semibold'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
