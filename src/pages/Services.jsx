import React, { useEffect } from 'react';
import { Building2, Key, Home, Briefcase, Landmark, Handshake, Map, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const services = [
  {
    icon: Building2,
    title: 'Property Buying',
    description: 'Expert guidance through the entire property buying process, from search to closing.'
  },
  {
    icon: Key,
    title: 'Property Selling',
    description: 'Maximize your property value with our strategic marketing and extensive network.'
  },
  {
    icon: Home,
    title: 'Property Rental',
    description: 'Find the perfect rental home or get reliable tenants for your investment property.'
  },
  {
    icon: Briefcase,
    title: 'Property Management',
    description: 'Complete end-to-end management services for property owners and investors.'
  },
  {
    icon: Landmark,
    title: 'Commercial Property',
    description: 'Specialized services for office spaces, retail outlets, and commercial plots.'
  },
  {
    icon: Handshake,
    title: 'Investment Assistance',
    description: 'Data-driven insights to help you build a profitable real estate portfolio.'
  },
  {
    icon: Map,
    title: 'Site Visits',
    description: 'Guided physical and virtual tours of premium properties.'
  },
  {
    icon: FileText,
    title: 'Documentation Assistance',
    description: 'Hassle-free legal and financial documentation handled by our experts.'
  }
];

const Services = () => {
  useEffect(() => {
    document.title = 'Our Services | Estora';
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO 
        title="Our Services | Estora"
        description="Comprehensive real estate services including buying, selling, property management, and commercial leasing."
      />
      
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-medium text-white mb-6 tracking-tight">Our Expertise</h1>
          <p className="text-lg text-slate-400 font-light leading-relaxed">
            From first-time homebuyers to seasoned investors, our comprehensive suite of real estate services is designed to meet your every need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <div key={idx} className="bg-navy-900 border border-white/5 p-8 rounded-3xl hover:border-white/20 transition-all group">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                <service.icon size={28} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">{service.title}</h3>
              <p className="text-slate-400 font-light text-sm leading-relaxed mb-6">{service.description}</p>
              <Link to="/contact" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center gap-2">
                Learn More <span>&rarr;</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Services;

