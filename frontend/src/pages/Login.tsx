import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('FLEET_MANAGER');
  
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        login(res.data.token, res.data.user);
        navigate('/');
      } else {
        await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
        // After successful registration, automatically log in
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        login(res.data.token, res.data.user);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || (isLogin ? 'Login failed' : 'Registration failed'));
    }
  };

  const handleDemoFill = (roleKey: string) => {
    let demoEmail = '';
    switch (roleKey) {
      case 'FLEET_MANAGER': demoEmail = 'demo_fleet@transitops.com'; break;
      case 'DRIVER': demoEmail = 'demo_driver@transitops.com'; break;
      case 'SAFETY_OFFICER': demoEmail = 'demo_safety@transitops.com'; break;
      case 'FINANCIAL_ANALYST': demoEmail = 'demo_finance@transitops.com'; break;
    }
    setEmail(demoEmail);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-darkBg flex">
      {/* Left side branding */}
      <div className="w-1/2 bg-[#1a1a1a] flex flex-col justify-center items-center p-12 border-r border-gray-800">
        <div className="flex items-center space-x-3 mb-6">
          <Truck size={48} className="text-primary" />
          <h1 className="text-4xl font-bold text-white">TransitOps</h1>
        </div>
        <p className="text-gray-400 text-lg text-center max-w-md">
          Smart Transport Operations Platform. Digitize vehicle, driver, dispatch, and maintenance management.
        </p>
      </div>

      {/* Right side login form */}
      <div className="w-1/2 flex items-center justify-center p-12 bg-darkBg">
        <div className="w-full max-w-md bg-darkCard p-8 rounded-xl border border-gray-700 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">
            {isLogin ? 'Sign in to your account' : 'Create an account'}
          </h2>
          
          {isLogin && (
            <div className="mb-6 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => handleDemoFill('FLEET_MANAGER')} className="text-xs bg-gray-800 text-gray-300 py-2 rounded hover:bg-gray-700 transition border border-gray-700">Demo Manager</button>
              <button type="button" onClick={() => handleDemoFill('DRIVER')} className="text-xs bg-gray-800 text-gray-300 py-2 rounded hover:bg-gray-700 transition border border-gray-700">Demo Driver</button>
              <button type="button" onClick={() => handleDemoFill('SAFETY_OFFICER')} className="text-xs bg-gray-800 text-gray-300 py-2 rounded hover:bg-gray-700 transition border border-gray-700">Demo Safety</button>
              <button type="button" onClick={() => handleDemoFill('FINANCIAL_ANALYST')} className="text-xs bg-gray-800 text-gray-300 py-2 rounded hover:bg-gray-700 transition border border-gray-700">Demo Finance</button>
            </div>
          )}

          {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-darkBg border border-gray-700 text-white rounded p-2 focus:border-primary outline-none transition"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div>
              <label className="block text-gray-400 text-sm mb-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-darkBg border border-gray-700 text-white rounded p-2 focus:border-primary outline-none transition"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-darkBg border border-gray-700 text-white rounded p-2 focus:border-primary outline-none transition"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-gray-400 text-sm mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-darkBg border border-gray-700 text-white rounded p-2 focus:border-primary outline-none transition"
                >
                  <option value="FLEET_MANAGER">Fleet Manager</option>
                  <option value="DRIVER">Driver</option>
                  <option value="SAFETY_OFFICER">Safety Officer</option>
                  <option value="FINANCIAL_ANALYST">Financial Analyst</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-gray-900 font-bold py-2 rounded hover:bg-yellow-400 transition"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            {isLogin ? (
              <p>Don't have an account? <button onClick={() => { setIsLogin(false); setError(''); }} className="text-primary hover:underline">Sign up</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => { setIsLogin(true); setError(''); }} className="text-primary hover:underline">Sign in</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
