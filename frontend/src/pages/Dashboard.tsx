import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Mock Data
const MOCK_TRIPS = [
  { id: 'TR001', vehicle: 'VAN-05', driver: 'Alex', status: 'On Trip', eta: '45 min', type: 'Van', region: 'North' },
  { id: 'TR002', vehicle: 'TRK-12', driver: 'John', status: 'Completed', eta: '-', type: 'Truck', region: 'South' },
  { id: 'TR003', vehicle: 'MINI-08', driver: 'Priya', status: 'Dispatched', eta: '1h 10m', type: 'Mini-van', region: 'North' },
  { id: 'TR006', vehicle: '-', driver: '-', status: 'Draft', eta: 'Awaiting vehicle', type: 'Truck', region: 'North' },
  { id: 'TR008', vehicle: 'VAN-11', driver: 'Rahul', status: 'Completed', eta: '-', type: 'Van', region: 'South' },
  { id: 'TR009', vehicle: 'TRK-02', driver: 'Amit', status: 'Maintenance', eta: '-', type: 'Truck', region: 'North' },
  { id: 'TR010', vehicle: 'MINI-01', driver: 'Neha', status: 'On Trip', eta: '20 min', type: 'Mini-van', region: 'South' },
];

export const Dashboard = () => {
  const { user } = useAuth();
  const isDemo = user?.email?.startsWith('demo_');

  // Filter States
  const [vehicleType, setVehicleType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [region, setRegion] = useState('All');

  const filteredTrips = useMemo(() => {
    return MOCK_TRIPS.filter(trip => {
      const matchType = vehicleType === 'All' || trip.type === vehicleType;
      const matchStatus = filterStatus === 'All' || (filterStatus === 'Active' && ['On Trip', 'Dispatched'].includes(trip.status)) || (filterStatus === 'Maintenance' && trip.status === 'Maintenance');
      const matchRegion = region === 'All' || trip.region === region;
      return matchType && matchStatus && matchRegion;
    });
  }, [vehicleType, filterStatus, region]);

  // Simulate KPI changes based on filters
  const multiplier = (vehicleType === 'All' ? 1 : 0.4) * (filterStatus === 'All' ? 1 : 0.7) * (region === 'All' ? 1 : 0.5);
  const kpis = {
    active: Math.round(53 * multiplier),
    available: Math.round(42 * multiplier),
    maintenance: Math.round(5 * multiplier),
    activeTrips: Math.round(18 * multiplier),
    pending: Math.round(9 * multiplier),
    drivers: Math.round(26 * multiplier),
    util: Math.min(100, Math.round(81 * multiplier + (Math.random() * 5)))
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
      case 'On Trip': return <span className="inline-block px-3 py-1 bg-statusBlue/90 text-[#121212] rounded text-xs font-semibold">On Trip</span>;
      case 'Completed': return <span className="inline-block px-3 py-1 bg-statusGreen/90 text-[#121212] rounded text-xs font-semibold">Completed</span>;
      case 'Dispatched': return <span className="inline-block px-3 py-1 bg-sky-400/90 text-[#121212] rounded text-xs font-semibold">Dispatched</span>;
      case 'Maintenance': return <span className="inline-block px-3 py-1 bg-amber-500/90 text-[#121212] rounded text-xs font-semibold">Maintenance</span>;
      default: return <span className="inline-block px-3 py-1 bg-wireMuted text-[#121212] rounded text-xs font-semibold">{statusStr}</span>;
    }
  };

  return (
    <div className="w-full space-y-8 pb-8 text-wireText font-sans">
      
      {/* FILTERS SECTION */}
      <div>
        <h3 className="text-[10px] text-wireMuted uppercase tracking-widest font-semibold mb-3">Filters</h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select 
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="appearance-none bg-transparent border border-wireBorder text-wireMuted text-xs rounded-md pl-3 pr-8 py-2 focus:outline-none focus:border-wireText transition-colors"
            >
              <option value="All">Vehicle Type: All</option>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
              <option value="Mini-van">Mini-van</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-wireMuted">
              <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          
          <div className="relative">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-transparent border border-wireBorder text-wireMuted text-xs rounded-md pl-3 pr-8 py-2 focus:outline-none focus:border-wireText transition-colors"
            >
              <option value="All">Status: All</option>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-wireMuted">
              <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          
          <div className="relative">
            <select 
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="appearance-none bg-transparent border border-wireBorder text-wireMuted text-xs rounded-md pl-3 pr-8 py-2 focus:outline-none focus:border-wireText transition-colors"
            >
              <option value="All">Region: All</option>
              <option value="North">North</option>
              <option value="South">South</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-wireMuted">
              <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* KPI CARDS ROW */}
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* Card 1 */}
        {['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'].includes(user?.role || 'FLEET_MANAGER') && (
          <div className="flex-none w-48 bg-transparent border border-wireBorder border-l-4 border-l-statusGreen p-4 rounded-sm flex flex-col justify-between">
            <p className="text-[10px] text-wireMuted uppercase tracking-wider mb-2 font-medium">Active Vehicles</p>
            <p className="text-2xl font-semibold text-white">{kpis.active}</p>
          </div>
        )}
        
        {/* Card 2 */}
        {['FLEET_MANAGER', 'DRIVER'].includes(user?.role || 'FLEET_MANAGER') && (
          <div className="flex-none w-48 bg-transparent border border-wireBorder border-l-4 border-l-[#a3e635] p-4 rounded-sm flex flex-col justify-between">
            <p className="text-[10px] text-wireMuted uppercase tracking-wider mb-2 font-medium">Available Vehicles</p>
            <p className="text-2xl font-semibold text-white">{kpis.available}</p>
          </div>
        )}

        {/* Card 3 */}
        {['FLEET_MANAGER', 'FINANCIAL_ANALYST'].includes(user?.role || 'FLEET_MANAGER') && (
          <div className="flex-none w-48 bg-transparent border border-wireBorder border-l-4 border-l-amber-500 p-4 rounded-sm flex flex-col justify-between">
            <p className="text-[10px] text-wireMuted uppercase tracking-wider mb-2 font-medium">Vehicles In<br/>Maintenance</p>
            <p className="text-2xl font-semibold text-white">{kpis.maintenance}</p>
          </div>
        )}

        {/* Card 4 */}
        {['DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'].includes(user?.role || 'FLEET_MANAGER') && (
          <div className="flex-none w-48 bg-transparent border border-wireBorder border-l-4 border-l-blue-900 p-4 rounded-sm flex flex-col justify-between">
            <p className="text-[10px] text-wireMuted uppercase tracking-wider mb-2 font-medium">Active Trips</p>
            <p className="text-2xl font-semibold text-white">{kpis.activeTrips}</p>
          </div>
        )}

        {/* Card 5 */}
        {['DRIVER', 'FINANCIAL_ANALYST'].includes(user?.role || 'FLEET_MANAGER') && (
          <div className="flex-none w-48 bg-transparent border border-wireBorder border-l-4 border-l-statusBlue p-4 rounded-sm flex flex-col justify-between">
            <p className="text-[10px] text-wireMuted uppercase tracking-wider mb-2 font-medium">Pending Trips</p>
            <p className="text-2xl font-semibold text-white">{kpis.pending}</p>
          </div>
        )}

        {/* Card 6 */}
        {['DRIVER', 'SAFETY_OFFICER'].includes(user?.role || 'FLEET_MANAGER') && (
          <div className="flex-none w-48 bg-transparent border border-wireBorder border-l-4 border-l-indigo-500 p-4 rounded-sm flex flex-col justify-between">
            <p className="text-[10px] text-wireMuted uppercase tracking-wider mb-2 font-medium">Drivers On Duty</p>
            <p className="text-2xl font-semibold text-white">{kpis.drivers}</p>
          </div>
        )}

        {/* Card 7 */}
        {['FLEET_MANAGER', 'FINANCIAL_ANALYST'].includes(user?.role || 'FLEET_MANAGER') && (
          <div className="flex-none w-48 bg-transparent border border-wireBorder border-l-4 border-l-statusGreen p-4 rounded-sm flex flex-col justify-between">
            <p className="text-[10px] text-wireMuted uppercase tracking-wider mb-2 font-medium">Fleet Utilization</p>
            <p className="text-2xl font-semibold text-white">{kpis.util}%</p>
          </div>
        )}
      </div>

      {/* LOWER SECTION */}
      <div className="flex space-x-12 pt-4">
        
        {/* Left Column: Recent Trips */}
        <div className="flex-1">
          <h3 className="text-[10px] text-wireMuted uppercase tracking-widest font-semibold mb-4">Recent Trips</h3>
          
          <table className="w-full text-left text-sm text-wireText border-collapse">
            <thead>
              <tr className="border-b border-wireBorder text-[10px] text-wireMuted uppercase tracking-wider">
                <th className="pb-2 font-medium">Trip</th>
                <th className="pb-2 font-medium">Vehicle</th>
                <th className="pb-2 font-medium">Driver</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">ETA</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-wireMuted text-sm border-b border-wireBorder/50">
                    No trips match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTrips.map(trip => (
                  <tr key={trip.id} className="border-b border-wireBorder/50">
                    <td className="py-3">{trip.id}</td>
                    <td className="py-3">{trip.vehicle}</td>
                    <td className="py-3">{trip.driver}</td>
                    <td className="py-3">
                      {getStatusBadge(trip.status)}
                    </td>
                    <td className={`py-3 ${trip.eta.includes('Awaiting') ? 'text-wireMuted' : ''}`}>{trip.eta}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Right Column: Vehicle Status */}
        <div className="w-1/3">
          <h3 className="text-[10px] text-wireMuted uppercase tracking-widest font-semibold mb-6">Vehicle Status</h3>
          
          <div className="space-y-6">
            
            {/* Available */}
            <div className="flex items-center space-x-4">
              <div className="w-20 text-xs text-wireText">Available</div>
              <div className="flex-1 h-3 bg-wireBorder rounded-sm overflow-hidden flex">
                <div className="h-full bg-statusGreen" style={{ width: `${Math.round(75 * multiplier)}%` }}></div>
              </div>
            </div>

            {/* On Trip */}
            <div className="flex items-center space-x-4">
              <div className="w-20 text-xs text-wireText">On Trip</div>
              <div className="flex-1 h-3 bg-wireBorder rounded-sm overflow-hidden flex">
                <div className="h-full bg-statusBlue" style={{ width: `${Math.round(33 * multiplier)}%` }}></div>
              </div>
            </div>

            {/* In Shop */}
            <div className="flex items-center space-x-4">
              <div className="w-20 text-xs text-wireText">In Shop</div>
              <div className="flex-1 h-3 bg-wireBorder rounded-sm overflow-hidden flex">
                <div className="h-full bg-amber-500" style={{ width: `${Math.round(10 * multiplier)}%` }}></div>
              </div>
            </div>

            {/* Retired */}
            <div className="flex items-center space-x-4">
              <div className="w-20 text-xs text-wireText">Retired</div>
              <div className="flex-1 h-3 bg-wireBorder rounded-sm overflow-hidden flex">
                <div className="h-full bg-statusRed/80" style={{ width: `${Math.round(5 * multiplier)}%` }}></div>
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
};
