import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';

const ImageGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const validImages = images.filter(Boolean);

  const goNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const goPrev = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isLightboxOpen, goNext, goPrev]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = isLightboxOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isLightboxOpen]);

  if (validImages.length === 0) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] bg-navy-950 flex items-center justify-center">
        <div className="text-slate-600 font-medium tracking-widest uppercase">No Image Available</div>
      </div>
    );
  }

  return (
    <>
      {/* Main Image */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-navy-950 group cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
        {!imgLoaded[activeIndex] && (
          <div className="absolute inset-0 bg-navy-950 animate-pulse" />
        )}
        <AnimatePresence mode="wait">
          <motion.img
            key={validImages[activeIndex]}
            src={validImages[activeIndex]}
            alt={`Property image ${activeIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: imgLoaded[activeIndex] ? 0.9 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onLoad={() => setImgLoaded(prev => ({ ...prev, [activeIndex]: true }))}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Expand hint */}
        <div className="absolute top-4 right-4 bg-navy-950/60 backdrop-blur-md border border-white/10 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Expand size={16} />
        </div>

        {/* Image counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-navy-950/60 backdrop-blur-md border border-white/10 text-white text-xs font-bold tracking-widest px-4 py-2 rounded-full z-10">
            {activeIndex + 1} / {validImages.length}
          </div>
        )}

        {/* Nav arrows on main image */}
        {validImages.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-navy-950/60 backdrop-blur-md border border-white/10 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 z-10">
              <ChevronLeft size={20} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-navy-950/60 backdrop-blur-md border border-white/10 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 z-10">
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {validImages.length > 1 && (
        <div className="flex gap-2 p-4 bg-navy-950/50 overflow-x-auto">
          {validImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                i === activeIndex
                  ? 'border-blue-500 opacity-100'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-950/95 backdrop-blur-xl z-[70] flex items-center justify-center"
          >
            {/* Close button */}
            <button onClick={() => setIsLightboxOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors bg-white/5 p-3 rounded-full border border-white/10 z-10">
              <X size={20} />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 text-slate-400 text-sm font-bold tracking-widest z-10">
              {activeIndex + 1} / {validImages.length}
            </div>

            {/* Nav arrows */}
            {validImages.length > 1 && (
              <>
                <button onClick={goPrev} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/5 border border-white/10 text-white p-3 rounded-full hover:bg-white/10 transition-colors z-10">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={goNext} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/5 border border-white/10 text-white p-3 rounded-full hover:bg-white/10 transition-colors z-10">
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Lightbox image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={validImages[activeIndex]}
                src={validImages[activeIndex]}
                alt={`Lightbox ${activeIndex + 1}`}
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = offset.x;
                  if (swipe < -50) goNext();
                  else if (swipe > 50) goPrev();
                }}
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl cursor-grab active:cursor-grabbing shadow-2xl"
              />
            </AnimatePresence>

            {/* Lightbox thumbnails */}
            {validImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-navy-950/60 backdrop-blur-md p-2 rounded-2xl border border-white/10">
                {validImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeIndex ? 'border-blue-500 opacity-100' : 'border-transparent opacity-40 hover:opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;

