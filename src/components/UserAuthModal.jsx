import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';

const UserAuthModal = ({ isOpen, onClose }) => {
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  const { showToast } = useAppContext();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setForm({ name: '', email: '', password: '' });
    setError('');
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const user = await loginWithGoogle();
      showToast(`Welcome, ${user.displayName || 'there'}!`, 'success');
      onClose();
      resetForm();
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        if (!form.name.trim()) { setError('Please enter your name.'); setIsLoading(false); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters.'); setIsLoading(false); return; }
        await signupWithEmail(form.name, form.email, form.password);
        showToast(`Account created! Welcome, ${form.name}!`, 'success');
      } else {
        await loginWithEmail(form.email, form.password);
        showToast('Welcome back!', 'success');
      }
      onClose();
      resetForm();
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'No account with this email. Sign up instead?',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/email-already-in-use': 'This email is already registered. Try logging in.',
        'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
      };
      setError(messages[err.code] || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-navy-900 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl relative"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium text-white mb-2">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-sm text-slate-400 font-light">
                {mode === 'login' ? 'Sign in to sync your saved properties.' : 'Join Estora to save & track properties.'}
              </p>
            </div>

            {/* Google Sign-In */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-navy-950 font-bold py-3.5 px-4 rounded-xl hover:bg-slate-100 transition-colors mb-6 disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-4 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {mode === 'signup' && (
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-navy-950 border border-white/10 rounded-xl text-white placeholder-slate-500 outline-none focus:border-white transition-colors"
                />
              )}
              <input
                type="email"
                required
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-3 bg-navy-950 border border-white/10 rounded-xl text-white placeholder-slate-500 outline-none focus:border-white transition-colors"
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full p-3 bg-navy-950 border border-white/10 rounded-xl text-white placeholder-slate-500 outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {/* Toggle Login/Signup */}
            <p className="text-center text-sm text-slate-400 mt-6">
              {mode === 'login' ? (
                <>Don't have an account? <button onClick={() => { setMode('signup'); setError(''); }} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign up</button></>
              ) : (
                <>Already have an account? <button onClick={() => { setMode('login'); setError(''); }} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign in</button></>
              )}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserAuthModal;

