import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export const Drivers = () => {
  const { user } = useAuth();
  const isDemo = user?.email?.startsWith('demo_');

  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sendingReminders, setSendingReminders] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    licenseNo: '',
    category: 'LMV',
    expiry: '',
    contact: '',
    tripCompl: '100%',
    safety: 'Available',
    status: 'Available'
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await axios.get('/api/drivers');
      setDrivers(res.data);
    } catch (error) {
      console.error('Error fetching drivers', error);
      // Fallback mock data if backend fails, to match wireframe for demo purposes
      setDrivers([
        { id: 1, name: 'Alex', licenseNo: 'DL-88213', category: 'LMV', expiry: '12/2028', contact: '98765xxxxx', tripCompl: '96%', safety: 'Available', status: 'Available' },
        { id: 2, name: 'John', licenseNo: 'DL-44120', category: 'HMV', expiry: '03/2025 EXPIRED', contact: '98220xxxxx', tripCompl: '81%', safety: 'Suspended', status: 'Suspended' },
        { id: 3, name: 'Priya', licenseNo: 'DL-77031', category: 'LMV', expiry: '08/2027', contact: '99110xxxxx', tripCompl: '99%', safety: 'On Trip', status: 'On Trip' },
        { id: 4, name: 'Suresh', licenseNo: 'DL-90045', category: 'HMV', expiry: '01/2027', contact: '97440xxxxx', tripCompl: '88%', safety: 'Available', status: 'Off Duty' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Trying to map to generic backend if available, otherwise just UI
      await axios.post('/api/drivers', {
        name: formData.name,
        licenseNumber: formData.licenseNo,
        licenseCategory: formData.category,
        licenseExpiry: new Date(formData.expiry).toISOString(),
        safetyScore: parseInt(formData.tripCompl),
        status: formData.status.toUpperCase().replace(' ', '_')
      });
      setIsModalOpen(false);
      fetchDrivers();
    } catch (error) {
      console.error('Error saving driver', error);
      // Faking success for demo UI if backend fails
      setDrivers([...drivers, { ...formData, id: Date.now() }]);
      setIsModalOpen(false);
    }
  };

  const handleSendReminders = async () => {
    setSendingReminders(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/drivers/reminders', {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert(res.data.message || 'Reminders sent successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to send reminders (Backend might be down)');
    } finally {
      setSendingReminders(false);
    }
  };

  if (!isDemo) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-wireMuted mt-20">
        <p className="text-xl mb-2 text-wireText">Welcome to TransitOps, {user?.name}!</p>
        <p className="text-sm">There is no data available yet. Please use a demo account to view the mock UI.</p>
      </div>
    );
  }

  const getStatusBadge = (statusStr: string) => {
    switch (statusStr) {
      case 'Available': return <span className="inline-block px-3 py-1 bg-statusGreen/90 text-[#121212] rounded text-xs font-semibold w-24 text-center">Available</span>;
      case 'On Trip': return <span className="inline-block px-3 py-1 bg-statusBlue/90 text-[#121212] rounded text-xs font-semibold w-24 text-center">On Trip</span>;
      case 'Suspended': return <span className="inline-block px-3 py-1 bg-amber-500/90 text-[#121212] rounded text-xs font-semibold w-24 text-center">Suspended</span>;
      case 'Off Duty': return <span className="inline-block px-3 py-1 bg-wireMuted text-[#121212] rounded text-xs font-semibold w-24 text-center">Off Duty</span>;
      default: return <span className="inline-block px-3 py-1 bg-wireMuted text-[#121212] rounded text-xs font-semibold w-24 text-center">{statusStr}</span>;
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 pb-8 text-wireText font-sans relative">
      
      {/* TOP BAR / FILTERS */}
      <div className="flex justify-end space-x-4 border-b border-wireBorder/50 pb-4">
        <button 
          onClick={handleSendReminders}
          disabled={sendingReminders}
          className="bg-primary/20 text-primary hover:bg-primary/30 text-xs font-semibold px-4 py-2 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {sendingReminders ? 'Sending...' : 'Send Reminders'}
        </button>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors flex items-center gap-2"
        >
          + Add Driver
        </button>
      </div>

      {/* TABLE */}
      <div className="flex-1">
        <table className="w-full text-left text-sm text-wireText border-collapse">
          <thead>
            <tr className="border-b border-wireBorder text-[10px] text-wireMuted uppercase tracking-wider">
              <th className="pb-3 font-medium">Driver</th>
              <th className="pb-3 font-medium">License No.</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Expiry</th>
              <th className="pb-3 font-medium">Contact</th>
              <th className="pb-3 font-medium">Trip Compl.</th>
              <th className="pb-3 font-medium">Safety</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="py-8 text-center text-wireMuted">Loading drivers...</td></tr>
            ) : drivers.length === 0 ? (
              <tr><td colSpan={8} className="py-8 text-center text-wireMuted">No drivers found.</td></tr>
            ) : (
              drivers.map((d: any) => (
                <tr key={d.id} className="border-b border-wireBorder/50">
                  <td className="py-3">{d.name}</td>
                  <td className="py-3">{d.licenseNo || d.licenseNumber}</td>
                  <td className="py-3">{d.category || d.licenseCategory}</td>
                  <td className={`py-3 ${d.expiry?.includes('EXPIRED') ? 'text-white' : ''}`}>{d.expiry || new Date(d.licenseExpiry).toLocaleDateString()}</td>
                  <td className="py-3">{d.contact || '98xxxxx'}</td>
                  <td className="py-3">{d.tripCompl || `${d.safetyScore}%`}</td>
                  <td className="py-3">{getStatusBadge(d.safety || 'Available')}</td>
                  <td className="py-3">{getStatusBadge(d.status === 'ON_TRIP' ? 'On Trip' : d.status === 'SUSPENDED' ? 'Suspended' : d.status === 'OFF_DUTY' ? 'Off Duty' : d.status === 'AVAILABLE' ? 'Available' : d.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Legend */}
        <div className="mt-8">
          <p className="text-[10px] text-wireMuted uppercase tracking-widest font-semibold mb-3">Toggle Status</p>
          <div className="flex space-x-3 mb-4">
            <span className="inline-block px-3 py-1 bg-statusGreen text-[#121212] rounded text-xs font-semibold cursor-pointer">Available</span>
            <span className="inline-block px-3 py-1 bg-statusBlue text-[#121212] rounded text-xs font-semibold cursor-pointer">On Trip</span>
            <span className="inline-block px-3 py-1 bg-wireMuted text-[#121212] rounded text-xs font-semibold cursor-pointer">Off Duty</span>
            <span className="inline-block px-3 py-1 bg-amber-500 text-[#121212] rounded text-xs font-semibold cursor-pointer">Suspended</span>
          </div>
          <p className="text-[10px] text-amber-500 tracking-wide">
            Rule: Expired license or Suspended status &rarr; blocked from trip assignment
          </p>
        </div>
      </div>

      {/* FLOATING MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#121212] border border-wireBorder p-6 rounded-md w-[450px]">
            <h2 className="text-lg font-bold text-white mb-4">Add Driver</h2>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              
              <div>
                <label className="block text-[10px] text-wireMuted uppercase tracking-wider mb-1">Driver Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-transparent border border-wireBorder text-sm rounded-md px-3 py-2 focus:outline-none focus:border-wireText" 
                />
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-[10px] text-wireMuted uppercase tracking-wider mb-1">License No.</label>
                  <input 
                    required
                    type="text" 
                    value={formData.licenseNo}
                    onChange={e => setFormData({...formData, licenseNo: e.target.value})}
                    className="w-full bg-transparent border border-wireBorder text-sm rounded-md px-3 py-2 focus:outline-none focus:border-wireText" 
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] text-wireMuted uppercase tracking-wider mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-[#121212] border border-wireBorder text-sm rounded-md px-3 py-2 focus:outline-none focus:border-wireText"
                  >
                    <option value="LMV">LMV</option>
                    <option value="HMV">HMV</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-[10px] text-wireMuted uppercase tracking-wider mb-1">Expiry</label>
                  <input 
                    required
                    type="text" 
                    placeholder="MM/YYYY"
                    value={formData.expiry}
                    onChange={e => setFormData({...formData, expiry: e.target.value})}
                    className="w-full bg-transparent border border-wireBorder text-sm rounded-md px-3 py-2 focus:outline-none focus:border-wireText" 
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] text-wireMuted uppercase tracking-wider mb-1">Contact</label>
                  <input 
                    required
                    type="text" 
                    value={formData.contact}
                    onChange={e => setFormData({...formData, contact: e.target.value})}
                    className="w-full bg-transparent border border-wireBorder text-sm rounded-md px-3 py-2 focus:outline-none focus:border-wireText" 
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-wireMuted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-md transition-colors"
                >
                  Save Driver
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
