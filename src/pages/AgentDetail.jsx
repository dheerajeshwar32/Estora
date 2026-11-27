import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Award, MessageSquare } from 'lucide-react';
import SEO from '../components/SEO';


const AGENTS = [
  {
    id: "a1",
    name: "Rahul Sharma",
    role: "Senior Luxury Consultant",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    experience: "12 Years",
    languages: ["English", "Hindi", "Marathi"],
    specialization: "Villas & Penthouses",
    phone: "+91 98204 71420",
    email: "rahul.s@estora.com",
    bio: "Rahul leads residential advisory across Mumbai, Pune, and coastal retreats in Alibaug and Goa. Over 12 years, he has structured private acquisitions of sea-facing penthouses and bespoke estates with thorough title verification.",
    reviews: 42,
    activeListings: 14
  },
  {
    id: "a2",
    name: "Priya Patel",
    role: "Commercial Real Estate Advisor",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    experience: "9 Years",
    languages: ["English", "Hindi", "Gujarati"],
    specialization: "Grade-A Offices & Retail",
    phone: "+91 98114 63890",
    email: "priya.p@estora.com",
    bio: "Priya advises corporate occupiers and commercial investors across Navi Mumbai, Gurgaon Cyber City, and Hyderabad HITEC districts—specializing in institutional yield modeling, LEED-certified office towers, and retail leases.",
    reviews: 31,
    activeListings: 9
  },
  {
    id: "a3",
    name: "Arjun Desai",
    role: "Residential Estates Specialist",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
    experience: "6 Years",
    languages: ["English", "Hindi", "Kannada", "Telugu"],
    specialization: "Homes & Plotted Estates",
    phone: "+91 98452 39180",
    email: "arjun.d@estora.com",
    bio: "Based in Bengaluru, Arjun assists families and NRI buyers across Whitefield, Indiranagar, Chennai, and Hyderabad—guiding everything from gated plotted developments to turnkey smart residences with full RERA documentation checks.",
    reviews: 26,
    activeListings: 11
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
          {}
          <div className="w-full md:w-1/3 bg-navy-950 p-8 flex flex-col items-center justify-center border-r border-white/5">
            <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-white/10">
              <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-medium text-white text-center mb-1">{agent.name}</h1>
            <p className="text-sm text-blue-400 font-medium mb-6 text-center">{agent.role}</p>
            
            <div className="flex gap-4 w-full">
              <a href={`tel:${agent.phone}`} aria-label={`Call ${agent.name}`} className="flex-1 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-xl py-3 flex justify-center items-center text-white">
                <Phone size={18} />
              </a>
              <a href={`mailto:${agent.email}`} aria-label={`Email ${agent.name}`} className="flex-1 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-xl py-3 flex justify-center items-center text-white">
                <Mail size={18} />
              </a>
              <button aria-label={`Message ${agent.name}`} className="flex-1 bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl py-3 flex justify-center items-center text-[#ffffff] shadow-lg shadow-blue-500/20">
                <MessageSquare size={18} />
              </button>
            </div>
          </div>

          {}
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

