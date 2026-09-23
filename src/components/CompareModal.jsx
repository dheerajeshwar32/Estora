import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Minus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ALL_AMENITIES = [
  'Pool', 'Gym', 'Parking', 'Balcony', 'Garden',
  'Security', 'Power Backup', 'Elevator', 'Pet Friendly', 'Furnished'
];

const CompareModal = () => {
  const { isCompareModalOpen, setIsCompareModalOpen, compareList, toggleCompare } = useAppContext();

  return (
    <AnimatePresence>
      {!isCompareModalOpen ? null : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-md z-[70] flex items-center justify-center p-4 overflow-y-auto"
        >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.95, opacity: 0, y: 20 }} 
          className="bg-navy-900 border border-white/10 rounded-3xl w-full max-w-6xl shadow-2xl relative my-8 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-navy-950/50 sticky top-0 z-10">
            <div>
              <h2 className="text-2xl font-medium text-[color:var(--theme-white)]">Compare Properties</h2>
              <p className="text-slate-400 text-sm">Comparing {compareList.length} of 3 properties</p>
            </div>
            <button onClick={() => setIsCompareModalOpen(false)} className="text-slate-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
              <X size={20} />
            </button>
          </div>

          {/* Compare Table */}
          <div className="p-6 overflow-x-auto flex-1 custom-scrollbar">
            {compareList.length === 0 ? (
              <div className="text-center text-slate-400 py-12">No properties selected for comparison.</div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr>
                    <th className="p-4 border-b border-white/5 w-1/4"></th>
                    {compareList.map(prop => (
                      <th key={prop.id} className="p-4 border-b border-white/5 w-1/4 align-top">
                        <div className="relative rounded-xl overflow-hidden aspect-video mb-3 group">
                          <img src={prop.image || prop.images?.[0]} alt={prop.title} className="w-full h-full object-cover" />
                          <button 
                            onClick={() => toggleCompare(prop)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <h3 className="font-semibold text-[color:var(--theme-white)] text-lg line-clamp-1">{prop.title}</h3>
                        <p className="text-sm text-slate-400 truncate">{prop.location}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price */}
                  <tr>
                    <td className="p-4 border-b border-white/5 font-medium text-slate-300">Price</td>
                    {compareList.map(prop => (
                      <td key={prop.id} className="p-4 border-b border-white/5 text-xl font-bold text-white">
                        ₹{prop.price?.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>
                  {/* Beds / Type */}
                  <tr>
                    <td className="p-4 border-b border-white/5 font-medium text-slate-300">Type / Size</td>
                    {compareList.map(prop => {
                      const pType = String(prop.propertyType || prop.type || 'Property').toLowerCase();
                      const hideBeds = pType.includes('commercial') || pType.includes('plot');
                      return (
                        <td key={prop.id} className="p-4 border-b border-white/5 text-slate-300">
                          <span className="capitalize">{prop.propertyType || prop.type || 'Property'}</span> 
                          {!hideBeds && ` • ${prop.bedrooms || prop.beds || 0} Beds`}
                        </td>
                      );
                    })}
                  </tr>
                  
                  {/* Amenities Section */}
                  <tr>
                    <td colSpan={compareList.length + 1} className="p-4 pt-8 pb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Amenities</td>
                  </tr>
                  {ALL_AMENITIES.map(amenity => (
                    <tr key={amenity} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 border-b border-white/5 font-medium text-slate-300 text-sm">{amenity}</td>
                      {compareList.map(prop => {
                        const hasAmenity = (prop.amenities || []).includes(amenity);
                        return (
                          <td key={prop.id} className="p-4 border-b border-white/5">
                            {hasAmenity ? (
                              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                                <Check size={14} />
                              </div>
                            ) : (
                              <div className="text-slate-600"><Minus size={14} /></div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompareModal;

