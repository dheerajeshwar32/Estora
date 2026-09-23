import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound = () => {
  useEffect(() => {
    document.title = '404 - Page Not Found | Estora';
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO title="404 - Page Not Found | Estora" description="The page you are looking for does not exist." />
      <div className="min-h-[80vh] flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 max-w-lg w-full text-center bg-white/5 border border-white/10 rounded-[2.5rem] p-12 backdrop-blur-xl shadow-2xl"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20"
          >
            <AlertCircle size={40} className="text-white" />
          </motion.div>
          
          <h1 className="text-6xl font-medium text-white mb-4 tracking-tight">404</h1>
          <h2 className="text-2xl font-light text-slate-300 mb-6">Page Not Found</h2>
          
          <p className="text-slate-400 font-light mb-10 leading-relaxed">
            The premium property or page you are looking for seems to have been relocated or doesn't exist. Let's get you back home.
          </p>
          
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-navy-950 font-bold tracking-widest uppercase rounded-full hover:bg-slate-200 transition-all hover:scale-105 active:scale-95"
          >
            <Home size={18} />
            Return Home
          </Link>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;

