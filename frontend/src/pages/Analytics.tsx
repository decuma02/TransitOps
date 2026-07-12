import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart2, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export const Analytics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/analytics/charts');
      setData(res.data);
    } catch (error) {
      console.error('Error fetching analytics', error);
    }
  };

  const handleExportPDF = () => {
    window.print(); // Simple PDF export for Hackathon using browser's print-to-PDF
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart2 className="text-primary" /> Reports & Analytics
        </h1>
        <button onClick={handleExportPDF} className="bg-gray-700 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition">
          <Download size={20} /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-darkCard border border-gray-700 rounded-xl p-6 h-96">
          <h2 className="text-lg font-semibold text-white mb-4">Operational Cost vs Fuel</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Legend />
              <Bar dataKey="cost" fill="#facc15" name="Maintenance Cost" />
              <Bar dataKey="fuel" fill="#3b82f6" name="Fuel Cost" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-darkCard border border-gray-700 rounded-xl p-6 h-96">
          <h2 className="text-lg font-semibold text-white mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
