import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How can I schedule a site visit?',
    answer: 'You can schedule a site visit by clicking the "Schedule a Tour" button on any property page. Choose between an in-person or virtual tour, select your preferred date and time, and our agents will confirm your booking.'
  },
  {
    question: 'Can I save and compare properties?',
    answer: 'Yes! Click the heart icon on any property to save it to your Wishlist. Open the "Saved" drawer from the navigation bar, and use the "VS" button to compare up to 3 properties side-by-side.'
  },
  {
    question: 'What documents are generally required to buy?',
    answer: 'Typically, you will need proof of identity (Aadhar/PAN), address proof, recent bank statements, salary slips or ITR for the last 3 years, and a pre-approved loan letter if applicable.'
  },
  {
    question: 'Are the prices listed negotiable?',
    answer: 'Property prices are often indicative of the current market value. Negotiation depends entirely on the seller and the property. We recommend scheduling a tour and speaking directly with the assigned agent.'
  }
];

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-navy-950 rounded-3xl p-8 border border-white/5 mb-12">
      <h2 className="text-xl font-medium text-[color:var(--theme-white)] mb-6">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02]">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none hover:bg-white/[0.02] transition-colors"
            >
              <span className="font-medium text-[color:var(--theme-white)] pr-4">{faq.question}</span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-slate-400 shrink-0"
              >
                <ChevronDown size={20} />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="px-6 pb-5 pt-0 text-slate-400 font-light leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQAccordion;

