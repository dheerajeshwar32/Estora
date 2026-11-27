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

const getOptimizedImageUrl = (url, width = 600) => {
  if (!url) return url;
  if (url.includes('images.unsplash.com')) {
    const base = url.split('?')[0];
    return `${base}?auto=format&fit=crop&w=${width}&q=75`;
  }
  return url;
};

const PropertyCard = ({ id, image, title, price, location, beds, type, amenities = [], area, status, transactionType }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { savedListings, toggleSaved } = useAppContext();

  const optimizedImage = getOptimizedImageUrl(image, 600);

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
  
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const target = e.currentTarget;
    const width = target.clientWidth;
    const height = target.clientHeight;
    if (!width || !height) return;
    const rect = target.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
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
        className="group relative block overflow-hidden rounded-2xl aspect-[4/5] bg-navy-900 border border-white/10 shadow-[0_12px_36px_-14px_rgba(19,44,99,0.22)] transition-[box-shadow,border-color] duration-500 hover:shadow-[0_24px_55px_-12px_rgba(19,44,99,0.45)] hover:border-[#D8BE8F]/50 will-change-transform"
      >
      
      {!imgLoaded && !imgError && <div className="absolute inset-0 bg-navy-950 animate-pulse"></div>}
      {imgError || !image ? (
        <div className="absolute inset-0 bg-navy-950 flex items-center justify-center"><span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No Image</span></div>
      ) : (
        <img src={optimizedImage} alt={title} loading="lazy" decoding="async" onLoad={() => setImgLoaded(true)} onError={() => setImgError(true)} className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${imgLoaded ? 'opacity-90 group-hover:opacity-100' : 'opacity-0'}`} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#091638]/90 via-[#0d1f4a]/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"></div>
      
      <div className="absolute inset-0 p-4 flex flex-col justify-between z-10 pointer-events-none">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {type && (
              <span className="bg-[#0d1f4a]/60 backdrop-blur-md border border-[#ffffff]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#ffffff] rounded-full shadow-sm">
                {type}
              </span>
            )}
            {(isRent || isSale) ? (
              <span className={`backdrop-blur-md border border-[#ffffff]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] rounded-full shadow-sm ${isRent ? 'bg-[#1a4396]/85 text-[#ffffff]' : 'bg-[#15694b]/85 text-[#ffffff]'}`}>
                FOR {isRent ? 'RENT' : 'SALE'}
              </span>
            ) : status ? (
              <span className="backdrop-blur-md border border-[#ffffff]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] rounded-full shadow-sm bg-[#0d1f4a]/60 text-[#e2e8f0]">
                {status}
              </span>
            ) : null}
          </div>

          <button onClick={handleSaveClick} aria-label={isSaved ? 'Remove from saved properties' : 'Save property'} className="pointer-events-auto shrink-0 p-2 rounded-full bg-[#0d1f4a]/55 backdrop-blur-md border border-[#ffffff]/20 text-[#ffffff] hover:bg-[#ffffff] hover:text-[#132c63] transition-colors shadow-lg">
            <Heart size={15} className={`transition-colors ${isSaved ? 'fill-[#D8BE8F] text-[#D8BE8F]' : ''}`} />
          </button>
        </div>
        
        <div className="transform transition-all duration-300 translate-y-1 group-hover:translate-y-0 bg-[#0a173b]/38 backdrop-blur-md border border-[#ffffff]/15 rounded-2xl p-4 shadow-[0_12px_30px_rgba(9,22,56,0.35)]">
          <h3 className="text-lg sm:text-xl font-medium text-[#ffffff] mb-1 leading-snug line-clamp-1 group-hover:text-[#D8BE8F] transition-colors">{title}</h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#d6e2f5] mb-2.5 font-light">
            <span className="flex items-center gap-1"><MapPin size={12} className="text-[#D8BE8F]" />{location}</span>
            {(!type?.toLowerCase().includes('commercial') && !type?.toLowerCase().includes('plot')) && (
              <span className="flex items-center gap-1"><BedDouble size={12} className="text-[#D8BE8F]" />{beds} Beds</span>
            )}
            {area && (
              <span className="flex items-center gap-1"><span className="text-[#D8BE8F] text-[10px]">⛶</span> {area.toLocaleString()} sq.ft</span>
            )}
          </div>
          
          {previewAmenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 h-0 group-hover:h-auto group-hover:mb-2.5 overflow-hidden">
              {previewAmenities.map(a => (
                <span key={a} className="text-[10px] bg-[#112659]/75 border border-[#ffffff]/15 text-[#d6e2f5] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span>{AMENITY_ICONS[a] || '✦'}</span> {a}
                </span>
              ))}
              {amenities.length > 3 && (
                <span className="text-[10px] bg-[#112659]/75 border border-[#ffffff]/15 text-[#d6e2f5] px-2 py-0.5 rounded-full">
                  +{amenities.length - 3}
                </span>
              )}
            </div>
          )}
          
          <div className="text-xl font-semibold text-[#ffffff] tracking-tight group-hover:text-[#D8BE8F] transition-colors duration-300 drop-shadow-md">
            {formattedPrice}
          </div>
        </div>
      </div>
      </motion.div>
    </Link>
  );
};

export default PropertyCard;