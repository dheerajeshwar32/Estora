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
const PropertyEnquiryForm = ({ propertyId }) => {
  const { showToast } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', mobile: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        type: 'property_enquiry',
        propertyId,
        createdAt: serverTimestamp(),
        ...formData
      });
      showToast('Enquiry sent successfully!', 'success');
      setFormData({ fullName: '', mobile: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      showToast('Failed to send enquiry', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
      <h3 className="text-xl font-medium text-white mb-6">Interested in this property?</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
          <input required type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full bg-navy-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Mobile Number</label>
          <input required type="tel" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full bg-navy-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="+91 98765 43210" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email</label>
          <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-navy-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="john@example.com" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Message</label>
          <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-navy-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="I would like to know more about this property..." />
        </div>
        <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide py-4 rounded-xl transition-colors mt-4">
          {loading ? 'Sending...' : 'Send Enquiry'}
        </button>
      </form>
    </div>
  );
};

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="text-slate-500 hover:text-white transition-colors mb-8 inline-block font-bold tracking-widest text-xs uppercase">&larr; Back to Discover</Link>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
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
                    <h1 className="text-4xl md:text-5xl font-medium text-white mb-4 leading-tight break-words">{property.title}</h1>
                    <p className="text-lg text-slate-400 font-light flex items-center gap-2 break-words"><MapPin size={20} className="shrink-0" /> {property.location}</p>
                  </div>
                  <div className="text-3xl md:text-4xl font-semibold text-white tracking-tight break-words">{formattedPrice}</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-y border-white/10 py-8 mb-10 text-slate-300">
                  {(!(property.propertyType || '').toLowerCase().includes('commercial') && !(property.propertyType || '').toLowerCase().includes('plot') && property.bedrooms > 0) && (
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-medium text-white mb-2 flex items-center gap-3"><BedDouble size={28} className="text-blue-400" /> {property.bedrooms}</span> 
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bedrooms</span>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-medium text-white mb-2 flex items-center gap-3"><Bath size={28} className="text-blue-400" /> {property.bathrooms}</span> 
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bathrooms</span>
                    </div>
                  )}
                  {property.area > 0 && (
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-medium text-white mb-2 flex items-center gap-3"><span className="text-2xl text-blue-400">⛶</span> {property.area?.toLocaleString()}</span> 
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sq. Ft.</span>
                    </div>
                  )}
                  {property.status && (
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center text-center">
                      <span className={`text-2xl font-medium mb-2 ${property.status === 'available' ? 'text-green-400' : 'text-red-400'}`}>{property.status}</span> 
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</span>
                    </div>
                  )}
                  {property.propertyId && (
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-medium text-white mb-2">{property.propertyId}</span> 
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
                {(!(property.propertyType || '').toLowerCase().includes('plot')) && (
                  <div className="mb-12">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-5">Floor Plan</h2>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 overflow-hidden">
                      {property.floorPlan ? (
                        <ImageGallery images={[property.floorPlan]} />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                          <div className="w-16 h-16 bg-navy-950 rounded-full flex items-center justify-center mb-4 border border-white/10">
                            <span className="text-2xl text-slate-500">⛶</span>
                          </div>
                          <h3 className="text-xl font-medium text-white mb-2">Floor Plan Available Upon Request</h3>
                          <p className="text-slate-400 font-light">Contact our team to view detailed floor plans for this property.</p>
                        </div>
                      )}
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
                    <p className="text-white text-lg font-medium break-all">{property.agentContact}</p>
                  </div>
                  <button onClick={() => setIsScheduleTourOpen(true)} className="w-full md:w-auto bg-white text-navy-950 font-bold tracking-wide py-4 px-10 rounded-full hover:bg-slate-200 transition-colors">Schedule a Tour</button>
                </div>

              </div>
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <PropertyEnquiryForm propertyId={property.id} />
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="border-t border-white/5 pt-12 mt-12">
            <h2 className="text-2xl font-medium text-white mb-8">Similar Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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