import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useAppContext } from './context/AppContext';
import { Heart, X, CheckCircle, AlertCircle, Info, Trash2, User, LogOut, LogIn, Sun, Moon } from 'lucide-react';
import Listings from './pages/Listings';
import PropertyDetail from './pages/PropertyDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SplashLoader from './components/SplashLoader';
import UserAuthModal from './components/UserAuthModal';
import CompareModal from './components/CompareModal';
import Agents from './pages/Agents';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProjectDetail from './pages/ProjectDetail';
import ListProperty from './pages/ListProperty';
import Services from './pages/Services';
import Blog from './pages/Blog';
import AgentDetail from './pages/AgentDetail';

const pageVariants = {
  initial: { opacity: 0, y: 15, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -15, filter: 'blur(4px)', transition: { duration: 0.3, ease: 'easeIn' } }
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><Listings /></motion.div>} />
        <Route path="/listing/:id" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><PropertyDetail /></motion.div>} />
        <Route path="/agents" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><Agents /></motion.div>} />
        <Route path="/agent/:id" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><AgentDetail /></motion.div>} />
        <Route path="/projects" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><Projects /></motion.div>} />
        <Route path="/project/:id" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><ProjectDetail /></motion.div>} />
        <Route path="/services" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><Services /></motion.div>} />
        <Route path="/about" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><About /></motion.div>} />
        <Route path="/blog" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><Blog /></motion.div>} />
        <Route path="/contact" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><Contact /></motion.div>} />
        <Route path="/privacy" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><PrivacyPolicy /></motion.div>} />
        <Route path="/login" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><AdminLogin /></motion.div>} />
        <Route path="/dashboard" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><AdminDashboard /></motion.div>} />
        <Route path="/list-property" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><ListProperty /></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
};

