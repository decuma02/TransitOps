import React from 'react';
import { Truck, CheckCircle, Wrench, Navigation, Clock, Activity } from 'lucide-react';

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-darkCard border border-gray-700 p-6 rounded-xl flex items-center justify-between">
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
    </div>
    <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
      {icon}
    </div>
  </div>
);

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Active Vehicles" value="53" icon={<Truck size={24} className="text-blue-500" />} color="bg-blue-500" />
        <StatCard title="Available Vehicles" value="40" icon={<CheckCircle size={24} className="text-green-500" />} color="bg-green-500" />
        <StatCard title="In Maintenance" value="08" icon={<Wrench size={24} className="text-yellow-500" />} color="bg-yellow-500" />
        <StatCard title="Active Trips" value="12" icon={<Navigation size={24} className="text-purple-500" />} color="bg-purple-500" />
        <StatCard title="Fleet Utilization" value="75%" icon={<Activity size={24} className="text-primary" />} color="bg-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-darkCard border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Trips</h2>
          <div className="text-gray-400 text-sm flex items-center justify-center h-48 border-2 border-dashed border-gray-700 rounded-lg">
            [Trips List Placeholder]
          </div>
        </div>
        <div className="bg-darkCard border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Maintenance Alerts</h2>
          <div className="text-gray-400 text-sm flex items-center justify-center h-48 border-2 border-dashed border-gray-700 rounded-lg">
            [Alerts Placeholder]
          </div>
        </div>
      </div>
    </div>
  );
};
