import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Loader: React.FC = () => {
  // TypeScript state for mobile detection
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 480 : false
  );

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 w-full h-full bg-[#0a0a0a] flex flex-col justify-center items-center z-[99999] overflow-hidden"
    >
      {/* Spinner with Primary Theme Color */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          borderRadius: ["20%", "50%", "20%"]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="w-12 h-12 border-4 border-primary shadow-[0_0_20px_rgba(var(--primary),0.5)]"
      />

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-white mt-5 font-display font-bold text-center px-5 tracking-tight"
        style={{ fontSize: isMobile ? '1.5rem' : '2.2rem' }}
      >
        Techverge<span className="text-gradient"> Solution</span>
        <motion.span 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-primary"
        >
          .
        </motion.span>
      </motion.h2>

      {/* Subtle background glow to match your site theme */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
    </motion.div>
  );
};

export default Loader;