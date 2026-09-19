import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Listings from './pages/Listings';
import PropertyDetail from './pages/PropertyDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#060B19] text-white selection:bg-blue-500/30 selection:text-white">
        <nav className="border-b border-white/5 bg-[#060B19]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <Link to="/" className="text-2xl font-bold tracking-tighter text-white">
                ESTORA<span className="text-blue-500">.</span>
              </Link>
              <Link to="/login" className="text-xs font-medium tracking-widest uppercase text-slate-400 hover:text-white transition-colors">Admin</Link>
            </div>
          </div>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Listings />} />
            <Route path="/listing/:id" element={<PropertyDetail />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;