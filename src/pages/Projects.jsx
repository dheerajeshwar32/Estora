import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEMO_PROJECTS = [
  {
    id: 1,
    name: 'Estora Horizon',
    status: 'Upcoming',
    location: 'Marine Drive, Mumbai',
    type: 'Luxury Apartments',
    price: 'Starting ₹5 Cr',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 2,
    name: 'The Sapphire Valley',
    status: 'Ongoing',
    location: 'Whitefield, Bangalore',
    type: 'Premium Villas',
    price: 'Starting ₹3.5 Cr',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 3,
    name: 'Oasis Commercial Park',
    status: 'Completed',
    location: 'Cyber City, Gurgaon',
    type: 'Commercial Spaces',
    price: 'Lease / Buy',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'
  }
];

const Projects = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[color:var(--theme-white)] mb-4">New Developments</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
          Discover our exclusive portfolio of upcoming, ongoing, and completed real estate projects.
        </p>
      </div>

      <div className="space-y-12">
        {DEMO_PROJECTS.map((project, i) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-8 bg-navy-900 border border-white/5 rounded-3xl p-4 md:p-6 group hover:border-white/20 transition-all"
          >
            <div className="w-full md:w-1/2 aspect-video md:aspect-auto md:min-h-[300px] rounded-2xl overflow-hidden relative">
              <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md border border-white/20 ${
                  project.status === 'Upcoming' ? 'bg-amber-500/80' : 
                  project.status === 'Ongoing' ? 'bg-blue-500/80' : 'bg-emerald-500/80'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col justify-center p-4">
              <h2 className="text-3xl font-bold text-[color:var(--theme-white)] mb-3">{project.name}</h2>
              <div className="flex items-center gap-2 text-slate-400 mb-6">
                <MapPin size={18} />
                <span>{project.location}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Property Type</p>
                  <p className="text-[color:var(--theme-white)] font-medium">{project.type}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Pricing</p>
                  <p className="text-[color:var(--theme-white)] font-medium">{project.price}</p>
                </div>
              </div>
              
              <Link to={`/project/${project.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors w-fit">
                Explore Project <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;

