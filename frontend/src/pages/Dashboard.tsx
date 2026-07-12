import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const isDemo = user?.email?.startsWith('demo_');

  if (!isDemo) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-wireMuted mt-20">
        <p className="text-xl mb-2 text-wireText">Welcome to TransitOps, {user?.name}!</p>
        <p className="text-sm">There is no data available yet. Please use a demo account to view the mock UI.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-8 pb-8 text-wireText font-sans">
      
      {/* FILTERS SECTION */}
      <div>
        <h3 className="text-[10px] text-wireMuted uppercase tracking-widest font-semibold mb-3">Filters</h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select className="appearance-none bg-transparent border border-wireBorder text-wireMuted text-xs rounded-md pl-3 pr-8 py-2 focus:outline-none focus:border-wireText transition-colors">
              <option>Vehicle Type: All</option>
              <option>Van</option>
              <option>Truck</option>
              <option>Mini-van</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-wireMuted">
              <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          
          <div className="relative">
            <select className="appearance-none bg-transparent border border-wireBorder text-wireMuted text-xs rounded-md pl-3 pr-8 py-2 focus:outline-none focus:border-wireText transition-colors">
              <option>Status: All</option>
              <option>Active</option>
              <option>Maintenance</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-wireMuted">
              <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          
          <div className="relative">
            <select className="appearance-none bg-transparent border border-wireBorder text-wireMuted text-xs rounded-md pl-3 pr-8 py-2 focus:outline-none focus:border-wireText transition-colors">
              <option>Region: All</option>
              <option>North</option>
              <option>South</option>
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
        <div className="flex-none w-48 bg-transparent border border-wireBorder border-l-4 border-l-statusGreen p-4 rounded-sm flex flex-col justify-between">
          <p className="text-[10px] text-wireMuted uppercase tracking-wider mb-2 font-medium">Active Vehicles</p>
          <p className="text-2xl font-semibold text-white">53</p>
        </div>
        
        {/* Card 2 */}
        <div className="flex-none w-48 bg-transparent border border-wireBorder border-l-4 border-l-[#a3e635] p-4 rounded-sm flex flex-col justify-between">
          <p className="text-[10px] text-wireMuted uppercase tracking-wider mb-2 font-medium">Available Vehicles</p>
          <p className="text-2xl font-semibold text-white">42</p>
        </div>

        {/* Card 3 */}
        <div className="flex-none w-48 bg-transparent border border-wireBorder border-l-4 border-l-amber-500 p-4 rounded-sm flex flex-col justify-between">
          <p className="text-[10px] text-wireMuted uppercase tracking-wider mb-2 font-medium">Vehicles In<br/>Maintenance</p>
          <p className="text-2xl font-semibold text-white">05</p>
        </div>

        {/* Card 4 */}
        <div className="flex-none w-48 bg-transparent border border-wireBorder border-l-4 border-l-blue-900 p-4 rounded-sm flex flex-col justify-between">
          <p className="text-[10px] text-wireMuted uppercase tracking-wider mb-2 font-medium">Active Trips</p>
          <p className="text-2xl font-semibold text-white">18</p>
        </div>

        {/* Card 5 */}
        <div className="flex-none w-48 bg-transparent border border-wireBorder border-l-4 border-l-statusBlue p-4 rounded-sm flex flex-col justify-between">
          <p className="text-[10px] text-wireMuted uppercase tracking-wider mb-2 font-medium">Pending Trips</p>
          <p className="text-2xl font-semibold text-white">09</p>
        </div>

        {/* Card 6 */}
        <div className="flex-none w-48 bg-transparent border border-wireBorder border-l-4 border-l-indigo-500 p-4 rounded-sm flex flex-col justify-between">
          <p className="text-[10px] text-wireMuted uppercase tracking-wider mb-2 font-medium">Drivers On Duty</p>
          <p className="text-2xl font-semibold text-white">26</p>
        </div>

        {/* Card 7 */}
        <div className="flex-none w-48 bg-transparent border border-wireBorder border-l-4 border-l-statusGreen p-4 rounded-sm flex flex-col justify-between">
          <p className="text-[10px] text-wireMuted uppercase tracking-wider mb-2 font-medium">Fleet Utilization</p>
          <p className="text-2xl font-semibold text-white">81%</p>
        </div>
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
              <tr className="border-b border-wireBorder/50">
                <td className="py-3">TR001</td>
                <td className="py-3">VAN-05</td>
                <td className="py-3">Alex</td>
                <td className="py-3">
                  <span className="inline-block px-3 py-1 bg-statusBlue/90 text-[#121212] rounded text-xs font-semibold">On Trip</span>
                </td>
                <td className="py-3">45 min</td>
              </tr>
              <tr className="border-b border-wireBorder/50">
                <td className="py-3">TR002</td>
                <td className="py-3">TRK-12</td>
                <td className="py-3">John</td>
                <td className="py-3">
                  <span className="inline-block px-3 py-1 bg-statusGreen/90 text-[#121212] rounded text-xs font-semibold">Completed</span>
                </td>
                <td className="py-3">&mdash;</td>
              </tr>
              <tr className="border-b border-wireBorder/50">
                <td className="py-3">TR003</td>
                <td className="py-3">MINI-08</td>
                <td className="py-3">Priya</td>
                <td className="py-3">
                  <span className="inline-block px-3 py-1 bg-sky-400/90 text-[#121212] rounded text-xs font-semibold">Dispatched</span>
                </td>
                <td className="py-3">1h 10m</td>
              </tr>
              <tr className="border-b border-wireBorder/50">
                <td className="py-3">TR006</td>
                <td className="py-3">&mdash;</td>
                <td className="py-3">&mdash;</td>
                <td className="py-3">
                  <span className="inline-block px-3 py-1 bg-wireMuted text-[#121212] rounded text-xs font-semibold">Draft</span>
                </td>
                <td className="py-3 text-wireMuted">Awaiting vehicle</td>
              </tr>
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
                <div className="h-full bg-statusGreen w-3/4"></div>
              </div>
            </div>

            {/* On Trip */}
            <div className="flex items-center space-x-4">
              <div className="w-20 text-xs text-wireText">On Trip</div>
              <div className="flex-1 h-3 bg-wireBorder rounded-sm overflow-hidden flex">
                <div className="h-full bg-statusBlue w-1/3"></div>
              </div>
            </div>

            {/* In Shop */}
            <div className="flex items-center space-x-4">
              <div className="w-20 text-xs text-wireText">In Shop</div>
              <div className="flex-1 h-3 bg-wireBorder rounded-sm overflow-hidden flex">
                <div className="h-full bg-amber-500 w-[10%]"></div>
              </div>
            </div>

            {/* Retired */}
            <div className="flex items-center space-x-4">
              <div className="w-20 text-xs text-wireText">Retired</div>
              <div className="flex-1 h-3 bg-wireBorder rounded-sm overflow-hidden flex">
                <div className="h-full bg-statusRed/80 w-[5%]"></div>
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
};
