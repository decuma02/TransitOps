import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export const Expenses = () => {
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
      const res = await axios.get('/api/fuel');
      setLogs(res.data);
    } catch (error) {
      console.error('Error fetching fuel logs', error);
    } finally {
      setLoading(false);
    }
  };

  const dummyFuelLogs = [
    { id: 1, vehicle: 'VAN-05', date: '05 Jul 2026', liters: '42 L', cost: '3,150' },
    { id: 2, vehicle: 'TRUCK-11', date: '06 Jul 2026', liters: '110 L', cost: '8,400' },
    { id: 3, vehicle: 'MINI-03', date: '06 Jul 2026', liters: '28 L', cost: '2,050' },
  ];

  const dummyExpenses = [
    { trip: 'TR001', vehicle: 'VAN-05', toll: '120', other: '0', maint: '0', status: 'Available', statusColor: 'bg-statusGreen/90 text-[#121212]' },
    { trip: 'TR002', vehicle: 'TRK-12', toll: '340', other: '150', maint: '18,000', status: 'Completed', statusColor: 'bg-statusGreen/90 text-[#121212]' },
  ];

  const displayLogs = logs.length > 0 ? logs : dummyFuelLogs;

  return (
    <div className="flex flex-col h-full w-full space-y-10">
      
      {/* Fuel Logs Section */}
      <div>
        <div className="flex justify-between items-end border-b border-wireBorder pb-4 mb-4">
          <h3 className="text-wireMuted text-xs tracking-widest font-semibold uppercase">Fuel Logs</h3>
          <div className="flex space-x-4">
            <button className="bg-primary/90 hover:bg-primary text-[#121212] transition-colors px-6 py-1.5 rounded-full text-sm font-semibold shadow-md flex items-center gap-1">
              + Log Fuel
            </button>
            <button className="bg-transparent border border-primary text-primary hover:bg-primary/10 transition-colors px-6 py-1.5 rounded-full text-sm font-semibold shadow-sm flex items-center gap-1">
              + Add Expense
            </button>
          </div>
        </div>

        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="text-wireMuted text-[10px] uppercase tracking-wider border-b border-wireBorder">
              <th className="py-3 font-normal">Vehicle</th>
              <th className="py-3 font-normal">Date</th>
              <th className="py-3 font-normal">Liters</th>
              <th className="py-3 font-normal">Fuel Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wireBorder">
            {displayLogs.map((l: any, idx: number) => (
              <tr key={idx} className="text-wireText hover:bg-white/5 transition-colors">
                <td className="py-4 font-medium">{l.vehicleId || l.vehicle}</td>
                <td className="py-4 text-wireMuted">{l.date ? (typeof l.date === 'string' ? l.date : new Date(l.date).toLocaleDateString()) : ''}</td>
                <td className="py-4 text-wireMuted">{l.liters}</td>
                <td className="py-4 text-wireMuted">{l.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Other Expenses Section */}
      <div>
        <div className="border-b border-wireBorder pb-4 mb-4">
          <h3 className="text-wireMuted text-xs tracking-widest font-semibold uppercase">Other Expenses (Toll / Misc)</h3>
        </div>

        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="text-wireMuted text-[10px] uppercase tracking-wider border-b border-wireBorder">
              <th className="py-3 font-normal">Trip</th>
              <th className="py-3 font-normal">Vehicle</th>
              <th className="py-3 font-normal">Toll</th>
              <th className="py-3 font-normal">Other</th>
              <th className="py-3 font-normal">Maint. (Linked)</th>
              <th className="py-3 font-normal">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wireBorder border-b border-wireBorder">
            {dummyExpenses.map((e, idx) => (
              <tr key={idx} className="text-wireText hover:bg-white/5 transition-colors">
                <td className="py-4 text-wireMuted">{e.trip}</td>
                <td className="py-4 font-medium">{e.vehicle}</td>
                <td className="py-4 text-wireMuted">{e.toll}</td>
                <td className="py-4 text-wireMuted">{e.other}</td>
                <td className="py-4 text-wireMuted">{e.maint}</td>
                <td className="py-4">
                  <span className={`px-4 py-1 text-xs font-semibold rounded shadow-sm ${e.statusColor}`}>
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex justify-between items-center mt-6">
          <h3 className="text-wireText text-xs tracking-widest uppercase">Total Operational Cost (Auto) = Fuel + Maintenance</h3>
          <span className="text-primary text-xl font-medium tracking-wide">34,070</span>
        </div>
      </div>

    </div>
  );
};
