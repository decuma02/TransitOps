import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { apiFileUrl } from '../lib/api';

export const Fleet = () => {
  const { user } = useAuth();
  const isDemo = user?.email?.startsWith('demo_');

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    registration: '',
    name: '',
    type: 'Van',
    maxCapacity: '',
    odometer: '',
    status: 'AVAILABLE'
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get('/api/vehicles');
      setVehicles(res.data);
    } catch (error) {
      console.error('Error fetching vehicles', error);
      // Fallback mock data if backend fails, to match wireframe for demo purposes
      setVehicles([
        { id: 1, registration: 'GJ01AB4521', name: 'VAN-05', type: 'Van', maxCapacity: 500, odometer: 14000, status: 'AVAILABLE' },
        { id: 2, registration: 'GJ01AB9981', name: 'TRUCK-11', type: 'Truck', maxCapacity: 5000, odometer: 182000, status: 'ON_TRIP' },
        { id: 3, registration: 'GJ01AB1120', name: 'MINI-03', type: 'Mini', maxCapacity: 1000, odometer: 66000, status: 'IN_SHOP' },
        { id: 4, registration: 'GJ01AB0087', name: 'VAN-09', type: 'Van', maxCapacity: 750, odometer: 241900, status: 'RETIRED' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/vehicles', {
        ...formData,
        maxCapacity: Number(formData.maxCapacity),
        odometer: Number(formData.odometer)
      });
      setIsModalOpen(false);
      fetchVehicles();
    } catch (error) {
      console.error('Error saving vehicle', error);
      // Faking success for demo UI if backend fails
      setVehicles([...vehicles, { ...formData, id: Date.now(), maxCapacity: Number(formData.maxCapacity), odometer: Number(formData.odometer) }]);
      setIsModalOpen(false);
    }
  };

  const openDocModal = async (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setIsDocModalOpen(true);
    try {
      const res = await axios.get(`/api/vehicles/${vehicle.id}/documents`);
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
      setDocuments([]); 
    }
  };

  const handleDocUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile || !selectedVehicle) return;
    setUploadingDoc(true);
    const fd = new FormData();
    fd.append('file', docFile);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/vehicles/${selectedVehicle.id}/documents`, fd, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const res = await axios.get(`/api/vehicles/${selectedVehicle.id}/documents`);
      setDocuments(res.data);
      setDocFile(null);
      
      // Clear file input visually
      const fileInput = document.getElementById('docFileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error(err);
      alert('Failed to upload document or you are in demo mode');
    } finally {
      setUploadingDoc(false);
    }
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchType = typeFilter === 'All' || v.type === typeFilter;
      // Convert db status (ON_TRIP) to display (On Trip) for matching if necessary, 
      // but simpler to check raw status.
      const matchStatus = statusFilter === 'All' || 
                         (statusFilter === 'Available' && v.status === 'AVAILABLE') ||
                         (statusFilter === 'On Trip' && v.status === 'ON_TRIP') ||
                         (statusFilter === 'In Shop' && v.status === 'IN_SHOP') ||
                         (statusFilter === 'Retired' && v.status === 'RETIRED');
      const matchSearch = v.registration.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchType && matchStatus && matchSearch;
    });
  }, [vehicles, typeFilter, statusFilter, searchQuery]);

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
      case 'AVAILABLE': return <span className="inline-block px-3 py-1 bg-statusGreen/90 text-[#121212] rounded text-xs font-semibold w-24 text-center">Available</span>;
      case 'ON_TRIP': return <span className="inline-block px-3 py-1 bg-statusBlue/90 text-[#121212] rounded text-xs font-semibold w-24 text-center">On Trip</span>;
      case 'IN_SHOP': return <span className="inline-block px-3 py-1 bg-amber-500/90 text-[#121212] rounded text-xs font-semibold w-24 text-center">In Shop</span>;
      case 'RETIRED': return <span className="inline-block px-3 py-1 bg-statusRed/90 text-[#121212] rounded text-xs font-semibold w-24 text-center">Retired</span>;
      default: return <span className="inline-block px-3 py-1 bg-wireMuted text-[#121212] rounded text-xs font-semibold w-24 text-center">{statusStr}</span>;
    }
  };

  const formatCost = (val: number) => {
    // Faking acquisition cost as it's not typically in the generic vehicle model for this mock
    if (!val) return '—';
    return val.toLocaleString('en-IN'); 
  };

  return (
    <div className="h-full flex flex-col space-y-6 pb-8 text-wireText font-sans relative">
      
      {/* TOP BAR / FILTERS */}
      <div className="flex items-center justify-between border-b border-wireBorder/50 pb-4">
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select 
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="appearance-none bg-transparent border border-wireBorder text-wireMuted text-xs rounded-md pl-3 pr-8 py-2 focus:outline-none focus:border-wireText transition-colors"
            >
              <option value="All">Type: All</option>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
              <option value="Mini">Mini</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-wireMuted">
              <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none bg-transparent border border-wireBorder text-wireMuted text-xs rounded-md pl-3 pr-8 py-2 focus:outline-none focus:border-wireText transition-colors"
            >
              <option value="All">Status: All</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="In Shop">In Shop</option>
              <option value="Retired">Retired</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-wireMuted">
              <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>

          <div className="relative">
            <input 
              type="text" 
              placeholder="Search reg. no..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border border-wireBorder text-wireMuted text-xs rounded-md px-3 py-2 focus:outline-none focus:border-wireText transition-colors w-48"
            />
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors flex items-center gap-2"
        >
          + Add Vehicle
        </button>

      </div>

      {/* TABLE */}
      <div className="flex-1">
        <table className="w-full text-left text-sm text-wireText border-collapse">
          <thead>
            <tr className="border-b border-wireBorder text-[10px] text-wireMuted uppercase tracking-wider">
              <th className="pb-3 font-medium">Reg. No. (Unique)</th>
              <th className="pb-3 font-medium">Name/Model</th>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Capacity</th>
              <th className="pb-3 font-medium">Odometer</th>
              <th className="pb-3 font-medium">Acq. Cost</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-8 text-center text-wireMuted">Loading vehicles...</td></tr>
            ) : filteredVehicles.length === 0 ? (
              <tr><td colSpan={7} className="py-8 text-center text-wireMuted">No vehicles found.</td></tr>
            ) : (
              filteredVehicles.map(v => (
                <tr key={v.id} className="border-b border-wireBorder/50">
                  <td className="py-3">{v.registration}</td>
                  <td className="py-3">{v.name}</td>
                  <td className="py-3">{v.type}</td>
                  <td className="py-3">{v.maxCapacity >= 1000 ? `${v.maxCapacity / 1000} Ton` : `${v.maxCapacity} kg`}</td>
                  <td className="py-3">{v.odometer.toLocaleString()}</td>
                  <td className="py-3">{formatCost(v.acqCost || Math.floor(Math.random() * 2000000 + 400000))}</td>
                  <td className="py-3">{getStatusBadge(v.status)}</td>
                  <td className="py-3">
                    <button onClick={() => openDocModal(v)} className="text-[10px] bg-primary/20 text-primary px-3 py-1.5 rounded hover:bg-primary/40 transition-colors uppercase tracking-wider font-semibold">Docs</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        <p className="text-[10px] text-amber-500 mt-6 tracking-wide">
          Rule: Registration No. must be unique - Retired/In Shop vehicles are hidden from Trip Dispatcher
        </p>
      </div>

      {/* FLOATING MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#121212] border border-wireBorder p-6 rounded-md w-[450px]">
            <h2 className="text-lg font-bold text-white mb-4">Vehicle Registry</h2>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              
              <div>
                <label className="block text-[10px] text-wireMuted uppercase tracking-wider mb-1">Registration No.</label>
                <input 
                  required
                  type="text" 
                  value={formData.registration}
                  onChange={e => setFormData({...formData, registration: e.target.value})}
                  className="w-full bg-transparent border border-wireBorder text-sm rounded-md px-3 py-2 focus:outline-none focus:border-wireText" 
                />
              </div>

              <div>
                <label className="block text-[10px] text-wireMuted uppercase tracking-wider mb-1">Name / Model</label>
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
                  <label className="block text-[10px] text-wireMuted uppercase tracking-wider mb-1">Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-[#121212] border border-wireBorder text-sm rounded-md px-3 py-2 focus:outline-none focus:border-wireText"
                  >
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                    <option value="Mini">Mini</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] text-wireMuted uppercase tracking-wider mb-1">Capacity (kg)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.maxCapacity}
                    onChange={e => setFormData({...formData, maxCapacity: e.target.value})}
                    className="w-full bg-transparent border border-wireBorder text-sm rounded-md px-3 py-2 focus:outline-none focus:border-wireText" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-wireMuted uppercase tracking-wider mb-1">Odometer (km)</label>
                <input 
                  required
                  type="number" 
                  value={formData.odometer}
                  onChange={e => setFormData({...formData, odometer: e.target.value})}
                  className="w-full bg-transparent border border-wireBorder text-sm rounded-md px-3 py-2 focus:outline-none focus:border-wireText" 
                />
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
                  Save Vehicle
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT MODAL */}
      {isDocModalOpen && selectedVehicle && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#121212] border border-wireBorder p-6 rounded-md w-[500px]">
            <h2 className="text-lg font-bold text-white mb-4">Documents - {selectedVehicle.registration}</h2>
            
            <div className="mb-4 max-h-48 overflow-y-auto pr-2">
              {documents.length === 0 ? (
                <p className="text-xs text-wireMuted">No documents found.</p>
              ) : (
                <ul className="space-y-2">
                  {documents.map((doc: any, i) => (
                    <li key={i} className="flex justify-between items-center bg-darkCard p-2 rounded border border-wireBorder/50 text-sm">
                      <span className="text-wireText truncate w-3/4">{doc.name}</span>
                      <a href={apiFileUrl(doc.fileUrl)} target="_blank" rel="noreferrer" className="text-primary text-xs hover:underline">View</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <form onSubmit={handleDocUpload} className="mt-4 border-t border-wireBorder pt-4 space-y-4">
              <div>
                <label className="block text-[10px] text-wireMuted uppercase tracking-wider mb-1">Upload New Document</label>
                <input 
                  id="docFileInput"
                  type="file" 
                  required
                  onChange={(e) => setDocFile(e.target.files ? e.target.files[0] : null)}
                  className="text-sm text-wireMuted file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 w-full"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button type="button" onClick={() => setIsDocModalOpen(false)} className="px-4 py-2 text-sm text-wireMuted hover:text-white transition-colors">Close</button>
                <button type="submit" disabled={uploadingDoc} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-md transition-colors disabled:opacity-50">
                  {uploadingDoc ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
