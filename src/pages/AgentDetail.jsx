import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Award, MessageSquare } from 'lucide-react';
import SEO from '../components/SEO';

// Mock DB since agents are mostly static/fictional for this project
const AGENTS = [
  {
    id: "a1",
    name: "Rahul Sharma",
    role: "Senior Property Consultant",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    experience: "12 Years",
    languages: ["English", "Hindi"],
    specialization: "Luxury Villas & Apartments",
    phone: "+91 98765 43210",
    email: "rahul.s@estora.com",
    bio: "Rahul has over a decade of experience in the luxury real estate market. He specializes in high-end villas and penthouses across major metropolitan cities. His client-first approach and deep market knowledge ensure seamless transactions.",
    reviews: 48,
    activeListings: 12
  },
  {
    id: "a2",
    name: "Priya Patel",
    role: "Commercial Real Estate Expert",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    experience: "8 Years",
    languages: ["English", "Hindi", "Gujarati"],
    specialization: "Retail & Office Spaces",
    phone: "+91 98765 43211",
    email: "priya.p@estora.com",
    bio: "Priya focuses exclusively on commercial real estate, helping businesses find the perfect office spaces, retail storefronts, and commercial plots. She is known for her exceptional negotiation skills.",
    reviews: 32,
    activeListings: 8
  },
  {
    id: "a3",
    name: "Arjun Desai",
    role: "Residential Property Specialist",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    experience: "6 Years",
    languages: ["English", "Hindi", "Telugu"],
    specialization: "Residential Homes & Plots",
    phone: "+91 98765 43212",
    email: "arjun.d@estora.com",
    bio: "Arjun specializes in residential properties — from cozy apartments for first-time buyers to premium independent houses and gated community plots. He is passionate about helping families find their dream homes with transparent, hassle-free processes.",
    reviews: 27,
    activeListings: 10
  }
];

const AgentDetail = () => {
  const { id } = useParams();
  const agent = AGENTS.find(a => a.id === id) || AGENTS[0];

  useEffect(() => {
    document.title = `${agent.name} - ${agent.role} | Estora`;
    window.scrollTo(0, 0);
  }, [agent]);

  return (
    <>
      <SEO 
        title={`${agent.name} - ${agent.role} | Estora`}
        description={`Contact ${agent.name}, ${agent.role} at Estora. Specializing in ${agent.specialization}.`}
      />
      
      <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto">
        <Link to="/agents" className="text-slate-500 hover:text-white transition-colors mb-8 inline-block font-bold tracking-widest text-xs uppercase">
          &larr; Back to Directory
        </Link>
        
        <div className="bg-navy-900 rounded-3xl border border-white/5 overflow-hidden flex flex-col md:flex-row">
          {/* Agent Image */}
          <div className="w-full md:w-1/3 bg-navy-950 p-8 flex flex-col items-center justify-center border-r border-white/5">
            <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-white/10">
              <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-medium text-white text-center mb-1">{agent.name}</h1>
            <p className="text-sm text-blue-400 font-medium mb-6 text-center">{agent.role}</p>
            
            <div className="flex gap-4 w-full">
              <a href={`tel:${agent.phone}`} className="flex-1 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-xl py-3 flex justify-center items-center text-white">
                <Phone size={18} />
              </a>
              <a href={`mailto:${agent.email}`} className="flex-1 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-xl py-3 flex justify-center items-center text-white">
                <Mail size={18} />
              </a>
              <button className="flex-1 bg-blue-500 hover:bg-blue-600 transition-colors rounded-xl py-3 flex justify-center items-center text-white shadow-lg shadow-blue-500/20">
                <MessageSquare size={18} />
              </button>
            </div>
          </div>

          {/* Agent Details */}
          <div className="w-full md:w-2/3 p-8 md:p-12">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">About Me</h2>
            <p className="text-slate-300 font-light leading-relaxed mb-10">{agent.bio}</p>
            
            <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-10">
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Experience</h3>
                <p className="text-white font-medium">{agent.experience}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Specialization</h3>
                <p className="text-white font-medium">{agent.specialization}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Languages</h3>
                <p className="text-white font-medium">{agent.languages.join(", ")}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Client Reviews</h3>
                <p className="text-white font-medium flex items-center gap-1.5"><Award size={16} className="text-yellow-500" /> {agent.reviews} 5-Star</p>
              </div>
            </div>

            <div className="bg-navy-950 p-6 rounded-2xl border border-white/5">
              <h3 className="text-lg font-medium text-white mb-2">Want to list your property?</h3>
              <p className="text-sm text-slate-400 font-light mb-4">I currently manage {agent.activeListings} premium listings and am taking on new clients.</p>
              <Link to="/contact" className="inline-block bg-white text-navy-950 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-slate-200 transition-colors">
                Request Callback
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentDetail;

