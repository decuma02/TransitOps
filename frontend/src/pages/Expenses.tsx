import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Plus } from 'lucide-react';

export const Expenses = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/fuel');
      setLogs(res.data);
    } catch (error) {
      console.error('Error fetching fuel logs', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="text-primary" /> Fuel & Expenses
        </h1>
        <div className="space-x-3">
          <button className="bg-primary text-gray-900 font-bold px-4 py-2 rounded-lg gap-2 hover:bg-yellow-400 transition inline-flex items-center">
            <Plus size={20} /> Log Fuel
          </button>
        </div>
      </div>

      <div className="bg-darkCard border border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-gray-400 text-sm border-b border-gray-700">
              <th className="p-4 font-medium">Vehicle ID</th>
              <th className="p-4 font-medium">Liters</th>
              <th className="p-4 font-medium">Cost</th>
              <th className="p-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">Loading fuel logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">No fuel records found.</td></tr>
            ) : (
              logs.map((l: any) => (
                <tr key={l.id} className="hover:bg-gray-800/50 transition">
                  <td className="p-4 text-white font-medium">{l.vehicleId}</td>
                  <td className="p-4 text-gray-300">{l.liters} L</td>
                  <td className="p-4 text-gray-300">${l.cost}</td>
                  <td className="p-4 text-gray-300">{new Date(l.date).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
