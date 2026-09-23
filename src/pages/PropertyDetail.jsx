import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, serverTimestamp, updateDoc, increment, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { MapPin, BedDouble, Bath, Share, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import ImageGallery from '../components/ImageGallery';
import PropertyCard from '../components/PropertyCard';
import MortgageCalculator from '../components/MortgageCalculator';
import ScheduleTourModal from '../components/ScheduleTourModal';
import NeighborhoodStats from '../components/NeighborhoodStats';
import FAQAccordion from '../components/FAQAccordion';
import SEO from '../components/SEO';

const AMENITY_ICONS = {
  'Pool': '🏊', 'Gym': '🏋️', 'Parking': '🅿️', 'Balcony': '🌇',
  'Garden': '🌿', 'Security': '🔒', 'Power Backup': '⚡', 'Elevator': '🛗',
  'Pet Friendly': '🐾', 'Furnished': '🪑'
};

// Skeleton loader matching the page layout
const DetailSkeleton = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="w-40 h-4 bg-white/5 rounded-lg mb-8 animate-pulse" />
    <div className="bg-navy-900 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
      {/* Image skeleton */}
      <div className="w-full h-[400px] md:h-[500px] bg-navy-950 animate-pulse" />
      <div className="p-8 md:p-14">
        {/* Title area */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
          <div className="flex-1">
            <div className="w-24 h-4 bg-white/10 rounded-full mb-4 animate-pulse" />
            <div className="w-3/4 h-10 bg-white/10 rounded-xl mb-3 animate-pulse" />
            <div className="w-1/2 h-6 bg-white/5 rounded-lg animate-pulse" />
          </div>
          <div className="w-40 h-10 bg-white/10 rounded-xl animate-pulse" />
        </div>
        {/* Stats */}
        <div className="flex gap-10 border-y border-white/10 py-8 mb-10">
          <div className="w-28 h-16 bg-white/5 rounded-xl animate-pulse" />
          <div className="w-28 h-16 bg-white/5 rounded-xl animate-pulse" />
        </div>
        {/* Description */}
        <div className="mb-12 space-y-3">
          <div className="w-32 h-4 bg-white/10 rounded-lg animate-pulse" />
          <div className="w-full h-4 bg-white/5 rounded-lg animate-pulse" />
          <div className="w-full h-4 bg-white/5 rounded-lg animate-pulse" />
          <div className="w-2/3 h-4 bg-white/5 rounded-lg animate-pulse" />
        </div>
        {/* Agent */}
        <div className="bg-navy-950 rounded-2xl p-8 border border-white/5 flex justify-between items-center">
          <div className="w-40 h-10 bg-white/5 rounded-lg animate-pulse" />
          <div className="w-36 h-12 bg-white/10 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { showToast } = useAppContext();
  const [isScheduleTourOpen, setIsScheduleTourOpen] = useState(false);

  // Set dynamic page title
  useEffect(() => {
    if (property) {
      document.title = `${property.title} in ${property.location} — Estora`;
    } else {
      document.title = 'Property Details — Estora';
    }
    return () => { document.title = 'Estora — Discover Premium Properties'; };
  }, [property]);

  const [similarProperties, setSimilarProperties] = useState([]);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id || id === 'undefined') return setLoading(false);
      try {
        const docRef = doc(db, 'listings', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setProperty(data);
          
          // Increment view counter
          try {
            await updateDoc(docRef, { views: increment(1) });
          } catch (err) { console.error('Failed to increment views:', err); }

          // Fetch similar properties
          try {
            const listingsRef = collection(db, 'listings');
            const q = query(
              listingsRef, 
              where('propertyType', '==', data.propertyType),
              limit(4)
            );
            const querySnapshot = await getDocs(q);
            const similar = [];
            querySnapshot.forEach(d => {
              if (d.id !== id) similar.push({ id: d.id, ...d.data() });
            });
            setSimilarProperties(similar.slice(0, 3));
          } catch (err) { console.error('Failed to fetch similar:', err); }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleShare = async () => {
    const shareData = { title: property.title, text: `Check out this property in ${property.location} on Estora.`, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };



  if (loading) return <DetailSkeleton />;
  if (!property) return <div className="flex flex-col items-center justify-center min-h-[60vh]"><h2 className="text-2xl font-bold text-white mb-4">Property not found</h2><Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors">&larr; Return to Discover</Link></div>;

  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.price);
  const amenities = property.amenities || [];

  return (
    <>
      <SEO 
        title={`${property.title} | Estora`}
        description={`Explore ${property.title} located in ${property.location}. Price: ${formattedPrice}.`}
        image={property.images?.[0]}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="text-slate-500 hover:text-white transition-colors mb-8 inline-block font-bold tracking-widest text-xs uppercase">&larr; Back to Discover</Link>
        <div className="bg-navy-900 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          
          {/* Image Gallery */}
          <ImageGallery images={property.images} />
          
          <div className="p-8 md:p-14">
            <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
              <div>
                <div className="flex gap-4 items-center mb-3">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">{property.propertyType}</span>
                  <button onClick={handleShare} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium bg-white/5 px-3 py-1 rounded-full"><Share size={12}/> Share</button>
                </div>
                <h1 className="text-4xl md:text-5xl font-medium text-white mb-4 leading-tight">{property.title}</h1>
                <p className="text-lg text-slate-400 font-light flex items-center gap-2"><MapPin size={20} /> {property.location}</p>
              </div>
              <div className="text-3xl md:text-4xl font-semibold text-white tracking-tight">{formattedPrice}</div>
            </div>

            <div className="flex gap-10 border-y border-white/10 py-8 mb-10 text-slate-300 overflow-x-auto">
              {(!property.propertyType.toLowerCase().includes('commercial') && !property.propertyType.toLowerCase().includes('plot') && property.bedrooms > 0) && (
                <div className="flex flex-col min-w-[100px]">
                  <span className="text-3xl font-medium text-white mb-2 flex items-center gap-3"><BedDouble size={28} className="text-slate-500" /> {property.bedrooms}</span> 
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bedrooms</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex flex-col min-w-[100px]">
                  <span className="text-3xl font-medium text-white mb-2 flex items-center gap-3"><Bath size={28} className="text-slate-500" /> {property.bathrooms}</span> 
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bathrooms</span>
                </div>
              )}
              {property.area > 0 && (
                <div className="flex flex-col min-w-[120px]">
                  <span className="text-3xl font-medium text-white mb-2 flex items-center gap-3"><span className="text-2xl text-slate-500">⛶</span> {property.area?.toLocaleString()}</span> 
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sq. Ft.</span>
                </div>
              )}
              {property.status && (
                <div className="flex flex-col min-w-[100px]">
                  <span className={`text-xl md:text-2xl font-medium mb-2 mt-1 ${property.status === 'available' ? 'text-green-400' : 'text-red-400'}`}>{property.status}</span> 
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</span>
                </div>
              )}
              {property.propertyId && (
                <div className="flex flex-col min-w-[120px]">
                  <span className="text-xl md:text-2xl font-medium text-white mb-2 mt-1">{property.propertyId}</span> 
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Property ID</span>
                </div>
              )}
            </div>

            {/* Amenities Section */}
            {amenities.length > 0 && (
              <div className="mb-10">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-5">Amenities</h2>
                <div className="flex flex-wrap gap-3">
                  {amenities.map(amenity => (
                    <span key={amenity} className="flex items-center gap-2 bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 rounded-xl font-medium">
                      <span className="text-lg">{AMENITY_ICONS[amenity] || '✦'}</span> {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-12">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-5">About this property</h2>
              <p className="text-slate-300 leading-relaxed font-light text-lg">{property.description}</p>
            </div>

            {/* Floor Plan Section */}
            {(!property.propertyType.toLowerCase().includes('plot')) && (
              <div className="mb-12">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-5">Floor Plan</h2>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 overflow-hidden">
                   <ImageGallery images={[property.floorPlan || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200"]} />
                </div>
              </div>
            )}

            {/* Mortgage Calculator */}
            <MortgageCalculator price={property.price} />

            {/* Neighborhood Stats */}
            <NeighborhoodStats location={property.location} type={property.propertyType} />

            {/* FAQ Accordion */}
            <FAQAccordion />

            <div className="bg-navy-950 rounded-2xl p-8 border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                <div>
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Listed By</h2>
                  <p className="text-white text-lg font-medium">{property.agentContact}</p>
                </div>
                <button onClick={() => setIsScheduleTourOpen(true)} className="w-full md:w-auto bg-white text-navy-950 font-bold tracking-wide py-4 px-10 rounded-full hover:bg-slate-200 transition-colors">Schedule a Tour</button>
              </div>

              {/* Similar Properties */}
              {similarProperties.length > 0 && (
                <div className="border-t border-white/5 pt-12">
                  <h2 className="text-xl font-medium text-white mb-6">Similar Properties</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {similarProperties.map(listing => (
                      <PropertyCard
                        key={listing.id}
                        id={listing.id}
                        image={listing.images?.[0]}
                        title={listing.title}
                        price={listing.price}
                        location={listing.location}
                        beds={listing.bedrooms}
                        baths={listing.bathrooms}
                        type={listing.propertyType}
                        amenities={listing.amenities}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      <ScheduleTourModal 
        isOpen={isScheduleTourOpen} 
        onClose={() => setIsScheduleTourOpen(false)} 
        property={property} 
        showToast={showToast} 
      />
    </>
  );
};

export default PropertyDetail;