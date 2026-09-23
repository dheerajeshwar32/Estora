import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAppContext } from '../context/AppContext';
import SEO from '../components/SEO';
import { Building2, MapPin, BadgeIndianRupee, BedDouble, Bath, ImagePlus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ALL_AMENITIES = [
  'Pool', 'Gym', 'Parking', 'Balcony', 'Garden',
  'Security', 'Power Backup', 'Elevator', 'Pet Friendly', 'Furnished'
];

const ListProperty = () => {
  const { showToast } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', location: '',
    bedrooms: '', bathrooms: '', propertyType: 'apartment',
    amenities: [], ownerName: '', ownerPhone: '', ownerEmail: '', videoUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!formData.title || !formData.price || !formData.location || !formData.ownerName || !formData.ownerPhone) {
        throw new Error('Please fill all required fields');
      }

      await addDoc(collection(db, 'property_submissions'), {
        ...formData,
        price: Number(formData.price),
        bedrooms: formData.propertyType === 'plot' || formData.propertyType === 'commercial' ? 0 : Number(formData.bedrooms),
        bathrooms: formData.propertyType === 'plot' ? 0 : Number(formData.bathrooms),
        status: 'new', // new, reviewed
        createdAt: serverTimestamp()
      });

      showToast('Property submitted successfully! Our team will review it shortly.', 'success');
      
      // Reset form
      setFormData({
        title: '', description: '', price: '', location: '',
        bedrooms: '', bathrooms: '', propertyType: 'apartment',
        amenities: [], ownerName: '', ownerPhone: '', ownerEmail: '', videoUrl: ''
      });

    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="List Your Property | Estora"
        description="List your property on Estora to reach thousands of potential buyers."
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-4">
            Sell or Rent your property
          </h1>
          <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
            Submit your property details below. Our expert agents will review your listing and contact you to arrange high-quality photography and publish it on the platform.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-8 text-sm">
            
            {/* Owner Details Section */}
            <div>
              <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">1</span>
                Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-2">Full Name *</label>
                  <input type="text" name="ownerName" required value={formData.ownerName} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-2">Mobile Number *</label>
                  <input type="tel" name="ownerPhone" required value={formData.ownerPhone} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-slate-300 mb-2">Email Address</label>
                  <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Property Details Section */}
            <div>
              <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2 mt-8">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">2</span>
                Property Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-slate-300 mb-2">Property Title *</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. 3 BHK Luxury Apartment in Banjara Hills" className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">Property Type *</label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all appearance-none">
                    <option value="apartment">Apartment</option>
                    <option value="house">Independent House</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial Space</option>
                    <option value="plot">Plot / Land</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">Expected Price (₹) *</label>
                  <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} placeholder="e.g. 15000000" className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">Transaction Type *</label>
                  <select name="transactionType" value={formData.transactionType || 'buy'} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all appearance-none">
                    <option value="buy">Sell</option>
                    <option value="rent">Rent / Lease</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">Total Area (Sq.Ft) *</label>
                  <input type="number" name="area" required min="0" value={formData.area || ''} onChange={handleChange} placeholder="e.g. 1500" className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 mb-2">Location / Address *</label>
                  <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="City, Locality or Landmark" className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all" />
                </div>

                {formData.propertyType !== 'plot' && formData.propertyType !== 'commercial' && (
                  <>
                    <div>
                      <label className="block text-slate-300 mb-2">Bedrooms</label>
                      <input type="number" name="bedrooms" min="0" value={formData.bedrooms} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-2">Bathrooms</label>
                      <input type="number" name="bathrooms" min="0" value={formData.bathrooms} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all" />
                    </div>
                  </>
                )}

                {formData.propertyType === 'commercial' && (
                  <div className="md:col-span-2">
                    <label className="block text-slate-300 mb-2">Bathrooms / Washrooms</label>
                    <input type="number" name="bathrooms" min="0" value={formData.bathrooms} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all" />
                  </div>
                )}
              </div>
            </div>

            {/* Description & Media */}
            <div>
              <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2 mt-8">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">3</span>
                Description & Media
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 mb-2">Detailed Description</label>
                  <textarea name="description" rows="4" value={formData.description} onChange={handleChange} placeholder="Tell buyers about your property's best features..." className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white resize-none focus:border-white outline-none transition-all"></textarea>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">Video Tour URL (Optional)</label>
                  <input type="url" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="YouTube or Vimeo link" className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all" />
                </div>
                
                <div>
                  <label className="block text-slate-300 mb-2">Floor Plan Image URL (Optional)</label>
                  <input type="url" name="floorPlan" value={formData.floorPlan || ''} onChange={handleChange} placeholder="Link to floor plan image" className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Amenities */}
            {formData.propertyType !== 'plot' && (
              <div>
                <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2 mt-8">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">4</span>
                  Amenities
                </h2>
                <div className="flex flex-wrap gap-2">
                  {ALL_AMENITIES.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`text-xs px-4 py-2 rounded-full border transition-all font-medium ${
                        formData.amenities.includes(amenity)
                          ? 'bg-white text-navy-950 border-white'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-8">
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-blue-500 text-white font-bold tracking-wide py-4 px-8 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 size={18} className="animate-spin" /> Submitting Property...</>
                ) : (
                  'Submit Property For Review'
                )}
              </button>
              <p className="text-center text-xs text-slate-500 mt-4">
                By submitting this form, you agree to our Terms of Service and Privacy Policy. Our agent will contact you within 24 hours.
              </p>
            </div>

          </form>
        </motion.div>
      </div>
    </>
  );
};

export default ListProperty;

