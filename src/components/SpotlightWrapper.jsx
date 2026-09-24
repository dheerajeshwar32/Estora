import React, { useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate, useReducedMotion } from 'framer-motion';

export const SpotlightWrapper = ({ children, className = '' }) => {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const opacity = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e) => {
    if (shouldReduceMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => opacity.set(1)}
      onMouseLeave={() => opacity.set(0)}
      className={`relative overflow-hidden group w-full h-full ${className}`}
    >
      {!shouldReduceMotion && (
        <motion.div
          className="pointer-events-none absolute -inset-px z-10 transition-opacity duration-300 rounded-inherit"
          style={{
            opacity,
            background: useMotionTemplate`radial-gradient(600px circle at ${mx}px ${my}px, rgba(255,255,255,0.15), transparent 40%)`,
          }}
        />
      )}
      {children}
    </div>
  );
};
