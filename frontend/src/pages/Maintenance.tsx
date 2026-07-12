import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wrench, Plus, CheckCircle } from 'lucide-react';

export const Maintenance = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/maintenance');
      setLogs(res.data);
    } catch (error) {
      console.error('Error fetching maintenance', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status: string) => {
    return status === 'OPEN' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500' : 'bg-gray-500/20 text-gray-500 border-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wrench className="text-primary" /> Maintenance Logs
        </h1>
        <button className="bg-primary text-gray-900 font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-400 transition">
          <Plus size={20} /> Log Maintenance
        </button>
      </div>

      <div className="bg-darkCard border border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-gray-400 text-sm border-b border-gray-700">
              <th className="p-4 font-medium">Vehicle</th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Cost</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr><td colSpan={6} className="p-4 text-center text-gray-500">Loading logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center text-gray-500">No maintenance records found.</td></tr>
            ) : (
              logs.map((l: any) => (
                <tr key={l.id} className="hover:bg-gray-800/50 transition">
                  <td className="p-4 text-white font-medium">{l.vehicle?.registration}</td>
                  <td className="p-4 text-gray-300">{l.description}</td>
                  <td className="p-4 text-gray-300">{new Date(l.date).toLocaleDateString()}</td>
                  <td className="p-4 text-gray-300">${l.cost}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${statusColor(l.status)}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {l.status === 'OPEN' && (
                      <button className="text-green-400 hover:text-green-300 mr-3" title="Close Log"><CheckCircle size={18} /></button>
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
