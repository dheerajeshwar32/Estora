import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Award } from 'lucide-react';

import { Link } from 'react-router-dom';

const DEMO_AGENTS = [
  {
    id: "a1",
    name: 'Rahul Sharma',
    designation: 'Senior Luxury Consultant',
    specialization: 'Villas & Penthouses',
    experience: '12 Years',
    propertiesListed: 14,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
    contact: '+91 98204 71420'
  },
  {
    id: "a2",
    name: 'Priya Patel',
    designation: 'Commercial Real Estate Advisor',
    specialization: 'Grade-A Offices & Retail',
    experience: '9 Years',
    propertiesListed: 9,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    contact: '+91 98114 63890'
  },
  {
    id: "a3",
    name: 'Arjun Desai',
    designation: 'Residential Estates Specialist',
    specialization: 'Homes & Plotted Estates',
    experience: '6 Years',
    propertiesListed: 11,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
    contact: '+91 98452 39180'
  }
];

const Agents = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[color:var(--theme-white)] mb-4">Meet Our Agents</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
          Our team of dedicated professionals brings years of experience and deep market knowledge to help you find your perfect property.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {DEMO_AGENTS.map((agent, i) => (
          <motion.div 
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-navy-900 border border-white/5 rounded-3xl overflow-hidden group hover:border-white/20 transition-colors"
          >
            <Link to={`/agent/${agent.id}`} className="block">
              <div className="aspect-square overflow-hidden relative">
                <img src={agent.image} alt={agent.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-4 left-4 right-4 bg-navy-950/80 backdrop-blur-md rounded-xl p-4 border border-white/10">
                  <h3 className="text-xl font-bold text-[color:var(--theme-white)]">{agent.name}</h3>
                  <p className="text-blue-400 text-sm font-medium">{agent.designation}</p>
                </div>
              </div>
            </Link>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <Award size={18} className="text-slate-400" />
                <span className="text-sm">{agent.specialization} • {agent.experience} exp.</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <Link to={`/agent/${agent.id}`} className="flex items-center gap-2 text-sm font-bold bg-white text-navy-950 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                  View Profile
                </Link>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">{agent.propertiesListed} Properties</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Agents;