const GlobalUI = () => {
  const { toast, isSavedDrawerOpen, setIsSavedDrawerOpen, savedListings, toggleSaved, compareList, toggleCompare, setIsCompareModalOpen } = useAppContext();

  return (
    <>
      <CompareModal />
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-6 right-6 z-[60] bg-navy-900 border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-3 pr-8">
            {toast.type === 'success' && <CheckCircle className="text-green-400" size={20} />}
            {toast.type === 'error' && <AlertCircle className="text-red-400" size={20} />}
            {toast.type === 'info' && <Info className="text-blue-400" size={20} />}
            <span className="text-sm font-medium text-white">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Properties Drawer */}
      <AnimatePresence>
        {isSavedDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSavedDrawerOpen(false)} className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-navy-900 border-l border-white/10 z-50 flex flex-col shadow-2xl">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-navy-950/50">
                <h2 className="text-lg font-medium text-white flex items-center gap-2"><Heart className="text-blue-400" size={20} /> Saved Properties</h2>
                <button onClick={() => setIsSavedDrawerOpen(false)} className="text-slate-400 hover:text-white transition-colors p-2"><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {savedListings.length === 0 ? (
                  <div className="text-center text-slate-500 font-light mt-10">No saved properties yet.</div>
                ) : (
                  savedListings.map(listing => {
                    const isComparing = compareList.some(item => item.id === listing.id);
                    return (
                      <div key={listing.id} className="flex gap-4 items-center bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <img src={listing.image} alt={listing.title} className="w-20 h-20 object-cover rounded-lg bg-navy-950" />
                        <div className="flex-1 min-w-0">
                          <Link to={`/listing/${listing.id}`} onClick={() => setIsSavedDrawerOpen(false)} className="text-sm font-medium text-white truncate hover:text-blue-400 block">{listing.title}</Link>
                          <p className="text-xs text-slate-400 truncate">{listing.location}</p>
                          <p className="text-sm text-blue-400 font-semibold mt-1">₹{listing.price.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => toggleCompare(listing)} 
                            className={`p-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${isComparing ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
                            title={isComparing ? 'Remove from Compare' : 'Add to Compare'}
                          >
                            vs
                          </button>
                          <button onClick={() => toggleSaved(listing)} className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              {/* Compare Action Bar */}
              {compareList.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-navy-950/50">
                  <button 
                    onClick={() => {
                      setIsSavedDrawerOpen(false);
                      setIsCompareModalOpen(true);
                    }}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
                  >
                    Compare Properties ({compareList.length})
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const navContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const navItemVariants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const Navbar = () => {
  const { savedListings, setIsSavedDrawerOpen, theme, toggleTheme } = useAppContext();
  const { user, isAdmin, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userInitial = user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?';

  return (
    <>
      <nav className="border-b border-white/5 bg-navy-950/80 backdrop-blur-xl sticky top-0 z-40">
        <motion.div 
          variants={navContainerVariants} 
          initial="hidden" 
          animate="show" 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-20 items-center"
        >
          <motion.div variants={navItemVariants}>
            <Link to="/" className="text-2xl font-bold tracking-tighter text-white mr-8">ESTORA<span className="text-blue-500">.</span></Link>
          </motion.div>
          
          <motion.div variants={navItemVariants} className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-[10px] font-bold tracking-widest uppercase text-slate-300 hover:text-white transition-colors">Home</Link>
            <Link to="/" className="text-[10px] font-bold tracking-widest uppercase text-slate-300 hover:text-white transition-colors">Properties</Link>
            <Link to="/projects" className="text-[10px] font-bold tracking-widest uppercase text-slate-300 hover:text-white transition-colors">Projects</Link>
            <Link to="/agents" className="text-[10px] font-bold tracking-widest uppercase text-slate-300 hover:text-white transition-colors">Agents</Link>
            <Link to="/services" className="text-[10px] font-bold tracking-widest uppercase text-slate-300 hover:text-white transition-colors">Services</Link>
            <Link to="/about" className="text-[10px] font-bold tracking-widest uppercase text-slate-300 hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="text-[10px] font-bold tracking-widest uppercase text-slate-300 hover:text-white transition-colors">Contact</Link>
          </motion.div>

          <div className="flex items-center gap-4 ml-auto">
            {/* List Property */}
            <motion.div variants={navItemVariants} className="hidden md:block mr-2">
              <Link to="/list-property" className="text-xs font-bold tracking-widest uppercase text-slate-300 hover:text-white transition-colors">
                List Property
              </Link>
            </motion.div>
            {/* Theme Toggle */}
            <motion.div variants={navItemVariants}>
              <button 
                onClick={toggleTheme} 
                className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </motion.div>

            {/* Saved button */}
            <motion.div variants={navItemVariants}>
              <button onClick={() => setIsSavedDrawerOpen(true)} className="relative text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                <Heart size={20} className={savedListings.length > 0 ? 'fill-blue-500 text-blue-500' : ''} />
                <span className="hidden sm:block">Saved</span>
                {savedListings.length > 0 && <span className="absolute -top-1.5 -left-1.5 bg-blue-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{savedListings.length}</span>}
              </button>
            </motion.div>

            {/* User Auth Area */}
            <motion.div variants={navItemVariants}>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3 py-2 rounded-full transition-all"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        {userInitial}
                      </div>
                    )}
                    <span className="hidden sm:block text-sm text-white font-medium max-w-[100px] truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-40"
                          onClick={() => setIsUserMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-navy-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                        >
                          <div className="p-4 border-b border-white/10">
                            <p className="text-sm font-medium text-white truncate">{user.displayName || 'User'}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                          </div>
                          {isAdmin && (
                            <Link
                              to="/dashboard"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <User size={16} /> Admin Dashboard
                            </Link>
                          )}
                          <button
                            onClick={() => { logout(); setIsUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut size={16} /> Sign Out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-400 hover:text-white transition-colors bg-white/5 px-4 py-2.5 rounded-full border border-white/5 hover:border-white/20"
                >
                  <LogIn size={14} />
                  <span className="hidden sm:block">Sign In</span>
                </button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </nav>

      <UserAuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

const Footer = () => (
  <footer className="border-t border-white/5 bg-navy-900/50 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-2">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-white mb-4 block">ESTORA<span className="text-blue-500">.</span></Link>
          <p className="text-sm text-slate-400 font-light max-w-sm leading-relaxed">
            Curating the finest premium properties globally. Elevating the real estate experience through intelligent design and AI-driven discovery.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-white mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-slate-400 font-light">
            <li><Link to="/" className="hover:text-blue-400 transition-colors">Premium Listings</Link></li>
            <li><Link to="/projects" className="hover:text-blue-400 transition-colors">New Developments</Link></li>
            <li><Link to="/agents" className="hover:text-blue-400 transition-colors">Our Agents</Link></li>
            <li><Link to="/services" className="hover:text-blue-400 transition-colors">Services</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-white mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-slate-400 font-light">
            <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
            <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Blog & Guides</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-500 font-light">&copy; {new Date().getFullYear()} Estora Real Estate. All rights reserved.</p>
        <div className="flex gap-4 text-slate-500">
          <button className="hover:text-white transition-colors"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></button>
          <button className="hover:text-white transition-colors"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></button>
          <button className="hover:text-white transition-colors"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></button>
        </div>
      </div>
    </div>
  </footer>
);

function App() {
  const [appReady, setAppReady] = useState(false);

  return (
    <AuthProvider>
      <AppProvider>
        {!appReady && <SplashLoader onComplete={() => setAppReady(true)} />}
        
        <Router>
          <div className={`min-h-screen bg-navy-950 text-white selection:bg-blue-500/30 selection:text-white flex flex-col ${!appReady ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}`}>
            <Navbar />
            <main className="flex-1"><AnimatedRoutes /></main>
            <Footer />
            <GlobalUI />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;