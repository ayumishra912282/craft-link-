import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 16,
    scale: 0.99
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -12,
    scale: 0.99
  }
};

const pageTransition = {
  type: 'tween',
  ease: [0.22, 1, 0.36, 1], // Smooth custom cubic-bezier
  duration: 0.38
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full relative"
    >
      {/* Smooth Shutter Wipe Accent on Page Opening/Closing */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 bg-gradient-to-r from-[#1E4D2B] via-amber-900 to-[#C85A27] z-50 pointer-events-none origin-left opacity-15"
      />
      {children}
    </motion.div>
  );
}
