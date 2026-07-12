import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export const Trips = () => {
  const { user } = useAuth();
  const isDemo = user?.email?.startsWith('demo_');

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // If not a demo user, return early
  if (!isDemo) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-wireMuted mt-20">
        <p className="text-xl mb-2 text-wireText">Welcome to TransitOps, {user?.name}!</p>
        <p className="text-sm">There is no data available yet. Please use a demo account to view the mock UI.</p>
      </div>
    );
  }

  // Form states to show the warning
  const [vehicleCapacity] = useState(500);
  const [cargoWeight, setCargoWeight] = useState('700');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/trips');
      setTrips(res.data);
    } catch (error) {
      console.error('Error fetching trips', error);
    } finally {
      setLoading(false);
    }
  };

  const isExceeded = parseInt(cargoWeight || '0') > vehicleCapacity;
  const excessAmount = parseInt(cargoWeight || '0') - vehicleCapacity;

  return (
    <div className="flex h-full w-full">
      {/* Left Column: Form & Lifecycle */}
      <div className="w-1/3 pr-8 border-r border-wireBorder flex flex-col space-y-8">
        
        {/* Lifecycle */}
        <div>
          <h3 className="text-wireMuted text-xs tracking-widest font-semibold mb-6 uppercase">Trip Lifecycle</h3>
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute top-2 left-4 right-4 h-[1px] bg-wireBorder z-0"></div>
            
            <div className="flex flex-col items-center z-10 space-y-2">
              <div className="w-4 h-4 rounded-full bg-statusGreen"></div>
              <span className="text-[10px] text-statusGreen uppercase font-semibold">Draft</span>
            </div>
            
            <div className="flex flex-col items-center z-10 space-y-2">
              <div className="w-4 h-4 rounded-full bg-statusBlue"></div>
              <span className="text-[10px] text-statusBlue uppercase font-semibold">Dispatched</span>
            </div>
            
            <div className="flex flex-col items-center z-10 space-y-2">
              <div className="w-4 h-4 rounded-full bg-wireMuted"></div>
              <span className="text-[10px] text-wireMuted uppercase">Completed</span>
            </div>
            
            <div className="flex flex-col items-center z-10 space-y-2">
              <div className="w-4 h-4 rounded-full bg-wireMuted"></div>
              <span className="text-[10px] text-wireMuted uppercase">Cancelled</span>
            </div>
          </div>
        </div>

        {/* Create Trip Form */}
        <div>
          <h3 className="text-wireMuted text-xs tracking-widest font-semibold mb-4 uppercase">Create Trip</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-wireMuted text-[10px] uppercase tracking-wider mb-1">Source</label>
              <input type="text" defaultValue="Gandhinagar Depot" className="w-full bg-transparent border border-wireBorder rounded-md px-3 py-2 text-sm text-wireText focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-wireMuted text-[10px] uppercase tracking-wider mb-1">Destination</label>
              <input type="text" defaultValue="Ahmedabad Hub" className="w-full bg-transparent border border-wireBorder rounded-md px-3 py-2 text-sm text-wireText focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-wireMuted text-[10px] uppercase tracking-wider mb-1">Vehicle (Available Only)</label>
              <input type="text" defaultValue="VAN-05 - 500 kg capacity" className="w-full bg-transparent border border-wireBorder rounded-md px-3 py-2 text-sm text-wireText focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-wireMuted text-[10px] uppercase tracking-wider mb-1">Driver (Available Only)</label>
              <input type="text" defaultValue="Alex" className="w-full bg-transparent border border-wireBorder rounded-md px-3 py-2 text-sm text-wireText focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-wireMuted text-[10px] uppercase tracking-wider mb-1">Cargo Weight (kg)</label>
              <input 
                type="number" 
                value={cargoWeight} 
                onChange={(e) => setCargoWeight(e.target.value)}
                className="w-full bg-transparent border border-wireBorder rounded-md px-3 py-2 text-sm text-wireText focus:outline-none focus:border-primary transition-colors" 
              />
            </div>
            <div>
              <label className="block text-wireMuted text-[10px] uppercase tracking-wider mb-1">Planned Distance (km)</label>
              <input type="text" defaultValue="38" className="w-full bg-transparent border border-wireBorder rounded-md px-3 py-2 text-sm text-wireText focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          {/* Warning Box */}
          {isExceeded && (
            <div className="mt-4 border border-statusRed/50 bg-statusRed/5 rounded-md p-3 text-xs text-statusRed space-y-1">
              <p>Vehicle Capacity: {vehicleCapacity} kg</p>
              <p>Cargo Weight: {cargoWeight} kg</p>
              <p className="font-semibold flex items-center">
                <span className="mr-1 text-base leading-none">×</span> Capacity exceeded by {excessAmount} kg - dispatch blocked
              </p>
            </div>
          )}

          <div className="flex space-x-4 mt-6">
            <button 
              disabled={isExceeded} 
              className={`flex-1 py-2 rounded-lg text-sm font-semibold shadow-md transition-colors ${isExceeded ? 'bg-wireBorder text-wireMuted cursor-not-allowed' : 'bg-primary/90 text-darkBg hover:bg-primary'}`}
            >
              Dispatch {isExceeded && '(disabled)'}
            </button>
            <button className="flex-1 bg-transparent border border-statusRed text-statusRed hover:bg-statusRed/10 transition-colors py-2 rounded-lg text-sm font-semibold shadow-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Live Board */}
      <div className="w-2/3 pl-8 flex flex-col">
        <h3 className="text-wireMuted text-xs tracking-widest font-semibold mb-4 uppercase">Live Board</h3>
        
        <div className="flex-1 space-y-4">
          
          {/* Trip Card 1 */}
          <div className="border border-dashed border-wireBorder p-4 rounded-md flex justify-between items-start">
            <div className="space-y-3">
              <div className="text-wireText font-medium text-sm">TR001</div>
              <div className="text-wireText text-sm">Gandhinagar Depot &rarr; Ahmedabad Hub</div>
              <div>
                <span className="inline-block px-4 py-1 bg-statusBlue/90 text-[#121212] font-semibold rounded shadow-sm text-xs">Dispatched</span>
              </div>
            </div>
            <div className="text-right space-y-3">
              <div className="text-wireMuted text-sm uppercase tracking-wider text-[10px]">VAN-05 / ALEX</div>
              <div className="text-wireMuted text-sm pt-5">45 min</div>
            </div>
          </div>

          {/* Trip Card 2 */}
          <div className="border border-dashed border-wireBorder p-4 rounded-md flex justify-between items-start">
            <div className="space-y-3">
              <div className="text-wireText font-medium text-sm">TR004</div>
              <div className="text-wireText text-sm">Vatva Industrial Area &rarr; Sanand Warehouse</div>
              <div>
                <span className="inline-block px-4 py-1 bg-wireMuted text-[#121212] font-semibold rounded shadow-sm text-xs">Draft</span>
              </div>
            </div>
            <div className="text-right space-y-3">
              <div className="text-wireMuted text-sm uppercase tracking-wider text-[10px]">TRUCK-04 / SURESH</div>
              <div className="text-wireMuted text-sm pt-5">Awaiting driver</div>
            </div>
          </div>

          {/* Trip Card 3 */}
          <div className="border border-dashed border-wireBorder p-4 rounded-md flex justify-between items-start">
            <div className="space-y-3">
              <div className="text-wireText font-medium text-sm">TR006</div>
              <div className="text-wireText text-sm">Mansa &rarr; Kalol Depot</div>
              <div>
                <span className="inline-block px-4 py-1 bg-statusRed/90 text-[#121212] font-semibold rounded shadow-sm text-xs">Cancelled</span>
              </div>
            </div>
            <div className="text-right space-y-3">
              <div className="text-wireMuted text-sm uppercase tracking-wider text-[10px]">Unassigned</div>
              <div className="text-wireMuted text-sm pt-5">Vehicle went to shop</div>
            </div>
          </div>

        </div>

        <p className="text-wireMuted text-xs font-serif italic mt-6 pb-4">
          On Complete: odometer &rarr; fuel log &rarr; expenses &rarr; Vehicle &amp; Driver Available
        </p>
      </div>
    </div>
  );
};
