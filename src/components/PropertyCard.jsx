import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const AMENITY_ICONS = {
  'Pool': '🏊', 'Gym': '🏋️', 'Parking': '🅿️', 'Balcony': '🌇',
  'Garden': '🌿', 'Security': '🔒', 'Power Backup': '⚡', 'Elevator': '🛗',
  'Pet Friendly': '🐾', 'Furnished': '🪑'
};

const PropertyCard = ({ id, image, title, price, location, beds, type, amenities = [], area, status }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { savedListings, toggleSaved } = useAppContext();

  const isSaved = savedListings.some(item => item.id === id);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(price);

  const handleSaveClick = (e) => {
    e.preventDefault(); // Prevents clicking the Link
    toggleSaved({ id, image, title, price, location });
  };

  const previewAmenities = amenities.slice(0, 3);
  
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link to={`/listing/${id}`} className="block" style={{ perspective: "1000px" }}>
      <motion.div 
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative block overflow-hidden rounded-2xl aspect-[4/5] bg-navy-900 border border-white/5 transition-shadow duration-500 hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.25)] hover:border-white/20 will-change-transform"
      >
      
      {!imgLoaded && !imgError && <div className="absolute inset-0 bg-navy-950 animate-pulse"></div>}
      {imgError || !image ? (
        <div className="absolute inset-0 bg-navy-950 flex items-center justify-center"><span className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">No Image</span></div>
      ) : (
        <img src={image} alt={title} loading="lazy" onLoad={() => setImgLoaded(true)} onError={() => setImgError(true)} className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-110 ${imgLoaded ? 'opacity-80 group-hover:opacity-100' : 'opacity-0'}`} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128] via-[#0a1128]/70 to-transparent opacity-90"></div>
      
      <button onClick={handleSaveClick} className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#0a1128]/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-[#0a1128] transition-colors">
        <Heart size={16} className={`transition-colors ${isSaved ? 'fill-blue-500 text-blue-500 group-hover:text-blue-500' : ''}`} />
      </button>
      
      <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 pointer-events-none">
        <div className="flex justify-start gap-2">
          <span className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#ffffff] rounded-full">{type}</span>
          {status && (
            <span className={`backdrop-blur-md border border-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full ${status.toLowerCase() === 'available' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {status}
            </span>
          )}
        </div>
        <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
          <h3 className="text-2xl font-medium text-[#ffffff] mb-2 leading-snug">{title}</h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#cbd5e1] mb-3 font-light">
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#94a3b8]" />{location}</span>
            {(!type.toLowerCase().includes('commercial') && !type.toLowerCase().includes('plot')) && (
              <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-[#94a3b8]" />{beds} Beds</span>
            )}
            {area && (
              <span className="flex items-center gap-1.5"><span className="text-[#94a3b8] text-xs">⛶</span> {area.toLocaleString()} sq.ft</span>
            )}
          </div>
          
          {/* Amenity preview pills */}
          {previewAmenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {previewAmenities.map(a => (
                <span key={a} className="text-[10px] bg-white/10 backdrop-blur-sm border border-white/5 text-[#cbd5e1] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span>{AMENITY_ICONS[a] || '✦'}</span> {a}
                </span>
              ))}
              {amenities.length > 3 && (
                <span className="text-[10px] bg-white/10 backdrop-blur-sm border border-white/5 text-[#cbd5e1] px-2 py-0.5 rounded-full">
                  +{amenities.length - 3}
                </span>
              )}
            </div>
          )}
          
          <div className="text-xl font-semibold text-white tracking-tight">{formattedPrice}</div>
        </div>
      </div>
      </motion.div>
    </Link>
  );
};

export default PropertyCard;