import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, Plus, Edit, Trash } from 'lucide-react';

export const Fleet = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(res.data);
    } catch (error) {
      console.error('Error fetching vehicles', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-500/20 text-green-500 border-green-500';
      case 'ON_TRIP': return 'bg-blue-500/20 text-blue-500 border-blue-500';
      case 'IN_SHOP': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500';
      case 'RETIRED': return 'bg-red-500/20 text-red-500 border-red-500';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Truck className="text-primary" /> Vehicle Registry
        </h1>
        <button className="bg-primary text-gray-900 font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-400 transition">
          <Plus size={20} /> Add Vehicle
        </button>
      </div>

      <div className="bg-darkCard border border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-gray-400 text-sm border-b border-gray-700">
              <th className="p-4 font-medium">Registration</th>
              <th className="p-4 font-medium">Name / Model</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Capacity</th>
              <th className="p-4 font-medium">Odometer</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr><td colSpan={7} className="p-4 text-center text-gray-500">Loading vehicles...</td></tr>
            ) : vehicles.length === 0 ? (
              <tr><td colSpan={7} className="p-4 text-center text-gray-500">No vehicles found.</td></tr>
            ) : (
              vehicles.map((v: any) => (
                <tr key={v.id} className="hover:bg-gray-800/50 transition">
                  <td className="p-4 text-white font-medium">{v.registration}</td>
                  <td className="p-4 text-gray-300">{v.name}</td>
                  <td className="p-4 text-gray-300">{v.type}</td>
                  <td className="p-4 text-gray-300">{v.maxCapacity} kg</td>
                  <td className="p-4 text-gray-300">{v.odometer} km</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${statusColor(v.status)}`}>
                      {v.status.replace('_', ' ')}
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
