import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Users, Building2 } from 'lucide-react';
import SEO from '../components/SEO';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="About Us | Estora"
        description="Learn how Estora combines verified RERA due diligence, private advisory, and Gemini-powered discovery across India's prime real estate markets."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span
            className="text-xs font-bold uppercase tracking-[0.2em] mb-4 inline-block"
            style={{ color: 'var(--estora-gold)' }}
          >
            Architectural Real Estate Advisory
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[color:var(--theme-white)] mb-6">
            About Estora
          </h1>
          <p className="text-slate-400 max-w-3xl mx-auto text-lg font-light leading-relaxed">
            Founded in Bengaluru in 2024, Estora bridges private architectural advisory with intelligent digital discovery.
            We curate RERA-verified residences, boutique villas, coastal retreats, and Grade-A commercial spaces across India&apos;s prime neighborhoods.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            {
              icon: Building2,
              title: 'Curated Portfolio',
              desc: 'Hand-vetted penthouses, villas, plots, and commercial towers across 12+ prime Indian cities.'
            },
            {
              icon: Users,
              title: 'Dedicated Advisors',
              desc: 'Direct guidance from specialized residential and commercial consultants from shortlist to closing.'
            },
            {
              icon: ShieldCheck,
              title: 'RERA & Title Clarity',
              desc: 'Every listing undergoes owner verification, title inspection, and transparent market valuation.'
            },
            {
              icon: Sparkles,
              title: 'AI Concierge Search',
              desc: 'Describe your budget, layout, or neighborhood in plain language to pinpoint matching homes instantly.'
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-navy-900 p-8 rounded-3xl border border-white/10 shadow-[0_14px_40px_-16px_rgba(19,44,99,0.12)] hover:border-[color:var(--estora-gold)] transition-all text-center"
            >
              <div
                className="w-14 h-14 mx-auto bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6"
                style={{ color: 'var(--estora-gold)' }}
              >
                <feature.icon size={24} />
              </div>
              <h2 className="text-lg font-bold text-[color:var(--theme-white)] mb-3">{feature.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-navy-900 border border-white/10 shadow-[0_18px_50px_-18px_rgba(19,44,99,0.14)] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200"
              alt="Estora architectural residential showcase"
              className="rounded-2xl w-full object-cover aspect-video"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold text-[color:var(--theme-white)] mb-6">Our Vision</h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              Buying high-value real estate shouldn&apos;t mean sifting through duplicate listings or opaque pricing.
              Estora unites side-by-side property comparisons, live neighborhood transit metrics, integrated EMI calculators,
              and private site-visit scheduling—giving families and institutional buyers clarity before stepping onto the site.
            </p>
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--estora-gold)' }}>₹420+ Cr</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Advisory Portfolio</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--estora-gold)' }}>12+</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Indian Cities</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--estora-gold)' }}>4.9 / 5</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Client Rating</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">Client Perspectives</h2>
            <p className="text-slate-400 font-light">Feedback from homeowners, commercial investors, and sellers who partnered with Estora.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Ananya Krishnan',
                role: 'Villa Buyer · Bengaluru',
                text: 'Comparing three shortlisted villas side-by-side alongside the built-in EMI estimates saved our family weeks of back-and-forth before booking tours.',
                img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
              },
              {
                name: 'Vikramaditya Nair',
                role: 'Commercial Investor · Navi Mumbai',
                text: 'From floor-plate specs to neighborhood connectivity data around Platinum IT Tower, Estora gave our team clear numbers prior to signing.',
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
              },
              {
                name: 'Meera Deshmukh',
                role: 'Property Seller · Bandra West',
                text: 'Listing our residence on Estora connected us with genuinely qualified buyers within days, and our advisor coordinated every private viewing seamlessly.',
                img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
              }
            ].map((t, i) => (
              <div key={i} className="bg-navy-900 border border-white/10 shadow-[0_14px_40px_-16px_rgba(19,44,99,0.12)] p-8 rounded-3xl relative">
                <div className="text-5xl absolute top-5 right-7 font-serif opacity-25" style={{ color: 'var(--estora-gold)' }}>&rdquo;</div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h3 className="text-white font-medium">{t.name}</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
                <p className="text-slate-300 font-light leading-relaxed relative z-10">{t.text}</p>
                <div className="flex gap-1 mt-6" aria-label="5 out of 5 stars" style={{ color: 'var(--estora-gold)' }}>
                  {[1, 2, 3, 4, 5].map(star => <span key={star} className="text-sm" aria-hidden="true">★</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
