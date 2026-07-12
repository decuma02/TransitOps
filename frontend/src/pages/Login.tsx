import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-darkBg flex">
      {/* Left side branding */}
      <div className="w-1/2 bg-gray-100 flex flex-col justify-center items-center p-12">
        <div className="flex items-center space-x-3 mb-6">
          <Truck size={48} className="text-gray-800" />
          <h1 className="text-4xl font-bold text-gray-800">TransitOps</h1>
        </div>
        <p className="text-gray-600 text-lg text-center max-w-md">
          Smart Transport Operations Platform. Digitize vehicle, driver, dispatch, and maintenance management.
        </p>
      </div>

      {/* Right side login form */}
      <div className="w-1/2 flex items-center justify-center p-12 bg-darkBg">
        <div className="w-full max-w-md bg-darkCard p-8 rounded-xl border border-gray-700 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Sign in to your account</h2>
          
          <button
            type="button"
            onClick={() => {
              setEmail('demo@transitops.com');
              setPassword('demo123');
            }}
            className="w-full mb-6 bg-gray-700 text-white font-semibold py-2 rounded hover:bg-gray-600 transition border border-gray-600"
          >
            Use Demo Credentials
          </button>

          {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <button
              type="submit"
              className="w-full bg-primary text-gray-900 font-bold py-2 rounded hover:bg-yellow-400 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
