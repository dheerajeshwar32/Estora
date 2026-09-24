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

const PropertyCard = ({ id, image, title, price, location, beds, type, amenities = [], area, status, transactionType }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { savedListings, toggleSaved } = useAppContext();

  const isSaved = savedListings.some(item => item.id === id);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(price);

  const handleSaveClick = (e) => {
    e.preventDefault();
    toggleSaved({ id, image, title, price, location, propertyType: type, bedrooms: beds, amenities, area, status, transactionType });
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

  const txType = transactionType?.toLowerCase() || status?.toLowerCase();
  const isRent = txType === 'rent';
  const isSale = txType === 'sale' || txType === 'buy';

  return (
    <Link to={`/listing/${id}`} className="block" style={{ perspective: "1000px" }}>
      <motion.div 
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative block overflow-hidden rounded-2xl aspect-[4/5] bg-navy-900 border border-white/5 transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.3)] hover:border-white/30 will-change-transform"
      >
      
      {!imgLoaded && !imgError && <div className="absolute inset-0 bg-navy-950 animate-pulse"></div>}
      {imgError || !image ? (
        <div className="absolute inset-0 bg-navy-950 flex items-center justify-center"><span className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">No Image</span></div>
      ) : (
        <img src={image} alt={title} loading="lazy" onLoad={() => setImgLoaded(true)} onError={() => setImgError(true)} className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${imgLoaded ? 'opacity-90 group-hover:opacity-100' : 'opacity-0'}`} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-[#0a1128]/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"></div>
      
      <button onClick={handleSaveClick} className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#0a1128]/40 backdrop-blur-md border border-[#ffffff]/10 text-[#ffffff] hover:bg-[#ffffff] hover:text-[#0a1128] transition-colors shadow-lg">
        <Heart size={16} className={`transition-colors ${isSaved ? 'fill-blue-500 text-blue-500 group-hover:text-blue-500' : ''}`} />
      </button>
      
      <div className="absolute inset-0 p-5 flex flex-col justify-between z-10 pointer-events-none">
        <div className="flex justify-start gap-2">
          {type && (
            <span className="bg-black/20 backdrop-blur-md border border-[#ffffff]/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#ffffff] rounded-full shadow-sm">
              {type}
            </span>
          )}
          {(isRent || isSale) ? (
            <span className={`backdrop-blur-md border border-[#ffffff]/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm ${isRent ? 'bg-blue-500/80 text-blue-100' : 'bg-green-500/80 text-green-100'}`}>
              FOR {isRent ? 'RENT' : 'SALE'}
            </span>
          ) : status ? (
            <span className="backdrop-blur-md border border-[#ffffff]/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm bg-black/20 text-[#e2e8f0]">
              {status}
            </span>
          ) : null}
        </div>
        
        <div className="transform transition-all duration-500 translate-y-6 group-hover:translate-y-0 bg-black/20 backdrop-blur-xl border border-[#ffffff]/10 rounded-2xl p-5 -mx-2 -mb-2 shadow-2xl">
          <h3 className="text-xl font-medium text-[#ffffff] mb-1.5 leading-snug line-clamp-1 group-hover:text-blue-300 transition-colors">{title}</h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#cbd5e1] mb-3 font-light">
            <span className="flex items-center gap-1"><MapPin size={12} className="text-blue-400" />{location}</span>
            {(!type?.toLowerCase().includes('commercial') && !type?.toLowerCase().includes('plot')) && (
              <span className="flex items-center gap-1"><BedDouble size={12} className="text-blue-400" />{beds} Beds</span>
            )}
            {area && (
              <span className="flex items-center gap-1"><span className="text-blue-400 text-[10px]">⛶</span> {area.toLocaleString()} sq.ft</span>
            )}
          </div>
          
          {previewAmenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 h-0 group-hover:h-auto overflow-hidden">
              {previewAmenities.map(a => (
                <span key={a} className="text-[10px] bg-black/30 border border-[#ffffff]/10 text-[#cbd5e1] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span>{AMENITY_ICONS[a] || '✦'}</span> {a}
                </span>
              ))}
              {amenities.length > 3 && (
                <span className="text-[10px] bg-black/30 border border-[#ffffff]/10 text-[#cbd5e1] px-2 py-0.5 rounded-full">
                  +{amenities.length - 3}
                </span>
              )}
            </div>
          )}
          
          <div className="text-xl font-semibold text-[#ffffff] tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300 drop-shadow-md">
            {formattedPrice}
          </div>
        </div>
      </div>
      </motion.div>
    </Link>
  );
};

export default PropertyCard;