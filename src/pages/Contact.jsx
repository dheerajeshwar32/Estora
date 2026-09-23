import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Contact = () => {
  const { showToast } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        type: 'general_contact',
        status: 'new',
        createdAt: serverTimestamp()
      });
      showToast('Your message has been sent successfully!', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[color:var(--theme-white)] mb-6">Get in Touch</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
          Whether you're looking to buy, sell, or just want to say hello, our team is ready to assist you.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto">
        {/* Contact Info */}
        <div className="w-full lg:w-1/3 space-y-8">
          <div className="bg-navy-900 border border-white/5 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-[color:var(--theme-white)] mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[color:var(--theme-white)] mb-1">Our Headquarters</p>
                  <p className="text-sm text-slate-400">123 Horizon Avenue, Tech Park<br/>Bangalore, KA 560001</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[color:var(--theme-white)] mb-1">Phone</p>
                  <p className="text-sm text-slate-400">+91 1800 123 4567</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[color:var(--theme-white)] mb-1">Email</p>
                  <p className="text-sm text-slate-400">contact@estora.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full lg:w-2/3">
          <form onSubmit={handleSubmit} className="bg-navy-900 border border-white/5 p-8 md:p-12 rounded-3xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subject</label>
              <input 
                type="text" 
                required 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-navy-950 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="How can we help?"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Message</label>
              <textarea 
                required 
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-navy-950 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:border-blue-500 outline-none transition-colors resize-none"
                placeholder="Write your message here..."
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : <><Send size={18} /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

