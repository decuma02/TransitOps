import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

export const Analytics = () => {
  const { user } = useAuth();
  const isDemo = user?.email?.startsWith('demo_');

  const [data, setData] = useState([]);

  if (!isDemo) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-wireMuted mt-20">
        <p className="text-xl mb-2 text-wireText">Welcome to TransitOps, {user?.name}!</p>
        <p className="text-sm">There is no data available yet. Please use a demo account to view the mock UI.</p>
      </div>
    );
  }

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

  const handleExportPDF = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/analytics/export-pdf', {
        responseType: 'blob',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'TransitOps_Analytics_Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert('Failed to export PDF (Backend might be down)');
    }
  };

  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 5000 },
    { name: 'Mar', revenue: 4500 },
    { name: 'Apr', revenue: 6000 },
    { name: 'May', revenue: 5500 },
    { name: 'Jun', revenue: 7000 },
    { name: 'Jul', revenue: 6500 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Analytics Dashboard</h2>
        <button 
          onClick={handleExportPDF}
          className="bg-primary/90 hover:bg-primary text-[#121212] text-xs font-semibold px-4 py-2 rounded-md transition-colors flex items-center gap-2"
        >
          Export to PDF
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="border-t-2 border-statusBlue bg-transparent border border-wireBorder p-4">
          <h3 className="text-wireMuted text-[10px] uppercase tracking-wider mb-2">Fuel Efficiency</h3>
          <p className="text-3xl text-wireText font-light">8.4 <span className="text-xl">km/l</span></p>
        </div>
        <div className="border-t-2 border-statusGreen bg-transparent border border-wireBorder p-4">
          <h3 className="text-wireMuted text-[10px] uppercase tracking-wider mb-2">Fleet Utilization</h3>
          <p className="text-3xl text-wireText font-light">81%</p>
        </div>
        <div className="border-t-2 border-primary bg-transparent border border-wireBorder p-4">
          <h3 className="text-wireMuted text-[10px] uppercase tracking-wider mb-2">Operational Cost</h3>
          <p className="text-3xl text-wireText font-light">34,070</p>
        </div>
        <div className="border-t-2 border-statusGreen bg-transparent border border-wireBorder p-4">
          <h3 className="text-wireMuted text-[10px] uppercase tracking-wider mb-2">Vehicle ROI</h3>
          <p className="text-3xl text-wireText font-light">14.2%</p>
        </div>
      </div>
      
      <p className="text-wireMuted text-xs italic">ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost</p>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
        <div>
          <h3 className="text-wireMuted text-xs tracking-widest font-semibold mb-6 uppercase">Monthly Revenue</h3>
          <div className="h-48 border-b border-wireBorder pb-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barCategoryGap="5%">
                <Tooltip cursor={{fill: '#ffffff0a'}} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                <Bar dataKey="revenue" fill="#3b82f6" stroke="#2563eb" strokeWidth={1} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-wireMuted text-xs tracking-widest font-semibold mb-6 uppercase">Top Costliest Vehicles</h3>
          <div className="space-y-6 mt-4">
            <div className="flex items-center space-x-4">
              <span className="text-xs text-wireMuted uppercase tracking-wider w-20">TRUCK-11</span>
              <div className="flex-1 bg-darkCard h-4 overflow-hidden flex">
                <div className="bg-statusRed h-full" style={{ width: '70%' }}></div>
                <div className="bg-wireBorder h-full" style={{ width: '10%' }}></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-wireMuted uppercase tracking-wider w-20">MINI-03</span>
              <div className="flex-1 bg-darkCard h-4 overflow-hidden flex">
                <div className="bg-primary h-full" style={{ width: '30%' }}></div>
                <div className="bg-wireBorder h-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-wireMuted uppercase tracking-wider w-20">VAN-05</span>
              <div className="flex-1 bg-darkCard h-4 overflow-hidden flex">
                <div className="bg-statusBlue h-full" style={{ width: '10%' }}></div>
                <div className="bg-wireBorder h-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
