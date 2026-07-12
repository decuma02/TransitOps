import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    
    if (isLogin && selectedRole) {
      // Auto-fill demo credentials based on selection
      let demoEmail = '';
      switch (selectedRole) {
        case 'FLEET_MANAGER': demoEmail = 'demo_fleet@transitops.com'; break;
        case 'DRIVER': demoEmail = 'demo_driver@transitops.com'; break;
        case 'SAFETY_OFFICER': demoEmail = 'demo_safety@transitops.com'; break;
        case 'FINANCIAL_ANALYST': demoEmail = 'demo_finance@transitops.com'; break;
      }
      setEmail(demoEmail);
      setPassword('demo123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        login(res.data.token, res.data.user);
        navigate('/');
      } else {
        await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role: role || 'FLEET_MANAGER' });
        // After successful registration, automatically log in
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        login(res.data.token, res.data.user);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || (isLogin ? 'Login failed' : 'Registration failed'));
    }
  };

  return (
    <div className="min-h-screen flex text-gray-800 font-sans">
      {/* Left side branding */}
      <div className="w-5/12 bg-[#D1D5DB] flex flex-col justify-between p-12 lg:p-20 border-r border-gray-300">
        <div>
          <div className="mb-4">
            {/* Square Grid Icon */}
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-600 mb-2">
              <rect x="2" y="2" width="44" height="44" stroke="currentColor" strokeWidth="2" fill="transparent" />
              <path d="M2 12H46M2 24H46M2 36H46M12 2V46M24 2V46M36 2V46" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5"/>
            </svg>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">TransitOps</h1>
            <p className="text-sm text-gray-600 font-medium">Smart Transport Operations Platform</p>
          </div>

          <div className="mt-16">
            <h2 className="text-lg font-medium text-gray-800 mb-4">One login, four roles:</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-600 mr-3"></span>Fleet Manager</li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-600 mr-3"></span>Dispatcher</li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-600 mr-3"></span>Safety Officer</li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-600 mr-3"></span>Financial Analyst</li>
            </ul>
          </div>
        </div>

        <div className="text-xs text-gray-500 font-medium tracking-wider uppercase">
          TRANSITOPS © 2026 • RBAC ENABLED
        </div>
      </div>

      {/* Right side login form */}
      <div className="w-7/12 flex items-center justify-center p-12 lg:p-24 bg-[#121212]">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            {isLogin ? 'Sign in to your account' : 'Create an account'}
          </h2>
          <p className="text-gray-400 text-sm mb-10">
            {isLogin ? 'Enter your credentials to continue' : 'Fill in the details to get started'}
          </p>
          
          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-6 text-sm flex items-center"><span className="font-bold mr-2 text-lg leading-none">×</span> {error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 text-white rounded-md p-3 focus:border-amber-600 outline-none transition text-sm"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Raven.k@transitops.in"
                className="w-full bg-transparent border border-gray-700 text-white rounded-md p-3 focus:border-amber-600 outline-none transition text-sm placeholder-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border border-gray-700 text-white rounded-md p-3 focus:border-amber-600 outline-none transition text-sm placeholder-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">Role (RBAC)</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={handleRoleSelect}
                  className="w-full bg-[#121212] border border-gray-700 text-white rounded-md p-3 focus:border-amber-600 outline-none transition text-sm appearance-none pr-10"
                  required={!isLogin}
                >
                  <option value="" disabled>Select a role...</option>
                  <option value="FLEET_MANAGER">Fleet Manager</option>
                  <option value="DRIVER">Dispatcher</option>
                  <option value="SAFETY_OFFICER">Safety Officer</option>
                  <option value="FINANCIAL_ANALYST">Financial Analyst</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center text-sm text-gray-400 cursor-pointer">
                  <input type="checkbox" className="mr-2 rounded border-gray-700 bg-[#121212] text-amber-600 focus:ring-amber-600 focus:ring-offset-[#121212]" />
                  Remember me
                </label>
                <a href="#" className="text-sm text-blue-500 hover:text-blue-400 transition">Forgot password?</a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-amber-600 text-gray-900 font-semibold py-3 rounded-md hover:bg-amber-500 transition mt-4"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          {isLogin && (
            <div className="mt-10 pt-8 border-t border-gray-800">
              <p className="text-gray-400 text-xs mb-3">Access is scoped by role after login:</p>
              <ul className="text-gray-500 text-xs space-y-1.5">
                <li>• Fleet Manager &rarr; Fleet, Maintenance</li>
                <li>• Dispatcher &rarr; Dashboard, Trips</li>
                <li>• Safety Officer &rarr; Drivers, Compliance</li>
                <li>• Financial Analyst &rarr; Fuel & Expenses, Analytics</li>
              </ul>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-gray-500">
            {isLogin ? (
              <p>Don't have an account? <button onClick={() => { setIsLogin(false); setError(''); setRole(''); setEmail(''); setPassword(''); }} className="text-amber-600 hover:underline">Sign up</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => { setIsLogin(true); setError(''); setRole(''); setEmail(''); setPassword(''); }} className="text-amber-600 hover:underline">Sign in</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
