import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Admin Login — Estora';
    return () => { document.title = 'Estora — Discover Premium Properties'; };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      {/* Dark Glassmorphism Panel */}
      <div className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md">
        
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-medium tracking-tight text-white mb-2">Welcome Back</h2>
          <p className="text-sm text-slate-400 font-light">Sign in to manage your exclusive listings.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 text-sm">
          <div>
            <label className="block text-slate-300 font-medium mb-2">Email Address</label>
            <input 
              type="email" 
              required 
              className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@estora.com"
            />
          </div>
          
          <div>
            <label className="block text-slate-300 font-medium mb-2">Password</label>
            <input 
              type="password" 
              required 
              className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full bg-white text-navy-950 font-bold tracking-wide py-4 px-8 rounded-full hover:bg-slate-200 transition-colors">
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;