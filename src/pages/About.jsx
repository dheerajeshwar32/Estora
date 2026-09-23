import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Users, Building } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[color:var(--theme-white)] mb-6">About Estora</h1>
        <p className="text-slate-400 max-w-3xl mx-auto text-lg font-light leading-relaxed">
          At Estora, we believe that finding a home should be an intuitive, transparent, and beautiful experience. 
          Founded in 2024, we combine cutting-edge technology with deep market expertise to curate the finest properties globally.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {[
          { icon: Building, title: 'Premium Portfolio', desc: 'Over 10,000 curated luxury properties across 50+ countries.' },
          { icon: Users, title: 'Expert Agents', desc: 'A dedicated team of 500+ certified real estate professionals.' },
          { icon: Shield, title: 'Secure Transactions', desc: 'End-to-end encrypted document management and secure payments.' },
          { icon: Target, title: 'AI-Driven', desc: 'Smart matching algorithms to find your perfect property faster.' }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-navy-900 p-8 rounded-3xl border border-white/5 text-center"
          >
            <div className="w-14 h-14 mx-auto bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <feature.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-[color:var(--theme-white)] mb-3">{feature.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-navy-950 border border-white/5 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2">
          <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" alt="Office" className="rounded-2xl w-full object-cover aspect-video" />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-[color:var(--theme-white)] mb-6">Our Vision</h2>
          <p className="text-slate-400 leading-relaxed mb-6">
            We envision a world where geographical boundaries don't limit your choice of a home. 
            By integrating virtual reality tours, real-time market analytics, and AI-powered recommendations, 
            Estora is redefining the standard for global real estate platforms.
          </p>
          <div className="flex gap-8">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-1">$2B+</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Sales Volume</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-1">98%</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">What Our Clients Say</h2>
          <p className="text-slate-400 font-light">Real experiences from people who found their dream properties with Estora.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Sarah Jenkins', role: 'Homebuyer', text: 'Estora made buying our first home incredibly easy. The virtual tours saved us so much time!', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
            { name: 'Michael Chen', role: 'Property Investor', text: 'The analytics and seamless interface helped me identify high-yield commercial properties instantly.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
            { name: 'Emily Rodriguez', role: 'Seller', text: 'I listed my villa and within 48 hours had verified buyers. The process was transparent and secure.', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' }
          ].map((t, i) => (
            <div key={i} className="bg-navy-900 border border-white/5 p-8 rounded-3xl relative">
              <div className="text-blue-500/20 text-6xl absolute top-4 right-6 font-serif">"</div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="text-white font-medium">{t.name}</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
              <p className="text-slate-300 font-light leading-relaxed relative z-10">{t.text}</p>
              <div className="flex gap-1 mt-6">
                {[1, 2, 3, 4, 5].map(star => <span key={star} className="text-yellow-500 text-sm">★</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;

