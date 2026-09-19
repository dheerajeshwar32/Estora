import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      // Safety check to prevent crashing on /undefined
      if (!id || id === 'undefined') {
        setLoading(false);
        return; 
      }
      
      try {
        const docRef = doc(db, 'listings', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center text-xl font-medium text-slate-500 animate-pulse mt-20">Loading details...</div>;
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-white mb-4">Property not found</h2>
        <Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
          &larr; Return to Discover
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    maximumFractionDigits: 0 
  }).format(property.price);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="text-slate-500 hover:text-white transition-colors mb-8 inline-block font-bold tracking-widest text-xs uppercase">
        &larr; Back to Discover
      </Link>
      
      <div className="bg-[#0E172A] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        
        {/* Safely handle missing/broken images */}
        {property.images?.[0] ? (
          <img src={property.images[0]} alt={property.title} className="w-full h-[400px] md:h-[500px] object-cover opacity-90" />
        ) : (
          <div className="w-full h-[400px] bg-[#060B19] flex items-center justify-center text-slate-600 font-medium tracking-widest uppercase">
            No Image Available
          </div>
        )}
        
        <div className="p-8 md:p-14">
          <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
            <div>
              <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">{property.propertyType}</div>
              <h1 className="text-4xl md:text-5xl font-medium text-white mb-4 leading-tight">{property.title}</h1>
              <p className="text-lg text-slate-400 font-light">{property.location}</p>
            </div>
            <div className="text-3xl md:text-4xl font-semibold text-white tracking-tight">{formattedPrice}</div>
          </div>

          <div className="flex gap-10 border-y border-white/10 py-8 mb-10 text-slate-300">
            {property.bedrooms > 0 && (
              <div className="flex flex-col">
                <span className="text-3xl font-medium text-white mb-1">{property.bedrooms}</span> 
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bedrooms</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex flex-col">
                <span className="text-3xl font-medium text-white mb-1">{property.bathrooms}</span> 
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bathrooms</span>
              </div>
            )}
          </div>

          <div className="mb-12">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-5">About this property</h2>
            <p className="text-slate-300 leading-relaxed font-light text-lg">{property.description}</p>
          </div>

          <div className="bg-[#060B19] rounded-2xl p-8 border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Listed By</h2>
              <p className="text-white text-lg font-medium">{property.agentContact}</p>
            </div>
            <button className="w-full md:w-auto bg-white text-[#060B19] font-bold tracking-wide py-4 px-10 rounded-full hover:bg-slate-200 transition-colors">
              Contact Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;