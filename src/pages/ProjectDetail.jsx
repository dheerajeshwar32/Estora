import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Building, Calendar, CheckCircle2, Ruler, Download, ArrowRight } from 'lucide-react';
import NeighborhoodStats from '../components/NeighborhoodStats';
import { useAppContext } from '../context/AppContext';
import ScheduleTourModal from '../components/ScheduleTourModal';

const PROJECT_DATA = {
  1: {
    name: 'Estora Horizon', developer: 'Estora Developers', location: 'Marine Drive, Mumbai',
    overview: 'A beacon of modern luxury architecture, Estora Horizon offers panoramic ocean views with world-class amenities.',
    config: '3 & 4 BHK Ultra-Luxury Apartments', price: '₹5 Cr - ₹12 Cr',
    units: 120, status: 'Upcoming', possession: 'Dec 2027',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200'
  },
  2: {
    name: 'The Sapphire Valley', developer: 'Estora Developers', location: 'Whitefield, Bangalore',
    overview: 'Sprawling premium villas nestled in 50 acres of lush greenery, offering the perfect blend of nature and smart-home technology.',
    config: '4 & 5 BHK Premium Villas', price: '₹3.5 Cr - ₹8 Cr',
    units: 85, status: 'Ongoing', possession: 'Aug 2026',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'
  },
  3: {
    name: 'Oasis Commercial Park', developer: 'Estora Developers', location: 'Cyber City, Gurgaon',
    overview: 'Grade-A commercial spaces designed for the modern enterprise, featuring LEED-certified sustainable architecture.',
    config: 'Commercial Office Spaces', price: 'Lease / Buy',
    units: 200, status: 'Completed', possession: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'
  }
};

const ProjectDetail = () => {
  const { id } = useParams();
  const { showToast } = useAppContext();
  const project = PROJECT_DATA[id] || PROJECT_DATA[2]; // Default to 2 if not found
  const [activeTab, setActiveTab] = useState('overview');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  return (
    <div className="min-h-screen bg-navy-950 pb-20">
      <ScheduleTourModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} propertyId={`project-${id}`} />
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white bg-blue-500 mb-4 inline-block">
                {project.status}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{project.name}</h1>
              <p className="text-lg text-slate-300 flex items-center gap-2"><MapPin size={20}/> {project.location}</p>
            </div>
            <div className="bg-navy-900/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center md:text-right">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Starting Price</p>
              <p className="text-3xl font-bold text-white">{project.price}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            {/* Quick Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Developer', value: project.developer, icon: Building },
                { label: 'Configuration', value: project.config, icon: Ruler },
                { label: 'Total Units', value: project.units, icon: CheckCircle2 },
                { label: 'Possession', value: project.possession, icon: Calendar }
              ].map((spec, i) => (
                <div key={i} className="bg-navy-900 border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                  <spec.icon size={24} className="text-blue-400 mb-2" />
                  <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-1">{spec.label}</p>
                  <p className="text-sm font-medium text-white">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Project Overview</h2>
              <p className="text-slate-300 leading-relaxed font-light text-lg">{project.overview}</p>
            </div>

            {/* Construction Updates */}
            {project.status !== 'Completed' && (
              <div className="bg-navy-900 border border-white/5 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Construction Updates</h2>
                <div className="space-y-6">
                  {[
                    { stage: 'Foundation', status: 'Completed', active: true },
                    { stage: 'Structure', status: 'Completed', active: true },
                    { stage: 'Flooring', status: 'In Progress', active: true },
                    { stage: 'Interiors', status: 'Upcoming', active: false },
                    { stage: 'Handover', status: 'Upcoming', active: false }
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.status === 'Completed' ? 'bg-green-500 text-white' : step.status === 'In Progress' ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-500'}`}>
                        {step.status === 'Completed' ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold ${step.active ? 'text-white' : 'text-slate-500'}`}>{step.stage}</p>
                      </div>
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-widest ${step.status === 'Completed' ? 'text-green-400' : step.status === 'In Progress' ? 'text-blue-400' : 'text-slate-500'}`}>
                          {step.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <NeighborhoodStats location={project.location} type={project.config} />
          </div>

          {/* Sidebar CTA */}
          <div className="space-y-6">
            <div className="bg-navy-900 border border-white/5 rounded-3xl p-8 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-2">Interested in {project.name}?</h3>
              <p className="text-slate-400 text-sm mb-6">Download the brochure or schedule a site visit to learn more.</p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setIsScheduleOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar size={18} /> Schedule Site Visit
                </button>
                <button 
                  onClick={() => showToast('Brochure download will start shortly.', 'info')}
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 border border-white/10"
                >
                  <Download size={18} /> Download Brochure
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

