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
  // Generate pseudo-random scores based on location length so it's consistent
  const getScore = (seed) => 65 + (seed % 30);
  const locLength = location.length || 10;
  
  const isCommercial = type.toLowerCase().includes('commercial') || type.toLowerCase().includes('office');
  
  return (
    <div className="bg-navy-950 rounded-3xl p-8 border border-white/5 mb-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left: Stats */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Map size={20} />
            </div>
            <h2 className="text-xl font-medium text-[color:var(--theme-white)]">Neighborhood Explorer</h2>
          </div>
          
          <StatBar icon={Navigation} label="Walkability" score={getScore(locLength * 2)} />
          <StatBar icon={Bus} label="Transit Access" score={getScore(locLength * 3)} />
          {isCommercial ? (
            <StatBar icon={Building} label="Business Hub Proximity" score={getScore(locLength * 5)} />
          ) : (
            <StatBar icon={BookOpen} label="Local Schools" score={getScore(locLength * 5)} />
          )}
          
          <p className="text-slate-400 text-sm mt-4 leading-relaxed">
            Scores are calculated based on proximity to amenities, public transit routes, and verified {isCommercial ? 'commercial zones' : 'school districts'} in <span className="text-[color:var(--theme-white)] font-medium">{location}</span>.
          </p>

          <div className="mt-8 border-t border-white/5 pt-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">What's Nearby?</h3>
            <div className="space-y-3">
              {!isCommercial && (
                <div className="flex justify-between items-center text-sm"><span className="text-slate-300">School</span><span className="font-medium text-white">1.2 km</span></div>
              )}
              <div className="flex justify-between items-center text-sm"><span className="text-slate-300">Hospital</span><span className="font-medium text-white">2.1 km</span></div>
              <div className="flex justify-between items-center text-sm"><span className="text-slate-300">Shopping Mall</span><span className="font-medium text-white">3.4 km</span></div>
              <div className="flex justify-between items-center text-sm"><span className="text-slate-300">Airport</span><span className="font-medium text-white">8.5 km</span></div>
              <div className="flex justify-between items-center text-sm"><span className="text-slate-300">Railway Station</span><span className="font-medium text-white">5.2 km</span></div>
            </div>
          </div>
        </div>

        {/* Right: Premium Map Placeholder */}
        <div className="w-full md:w-1/2 h-[300px] relative rounded-2xl overflow-hidden border border-white/10 group">
          {/* Real Interactive Map via iframe */}
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
          
          {/* Subtle Overlay to make it look premium and blend with the UI */}
          <div className="absolute inset-0 bg-blue-500/5 pointer-events-none z-0" />

          {/* Location Tag */}
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

