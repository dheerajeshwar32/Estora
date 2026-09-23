import React, { useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAppContext } from '../context/AppContext';

const POSTS = [
  {
    id: 1,
    title: '10 Things to Check Before Buying a Luxury Apartment',
    excerpt: 'A comprehensive guide to ensuring your premium property investment meets all structural and legal standards.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800',
    date: 'Oct 12, 2026',
    category: 'Property Guides'
  },
  {
    id: 2,
    title: 'Understanding Real Estate Market Trends in 2026',
    excerpt: 'An analysis of how remote work and sustainability are shifting demands in urban real estate.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
    date: 'Sep 28, 2026',
    category: 'Market Insights'
  },
  {
    id: 3,
    title: 'How to Maximize Rental Yield on Commercial Properties',
    excerpt: 'Expert tips on finding the right commercial tenants and negotiating long-term lease agreements.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    date: 'Sep 15, 2026',
    category: 'Investment'
  }
];

const Blog = () => {
  const { showToast } = useAppContext();
  useEffect(() => {
    document.title = 'Property Guides & Blog | Estora';
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO 
        title="Real Estate Blog & Guides | Estora"
        description="Expert advice, market trends, and property buying guides from Estora."
      />
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-medium text-white mb-6 tracking-tight">Estora Journal</h1>
          <p className="text-lg text-slate-400 font-light leading-relaxed">
            Discover the latest market insights, property guides, and real estate news from our experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {POSTS.map(post => (
            <article key={post.id} className="bg-navy-900 border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all group cursor-pointer">
              <div className="h-48 overflow-hidden relative">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 left-4 bg-navy-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
                  {post.category}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-3">
                  <Calendar size={14} /> {post.date}
                </div>
                <h2 className="text-xl font-medium text-white mb-3 leading-snug group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-400 font-light text-sm leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                <button 
                  onClick={() => showToast('Full article view coming soon.', 'info')}
                  className="text-xs font-bold uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors flex items-center gap-2"
                >
                  Read Article <span>&rarr;</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
};

export default Blog;

