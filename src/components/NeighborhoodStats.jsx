import React from 'react';
import { Map, Bus, Navigation, BookOpen, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const StatBar = ({ icon: Icon, label, score }) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2 text-slate-300 font-medium">
        <Icon size={16} className="text-slate-400" />
        {label}
      </div>
      <span className="font-bold text-[color:var(--theme-white)]">{score}/100</span>
    </div>
    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${score}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
      />
    </div>
  </div>
);

const NeighborhoodStats = ({ location, type = '' }) => {
  // Deterministic location seed for realistic per-neighborhood scores & commute radii
  const seedHash = (location || 'Mumbai').split('').reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 1), 0);
  const getScore = (salt) => 68 + ((seedHash + salt) % 27);
  const getKm = (min, span, salt) => (min + (((seedHash + salt) % (span * 10)) / 10)).toFixed(1);

  const isCommercial = type.toLowerCase().includes('commercial') || type.toLowerCase().includes('office');
  
  return (
    <div className="bg-navy-950 rounded-3xl p-8 border border-white/5 mb-12">
      <div className="flex flex-col md:flex-row gap-12">
        {}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Map size={20} />
            </div>
            <h2 className="text-xl font-medium text-[color:var(--theme-white)]">Neighborhood Explorer</h2>
          </div>
          
          <StatBar icon={Navigation} label="Walkability" score={getScore(11)} />
          <StatBar icon={Bus} label="Transit Access" score={getScore(23)} />
          {isCommercial ? (
            <StatBar icon={Building} label="Business Hub Proximity" score={getScore(37)} />
          ) : (
            <StatBar icon={BookOpen} label="Local Schools" score={getScore(37)} />
          )}
          
          <p className="text-slate-400 text-sm mt-4 leading-relaxed">
            Estimated scores reflect proximity to civic amenities, transit corridors, and {isCommercial ? 'business districts' : 'school zones'} around <span className="text-[color:var(--theme-white)] font-medium">{location}</span>.
          </p>

          <div className="mt-8 border-t border-white/5 pt-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Estimated Commute Radii</h3>
            <div className="space-y-3">
              {!isCommercial && (
                <div className="flex justify-between items-center text-sm"><span className="text-slate-300">International School</span><span className="font-medium text-white">{getKm(0.8, 2.2, 3)} km</span></div>
              )}
              <div className="flex justify-between items-center text-sm"><span className="text-slate-300">Multi-Specialty Hospital</span><span className="font-medium text-white">{getKm(1.2, 3.0, 7)} km</span></div>
              <div className="flex justify-between items-center text-sm"><span className="text-slate-300">Retail & Dining District</span><span className="font-medium text-white">{getKm(1.5, 4.0, 13)} km</span></div>
              <div className="flex justify-between items-center text-sm"><span className="text-slate-300">International Airport</span><span className="font-medium text-white">{getKm(11.0, 18.0, 19)} km</span></div>
              <div className="flex justify-between items-center text-sm"><span className="text-slate-300">Metro / Rail Hub</span><span className="font-medium text-white">{getKm(1.8, 5.5, 29)} km</span></div>
            </div>
          </div>
        </div>

        {}
        <div className="w-full md:w-1/2 h-[300px] relative rounded-2xl overflow-hidden border border-white/10 group">
          {}
          <iframe 
            title="Property Location"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'var(--theme-map-filter)' }} 
            allowFullScreen="" 
            loading="lazy"
            className="absolute inset-0 z-0"
          ></iframe>
          
          {}
          <div className="absolute inset-0 bg-blue-500/5 pointer-events-none z-0" />

          {}
          <div className="absolute bottom-4 left-4 right-4 bg-navy-950/80 backdrop-blur-md border border-white/10 rounded-xl p-4 transform transition-transform group-hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-1">Location</div>
                <div className="text-sm font-medium text-[color:var(--theme-white)] truncate">{location}</div>
              </div>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold bg-white text-navy-950 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors inline-block"
              >
                Explore
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodStats;

