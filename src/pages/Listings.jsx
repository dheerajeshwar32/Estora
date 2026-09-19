import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import PropertyCard from '../components/PropertyCard';
import AiSearch from '../components/AiSearch';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [locationStr, setLocationStr] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [aiResults, setAiResults] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const listingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setListings(listingsData);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filteredListings = useMemo(() => {
    if (aiResults) return aiResults;
    return listings.filter(listing => {
      if (locationStr && !listing.location.toLowerCase().includes(locationStr.toLowerCase())) return false;
      if (minPrice && listing.price < parseInt(minPrice)) return false;
      if (maxPrice && listing.price > parseInt(maxPrice)) return false;
      if (bedrooms && listing.bedrooms !== parseInt(bedrooms)) return false;
      if (propertyType && listing.propertyType !== propertyType) return false;
      return true;
    });
  }, [listings, locationStr, minPrice, maxPrice, bedrooms, propertyType, aiResults]);

  const resetAllFilters = () => {
    setAiResults(null);
    setLocationStr('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setPropertyType('');
  };

  if (loading) return <div className="p-10 text-center text-xl font-bold text-slate-500 animate-pulse mt-20">Loading vision...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <AiSearch listings={listings} onSearchResults={setAiResults} resetFilters={resetAllFilters} />

      <div className="flex flex-col md:flex-row gap-10 mt-12">
        
        <div className="w-full md:w-1/4 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 h-fit sticky top-28">
          <h2 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-6">Refine</h2>
          
          <div className="space-y-6 text-sm">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Location</label>
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

            <div>
              <label className="block text-slate-300 font-medium mb-2">Bedrooms</label>
              <select className="w-full p-3 bg-[#0E172A] border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all appearance-none" value={bedrooms} onChange={e => setBedrooms(e.target.value)}>
                <option value="">Any</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4">4 Beds</option>
                <option value="5">5+ Beds</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Property Type</label>
              <select className="w-full p-3 bg-[#0E172A] border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all appearance-none" value={propertyType} onChange={e => setPropertyType(e.target.value)}>
                <option value="">Any</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
              </select>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/4">
          <div className="flex items-baseline gap-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white">
              Discover
            </h1>
            <span className="text-lg text-slate-400 font-light">({filteredListings.length})</span>
          </div>
          
          {filteredListings.length === 0 ? (
            <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10">
              <h2 className="text-xl font-medium text-white mb-2">No matches found.</h2>
              <p className="text-slate-400 font-light">Adjust your parameters to explore more properties.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map(listing => (
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
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;