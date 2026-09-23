import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { collection, getDocs, orderBy, query, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, BedDouble, Loader2, Sparkles, Shield, Zap, Search, ChevronDown } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import AiSearch from '../components/AiSearch';

const PAGE_SIZE = 12;

const ALL_AMENITIES = [
  'Pool', 'Gym', 'Parking', 'Balcony', 'Garden',
  'Security', 'Power Backup', 'Elevator', 'Pet Friendly', 'Furnished'
];

const SkeletonCard = () => (
  <div className="rounded-2xl aspect-[4/5] bg-navy-900 border border-white/5 p-6 flex flex-col justify-end animate-pulse">
    <div className="w-16 h-6 bg-white/10 rounded-full mb-auto self-end"></div>
    <div className="w-3/4 h-8 bg-white/10 rounded-lg mb-3"></div>
    <div className="w-1/2 h-4 bg-white/10 rounded-lg mb-5"></div>
    <div className="w-1/3 h-6 bg-white/10 rounded-lg"></div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [locationStr, setLocationStr] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [aiResults, setAiResults] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  // Dynamic page title
  useEffect(() => {
    document.title = 'Estora — Discover Premium Properties';
  }, []);

  // Initial fetch with pagination
  const fetchListings = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);

      let q;
      if (isLoadMore && lastDoc) {
        q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(PAGE_SIZE));
      } else {
        q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
      }

      const querySnapshot = await getDocs(q);
      const newListings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (querySnapshot.docs.length < PAGE_SIZE) {
        setHasMore(false);
      }

      if (querySnapshot.docs.length > 0) {
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }

      if (isLoadMore) {
        setListings(prev => [...prev, ...newListings]);
      } else {
        setListings(newListings);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [lastDoc]);

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const filteredListings = useMemo(() => {
    let filtered = listings;
    if (aiResults) filtered = aiResults;
    else {
      filtered = listings.filter(listing => {
        if (locationStr && !listing.location.toLowerCase().includes(locationStr.toLowerCase())) return false;
        if (minPrice && listing.price < parseInt(minPrice)) return false;
        if (maxPrice && listing.price > parseInt(maxPrice)) return false;
        if (minArea && (listing.area || 0) < parseInt(minArea)) return false;
        if (maxArea && (listing.area || 0) > parseInt(maxArea)) return false;
        if (bedrooms && listing.bedrooms !== parseInt(bedrooms)) return false;
        if (propertyType && listing.propertyType !== propertyType) return false;
        if (transactionType && listing.transactionType !== transactionType) return false;
        if (selectedAmenities.length > 0) {
          const propAmenities = listing.amenities || [];
          if (!selectedAmenities.every(a => propAmenities.includes(a))) return false;
        }
        return true;
      });
    }

    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'area_asc') {
      filtered.sort((a, b) => (a.area || 0) - (b.area || 0));
    } else if (sortBy === 'area_desc') {
      filtered.sort((a, b) => (b.area || 0) - (a.area || 0));
    } else {
      filtered.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    }
    
    return filtered;
  }, [listings, locationStr, minPrice, maxPrice, minArea, maxArea, bedrooms, propertyType, transactionType, selectedAmenities, aiResults, sortBy]);

  const uniqueLocationsCount = useMemo(() => {
    return new Set(listings.map(l => l.location.trim().toLowerCase())).size;
  }, [listings]);

  const resetAllFilters = () => {
    setAiResults(null);
    setLocationStr('');
    setMinPrice('');
    setMaxPrice('');
    setMinArea('');
    setMaxArea('');
    setBedrooms('');
    setPropertyType('');
    setTransactionType('');
    setSelectedAmenities([]);
  };

  useEffect(() => {
    if (isMobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileFiltersOpen]);

  const filterContent = (
    <div className="space-y-6 text-sm">
      <div className="md:hidden">
        <label className="block text-slate-300 font-medium mb-2">Sort By</label>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all appearance-none"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="area_asc">Area: Small to Large</option>
          <option value="area_desc">Area: Large to Small</option>
        </select>
      </div>

      <div>
        <label className="block text-slate-300 font-medium mb-2">Looking For</label>
        <div className="flex gap-2">
          <button 
            onClick={() => setTransactionType('')} 
            className={`flex-1 p-2 rounded-xl border text-xs font-bold tracking-widest uppercase transition-all ${transactionType === '' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}
          >All</button>
          <button 
            onClick={() => setTransactionType('buy')} 
            className={`flex-1 p-2 rounded-xl border text-xs font-bold tracking-widest uppercase transition-all ${transactionType === 'buy' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}
          >Buy</button>
          <button 
            onClick={() => setTransactionType('rent')} 
            className={`flex-1 p-2 rounded-xl border text-xs font-bold tracking-widest uppercase transition-all ${transactionType === 'rent' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}
          >Rent</button>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-slate-300 font-medium mb-2">
          <MapPin size={16} className="text-slate-400"/> Location
        </label>
        <input type="text" placeholder="e.g. Chennai" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white outline-none transition-all" value={locationStr} onChange={e => setLocationStr(e.target.value)} />
      </div>
      
      <div className="flex gap-3">
        <div className="w-1/2">
          <label className="block text-slate-300 font-medium mb-2">Min Price</label>
          <input type="number" placeholder="₹0" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white outline-none transition-all" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
        </div>
        <div className="w-1/2">
          <label className="block text-slate-300 font-medium mb-2">Max Price</label>
          <input type="number" placeholder="Limit" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white outline-none transition-all" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <label className="block text-slate-300 font-medium mb-2">Min Area</label>
          <input type="number" placeholder="Sq.ft" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white outline-none transition-all" value={minArea} onChange={e => setMinArea(e.target.value)} />
        </div>
        <div className="w-1/2">
          <label className="block text-slate-300 font-medium mb-2">Max Area</label>
          <input type="number" placeholder="Sq.ft" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white outline-none transition-all" value={maxArea} onChange={e => setMaxArea(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <label className="flex items-center gap-2 text-slate-300 font-medium mb-2">
            <BedDouble size={16} className="text-slate-400"/> Beds
          </label>
          <select className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all appearance-none" value={bedrooms} onChange={e => setBedrooms(e.target.value)}>
            <option value="">Any</option>
            <option value="1">1 Bed</option>
            <option value="2">2 Beds</option>
            <option value="3">3 Beds</option>
            <option value="4">4 Beds</option>
            <option value="5">5+ Beds</option>
          </select>
        </div>
        <div className="w-1/2">
          <label className="block text-slate-300 font-medium mb-2">Type</label>
          <select className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all appearance-none" value={propertyType} onChange={e => setPropertyType(e.target.value)}>
            <option value="">Any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="commercial">Commercial</option>
            <option value="plot">Plot</option>
          </select>
        </div>
      </div>

      {/* Amenities Filter */}
      <div>
        <label className="block text-slate-300 font-medium mb-3">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {ALL_AMENITIES.map(amenity => (
            <button
              key={amenity}
              onClick={() => toggleAmenity(amenity)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                selectedAmenities.includes(amenity)
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Filters */}
      {(locationStr || minPrice || maxPrice || minArea || maxArea || bedrooms || propertyType || transactionType || selectedAmenities.length > 0) && (
        <button onClick={resetAllFilters} className="w-full text-xs font-bold tracking-widest uppercase text-slate-400 hover:text-white py-3 border border-white/10 rounded-xl hover:border-white/20 transition-all">
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 md:pt-8 md:pb-12">
      
      {/* Landing Hero Section */}
      <div className="relative pt-10 pb-16 md:pt-14 md:pb-20 text-center overflow-hidden rounded-3xl mb-4">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-navy-950" />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[50%] -left-[20%] w-[70%] h-[150%] bg-blue-500/30 blur-[120px] rounded-full"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.15, 0.3, 0.15],
              x: [0, 100, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] -right-[20%] w-[60%] h-[120%] bg-purple-500/20 blur-[120px] rounded-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-950/80 to-navy-950 z-0" />
        </div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-medium tracking-tight text-[color:var(--theme-white)] mb-6 leading-tight relative z-10"
        >
          Discover your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, var(--theme-white), var(--theme-slate-400))' }}>extraordinary home.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto mb-10 relative z-10"
        >
          Explore an exclusive collection of premium properties tailored to your lifestyle.
        </motion.p>
        
        {!loading && listings.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center items-center gap-4 text-xs md:text-sm font-bold tracking-widest uppercase text-slate-500 relative z-10 mb-10"
          >
            <span>{listings.length}+ Listings</span>
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            <span>{uniqueLocationsCount} Locations</span>
          </motion.div>
        )}


      </div>

      <AiSearch listings={listings} onSearchResults={setAiResults} resetFilters={resetAllFilters} />
      
      {/* Premium Features Highlight */}
      {!locationStr && !minPrice && !maxPrice && !bedrooms && !propertyType && selectedAmenities.length === 0 && !aiResults && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex flex-col md:flex-row justify-around items-center mb-12 gap-8 md:gap-6 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">$2B+</div>
              <div className="text-xs font-bold tracking-widest uppercase text-blue-400">Property Value</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-white/10"></div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">99%</div>
              <div className="text-xs font-bold tracking-widest uppercase text-blue-400">Client Satisfaction</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-white/10"></div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">150+</div>
              <div className="text-xs font-bold tracking-widest uppercase text-blue-400">Premium Locations</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "AI-Powered Discovery", desc: "Just type what you want, and our Gemini-powered engine finds the perfect match instantly.", icon: <Sparkles className="text-blue-400 w-6 h-6" /> },
              { title: "Verified Premium", desc: "Every property is hand-picked and verified to ensure the highest standards of luxury.", icon: <Shield className="text-purple-400 w-6 h-6" /> },
              { title: "Seamless Experience", desc: "From immersive galleries to instant contact, designed for the modern homebuyer.", icon: <Zap className="text-emerald-400 w-6 h-6" /> }
            ].map((feat, i) => (
              <div key={i} className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl overflow-hidden hover:border-white/20 transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-navy-900 border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    {feat.icon}
                  </div>
                  <h3 className="text-white font-medium mb-3 tracking-wide text-lg">{feat.title}</h3>
                  <p className="text-slate-400 font-light text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-10 mt-12">
        
        <div className="md:hidden flex justify-between items-center mb-2">
          <h1 className="text-3xl font-medium tracking-tight text-white">
            Discover {!loading && <span className="text-lg text-slate-400 font-light">({filteredListings.length})</span>}
          </h1>
          <button 
            onClick={() => setIsMobileFiltersOpen(true)}
            className="px-5 py-2.5 bg-white text-navy-950 rounded-full text-xs font-bold tracking-widest uppercase transition-colors"
          >
            Filters
          </button>
        </div>

        <AnimatePresence>
          {isMobileFiltersOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileFiltersOpen(false)}
                className="fixed inset-0 bg-navy-950/80 backdrop-blur-md z-40 md:hidden"
              />
              
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 h-[85vh] bg-navy-900 border-t border-white/10 rounded-t-[2rem] z-50 p-6 flex flex-col md:hidden shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-sm font-bold tracking-widest uppercase text-slate-400">Refine Search</h2>
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="text-slate-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto pb-6 pr-2">
                  {filterContent}
                </div>
                
                <div className="pt-6 border-t border-white/10 mt-auto">
                  <button 
                    onClick={() => setIsMobileFiltersOpen(false)} 
                    className="w-full bg-white text-navy-950 font-bold tracking-wide py-4 px-8 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    Show {filteredListings.length} Properties
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="hidden md:block w-full md:w-1/4 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 h-fit sticky top-28 z-10">
          <h2 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-6">Refine</h2>
          {filterContent}
        </div>

        <div className="w-full md:w-3/4">
          
          <div className="hidden md:flex items-center justify-between mb-8">
            <div className="flex items-baseline gap-4">
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white">
                Discover
              </h1>
              {!loading && <span className="text-lg text-slate-400 font-light">({filteredListings.length})</span>}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold tracking-widest uppercase text-slate-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-navy-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-white/30"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="area_asc">Area: Small to Large</option>
                <option value="area_desc">Area: Large to Small</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10">
              <h2 className="text-xl font-medium text-white mb-2">No matches found.</h2>
              <p className="text-slate-400 font-light">Adjust your parameters to explore more properties.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing, index) => (
                  <motion.div 
                    key={listing.id} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: "easeOut" }}
                  >
                    <PropertyCard
                      id={listing.id}
                      image={listing.images?.[0]}
                      title={listing.title}
                      price={listing.price}
                      location={listing.location}
                      beds={listing.bedrooms}
                      baths={listing.bathrooms}
                      type={listing.propertyType}
                      amenities={listing.amenities}
                      area={listing.area}
                      status={listing.status}
                      transactionType={listing.transactionType}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && !aiResults && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => fetchListings(true)}
                    disabled={loadingMore}
                    className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-bold tracking-wide hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More Properties'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;