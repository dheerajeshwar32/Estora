import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ScheduleTourModal = ({ isOpen, onClose, property, showToast }) => {
  const [step, setStep] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    tourType: 'in-person',
    name: '',
    email: '',
    phone: '',
    message: ''
  });


  const handleNext = (e) => {
    e.preventDefault();
    if (formData.date && formData.time) setStep(2);
    else showToast('Please select a date and time', 'error');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        propertyId: property.id,
        propertyTitle: property.title,
        agentContact: property.agentContact,
        status: 'new',
        type: 'tour_request',
        createdAt: serverTimestamp(),
      });
      setIsSending(false);
      onClose();
      showToast('Tour request sent successfully!', 'success');
      setTimeout(() => setStep(1), 500); // reset after close animation
    } catch (error) {
      console.error('Failed to schedule tour:', error);
      setIsSending(false);
      showToast('Failed to schedule tour. Please try again.', 'error');
    }
  };

  // Generate next 14 days
  const today = new Date();
  const upcomingDates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1); // start from tomorrow
    return d;
  });

  const timeSlots = ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy-950/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-navy-900 border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors z-10 bg-navy-950 p-2 rounded-full"><X size={20}/></button>
          
          <div className="mb-8">
            <h3 className="text-2xl font-medium text-[color:var(--theme-white)] mb-2">Schedule a Tour</h3>
            <p className="text-slate-400 text-sm font-light">
              {step === 1 ? 'Select your preferred date and time.' : 'Enter your details to confirm.'}
            </p>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form key="step1" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} onSubmit={handleNext} className="space-y-6">
                  
                  {/* Tour Type */}
                  <div className="flex gap-4 p-1 bg-navy-950 rounded-xl">
                    <button type="button" onClick={() => setFormData({...formData, tourType: 'in-person'})} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${formData.tourType === 'in-person' ? 'bg-white text-navy-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}>In-Person</button>
                    <button type="button" onClick={() => setFormData({...formData, tourType: 'virtual'})} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${formData.tourType === 'virtual' ? 'bg-white text-navy-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}>Virtual (Video)</button>
                  </div>

                  {/* Date Selector (Horizontal Scroll) */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3"><Calendar size={16}/> Select Date</label>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
                      {upcomingDates.map((date, i) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const isSelected = formData.date === dateStr;
                        return (
                          <button
                            key={i} type="button"
                            onClick={() => setFormData({...formData, date: dateStr})}
                            className={`snap-start shrink-0 w-20 p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-navy-950 border-white/5 text-slate-400 hover:border-white/20'}`}
                          >
                            <span className="text-xs uppercase font-bold tracking-wider mb-1">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            <span className="text-xl font-medium">{date.getDate()}</span>
                            <span className="text-[10px]">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Selector */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3"><Clock size={16}/> Select Time</label>
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map(time => (
                        <button
                          key={time} type="button"
                          onClick={() => setFormData({...formData, time})}
                          className={`py-3 rounded-xl border text-sm font-medium transition-all ${formData.time === time ? 'bg-blue-600 border-blue-500 text-white' : 'bg-navy-950 border-white/5 text-slate-400 hover:border-white/20'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-white text-navy-950 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 mt-4">
                    Continue <ArrowRight size={18} />
                  </button>
                </motion.form>
              ) : (
                <motion.form key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="bg-navy-950 p-4 rounded-xl border border-white/5 flex justify-between items-center mb-6">
                    <div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Selected Slot</div>
                      <div className="text-sm text-[color:var(--theme-white)] font-medium">
                        {new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {formData.time}
                      </div>
                    </div>
                    <button type="button" onClick={() => setStep(1)} className="text-blue-400 hover:text-blue-300 text-sm font-medium px-3 py-1 bg-blue-500/10 rounded-full">Edit</button>
                  </div>

                  <input type="text" required placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-navy-950 border border-white/10 rounded-xl text-[color:var(--theme-white)] outline-none focus:border-blue-500 transition-colors" />
                  <input type="email" required placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-4 bg-navy-950 border border-white/10 rounded-xl text-[color:var(--theme-white)] outline-none focus:border-blue-500 transition-colors" />
                  <input type="tel" required placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-4 bg-navy-950 border border-white/10 rounded-xl text-[color:var(--theme-white)] outline-none focus:border-blue-500 transition-colors" />
                  
                  <button type="submit" disabled={isSending} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors mt-6 disabled:opacity-50 flex justify-center items-center">
                    {isSending ? 'Confirming Tour...' : 'Confirm Tour Request'}
                  </button>
                  <button type="button" onClick={() => setStep(1)} className="w-full text-slate-500 hover:text-white py-2 text-sm font-medium transition-colors mt-2">Back</button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    )}
    </AnimatePresence>
  );
};

export default ScheduleTourModal;

