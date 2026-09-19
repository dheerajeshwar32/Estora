import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ id, image, title, price, location, beds, type }) => {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(price);

  return (
    <Link to={`/listing/${id}`} className="group relative block overflow-hidden rounded-2xl aspect-[4/5] bg-[#0E172A] border border-white/5">
      <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110 opacity-80 group-hover:opacity-100" />
      
      {/* Navy gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060B19] via-[#060B19]/50 to-transparent opacity-90"></div>
      
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        <div className="flex justify-end">
          <span className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white rounded-full">
            {type}
          </span>
        </div>

        <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
          <h3 className="text-2xl font-medium text-white mb-2 leading-snug">{title}</h3>
          <p className="text-sm text-slate-300 mb-4 font-light">{location} • {beds} Beds</p>
          <div className="text-xl font-semibold text-white tracking-tight">{formattedPrice}</div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;