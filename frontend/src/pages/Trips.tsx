import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map, Plus, CheckCircle, XCircle } from 'lucide-react';

export const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/trips');
      setTrips(res.data);
    } catch (error) {
      console.error('Error fetching trips', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-500/20 text-gray-500 border-gray-500';
      case 'DISPATCHED': return 'bg-blue-500/20 text-blue-500 border-blue-500';
      case 'COMPLETED': return 'bg-green-500/20 text-green-500 border-green-500';
      case 'CANCELLED': return 'bg-red-500/20 text-red-500 border-red-500';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Map className="text-primary" /> Trip Dispatcher
        </h1>
        <button className="bg-primary text-gray-900 font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-400 transition">
          <Plus size={20} /> Create Trip
        </button>
      </div>

      <div className="bg-darkCard border border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-gray-400 text-sm border-b border-gray-700">
              <th className="p-4 font-medium">Source -&gt; Destination</th>
              <th className="p-4 font-medium">Vehicle</th>
              <th className="p-4 font-medium">Driver</th>
              <th className="p-4 font-medium">Cargo</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr><td colSpan={6} className="p-4 text-center text-gray-500">Loading trips...</td></tr>
            ) : trips.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center text-gray-500">No trips found.</td></tr>
            ) : (
              trips.map((t: any) => (
                <tr key={t.id} className="hover:bg-gray-800/50 transition">
                  <td className="p-4 text-white font-medium">{t.source} &rarr; {t.destination}</td>
                  <td className="p-4 text-gray-300">{t.vehicle?.registration}</td>
                  <td className="p-4 text-gray-300">{t.driver?.name}</td>
                  <td className="p-4 text-gray-300">{t.cargoWeight} kg</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${statusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {t.status === 'DISPATCHED' && (
                      <button className="text-green-400 hover:text-green-300 mr-3" title="Complete Trip"><CheckCircle size={18} /></button>
                    )}
                    {(t.status === 'DRAFT' || t.status === 'DISPATCHED') && (
                      <button className="text-red-400 hover:text-red-300" title="Cancel Trip"><XCircle size={18} /></button>
                    )}
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
