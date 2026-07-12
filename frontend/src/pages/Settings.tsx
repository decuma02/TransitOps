import React from 'react';

export const Settings = () => {
  return (
    <div className="flex h-full w-full">
      {/* Left Column: General */}
      <div className="w-1/3 pr-8 border-r border-wireBorder flex flex-col space-y-6">
        <div>
          <h3 className="text-wireMuted text-xs tracking-widest font-semibold mb-4 uppercase">General</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-wireMuted text-[10px] uppercase tracking-wider mb-1">Depot Name</label>
              <input
                type="text"
                defaultValue="Gandhinagar Depot GJ4"
                className="w-full bg-transparent border border-wireBorder rounded-md px-3 py-2 text-sm text-wireText focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-wireMuted text-[10px] uppercase tracking-wider mb-1">Currency</label>
              <input
                type="text"
                defaultValue="INR (Rs)"
                className="w-full bg-transparent border border-wireBorder rounded-md px-3 py-2 text-sm text-wireText focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-wireMuted text-[10px] uppercase tracking-wider mb-1">Distance Unit</label>
              <input
                type="text"
                defaultValue="Kilometers"
                className="w-full bg-transparent border border-wireBorder rounded-md px-3 py-2 text-sm text-wireText focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>
        <div>
          <button className="bg-statusBlue/20 text-statusBlue border border-statusBlue/50 hover:bg-statusBlue/30 transition-colors px-6 py-2 rounded-lg text-sm font-medium w-48 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
            Save changes
          </button>
        </div>
      </div>

      {/* Right Column: RBAC */}
      <div className="w-2/3 pl-8">
        <h3 className="text-wireMuted text-xs tracking-widest font-semibold mb-4 uppercase">Role-Based Access (RBAC)</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="text-wireMuted text-[10px] uppercase tracking-wider border-b border-wireBorder">
              <th className="py-3 font-normal">Role</th>
              <th className="py-3 font-normal">Fleet</th>
              <th className="py-3 font-normal">Drivers</th>
              <th className="py-3 font-normal">Trips</th>
              <th className="py-3 font-normal">Fuel/Exp.</th>
              <th className="py-3 font-normal">Analytics</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wireBorder">
            <tr className="text-wireText hover:bg-white/5 transition-colors">
              <td className="py-4">Fleet Manager</td>
              <td className="py-4 text-wireMuted font-serif">✓</td>
              <td className="py-4 text-wireMuted font-serif">✓</td>
              <td className="py-4 text-wireMuted">—</td>
              <td className="py-4 text-wireMuted">—</td>
              <td className="py-4 text-wireMuted font-serif">✓</td>
            </tr>
            <tr className="text-wireText hover:bg-white/5 transition-colors">
              <td className="py-4">Dispatcher</td>
              <td className="py-4 text-wireMuted text-xs italic">view</td>
              <td className="py-4 text-wireMuted">—</td>
              <td className="py-4 text-wireMuted font-serif">✓</td>
              <td className="py-4 text-wireMuted">—</td>
              <td className="py-4 text-wireMuted">—</td>
            </tr>
            <tr className="text-wireText hover:bg-white/5 transition-colors">
              <td className="py-4">Safety Officer</td>
              <td className="py-4 text-wireMuted">—</td>
              <td className="py-4 text-wireMuted font-serif">✓</td>
              <td className="py-4 text-wireMuted text-xs italic">view</td>
              <td className="py-4 text-wireMuted">—</td>
              <td className="py-4 text-wireMuted">—</td>
            </tr>
            <tr className="text-wireText hover:bg-white/5 transition-colors">
              <td className="py-4">Financial Analyst</td>
              <td className="py-4 text-wireMuted text-xs italic">view</td>
              <td className="py-4 text-wireMuted">—</td>
              <td className="py-4 text-wireMuted">—</td>
              <td className="py-4 text-wireMuted font-serif">✓</td>
              <td className="py-4 text-wireMuted font-serif">✓</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
