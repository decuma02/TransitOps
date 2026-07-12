import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, Edit, Trash } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Drivers = () => {
  const { user } = useAuth();
  const isDemo = user?.email?.startsWith('demo_');

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!isDemo) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-wireMuted mt-20">
        <p className="text-xl mb-2 text-wireText">Welcome to TransitOps, {user?.name}!</p>
        <p className="text-sm">There is no data available yet. Please use a demo account to view the mock UI.</p>
      </div>
    );
  }

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/drivers');
      setDrivers(res.data);
    } catch (error) {
      console.error('Error fetching drivers', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-500/20 text-green-500 border-green-500';
      case 'ON_TRIP': return 'bg-blue-500/20 text-blue-500 border-blue-500';
      case 'OFF_DUTY': return 'bg-gray-500/20 text-gray-500 border-gray-500';
      case 'SUSPENDED': return 'bg-red-500/20 text-red-500 border-red-500';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="text-primary" /> Driver Management
        </h1>
        <button className="bg-primary text-gray-900 font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-400 transition">
          <Plus size={20} /> Add Driver
        </button>
      </div>

      <div className="bg-darkCard border border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-gray-400 text-sm border-b border-gray-700">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">License No.</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Expiry</th>
              <th className="p-4 font-medium">Safety Score</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr><td colSpan={7} className="p-4 text-center text-gray-500">Loading drivers...</td></tr>
            ) : drivers.length === 0 ? (
              <tr><td colSpan={7} className="p-4 text-center text-gray-500">No drivers found.</td></tr>
            ) : (
              drivers.map((d: any) => (
                <tr key={d.id} className="hover:bg-gray-800/50 transition">
                  <td className="p-4 text-white font-medium">{d.name}</td>
                  <td className="p-4 text-gray-300">{d.licenseNumber}</td>
                  <td className="p-4 text-gray-300">{d.licenseCategory}</td>
                  <td className="p-4 text-gray-300">{new Date(d.licenseExpiry).toLocaleDateString()}</td>
                  <td className="p-4 text-gray-300">{d.safetyScore}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${statusColor(d.status)}`}>
                      {d.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-gray-400 hover:text-white mr-3"><Edit size={18} /></button>
                    <button className="text-gray-400 hover:text-red-500"><Trash size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
