import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export const Maintenance = () => {
  const { user } = useAuth();
  const isDemo = user?.email?.startsWith('demo_');

  const [logs, setLogs] = useState([]);
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
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/api/maintenance');
      setLogs(res.data);
    } catch (error) {
      console.error('Error fetching maintenance', error);
    } finally {
      setLoading(false);
    }
  };

  const dummyLogs = [
    { id: 1, vehicle: 'VAN-05', service: 'Oil Change', cost: '2,500', status: 'In Shop' },
    { id: 2, vehicle: 'TRUCK-11', service: 'Engine Repair', cost: '18,000', status: 'Completed' },
    { id: 3, vehicle: 'MINI-03', service: 'Tyre Replace', cost: '6,200', status: 'In Shop' },
  ];

  const displayLogs = logs.length > 0 ? logs : dummyLogs; // Fallback to dummy data for visual

  return (
    <div className="flex h-full w-full">
      {/* Left Column: Form */}
      <div className="w-1/3 pr-8 border-r border-wireBorder flex flex-col space-y-6">
        <div>
          <h3 className="text-wireMuted text-xs tracking-widest font-semibold mb-4 uppercase">Log Service Record</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-wireMuted text-[10px] uppercase tracking-wider mb-1">Vehicle</label>
              <input
                type="text"
                placeholder="VAN-05"
                className="w-full bg-transparent border border-wireBorder rounded-md px-3 py-2 text-sm text-wireText focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-wireMuted text-[10px] uppercase tracking-wider mb-1">Service Type</label>
              <input
                type="text"
                placeholder="Oil Change"
                className="w-full bg-transparent border border-wireBorder rounded-md px-3 py-2 text-sm text-wireText focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-wireMuted text-[10px] uppercase tracking-wider mb-1">Cost</label>
              <input
                type="text"
                placeholder="2500"
                className="w-full bg-transparent border border-wireBorder rounded-md px-3 py-2 text-sm text-wireText focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-wireMuted text-[10px] uppercase tracking-wider mb-1">Date</label>
              <input
                type="text"
                placeholder="07/07/2026"
                className="w-full bg-transparent border border-wireBorder rounded-md px-3 py-2 text-sm text-wireText focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-wireMuted text-[10px] uppercase tracking-wider mb-1">Status</label>
              <input
                type="text"
                placeholder="Active"
                className="w-full bg-transparent border border-wireBorder rounded-md px-3 py-2 text-sm text-wireText focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>
        <div>
          <button className="bg-primary/90 text-darkBg hover:bg-primary transition-colors w-full py-2 rounded-lg text-sm font-semibold shadow-md">
            Save
          </button>
        </div>

        <div className="pt-6 space-y-4">
          <div className="flex items-center text-sm">
            <span className="text-statusGreen w-20 font-medium">Available</span>
            <div className="flex-1 border-t border-wireMuted border-dashed mx-2 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-wireMuted text-[10px]">creating active record</div>
              <div className="absolute right-0 -top-1.5 border-t border-r border-wireMuted w-2 h-2 transform rotate-45"></div>
            </div>
            <span className="text-primary w-20 text-right font-medium">In Shop</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-primary w-20 font-medium">In Shop</span>
            <div className="flex-1 border-t border-wireMuted border-dashed mx-2 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-wireMuted text-[10px]">closing record (not retired)</div>
              <div className="absolute right-0 -top-1.5 border-t border-r border-wireMuted w-2 h-2 transform rotate-45"></div>
            </div>
            <span className="text-statusGreen w-20 text-right font-medium">Available</span>
          </div>
          <p className="text-primary text-xs mt-4 font-serif italic">Note: In Shop vehicles are removed from the dispatch pool.</p>
        </div>
      </div>

      {/* Right Column: Table */}
      <div className="w-2/3 pl-8">
        <h3 className="text-wireMuted text-xs tracking-widest font-semibold mb-4 uppercase">Service Log</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="text-wireMuted text-[10px] uppercase tracking-wider border-b border-wireBorder">
              <th className="py-3 font-normal">Vehicle</th>
              <th className="py-3 font-normal">Service</th>
              <th className="py-3 font-normal">Cost</th>
              <th className="py-3 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wireBorder">
            {displayLogs.map((l: any, idx: number) => (
              <tr key={idx} className="text-wireText hover:bg-white/5 transition-colors">
                <td className="py-4 font-medium">{l.vehicle?.registration || l.vehicle}</td>
                <td className="py-4 text-wireMuted">{l.description || l.service}</td>
                <td className="py-4 text-wireMuted">{l.cost}</td>
                <td className="py-4">
                  {(l.status === 'In Shop' || l.status === 'OPEN') ? (
                    <span className="px-6 py-1 bg-[#d97706]/90 text-[#121212] font-semibold rounded shadow-sm text-xs">In Shop</span>
                  ) : (
                    <span className="px-4 py-1 bg-statusGreen/90 text-[#121212] font-semibold rounded shadow-sm text-xs">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
