import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingCraftProps() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Subtle, soft ambient atmospheric glows */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.35, 0.5, 0.35]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-gradient-to-br from-amber-100/40 dark:from-amber-900/20 via-orange-100/20 dark:via-orange-950/15 to-transparent rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.25, 0.4, 0.25]
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 -right-48 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-100/30 dark:from-emerald-950/25 via-teal-50/20 dark:via-teal-950/15 to-transparent rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.35, 0.2]
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-48 left-1/3 w-[650px] h-[650px] bg-gradient-to-tr from-[#C85A32]/10 dark:from-[#C85A32]/20 via-amber-50/30 dark:via-stone-900/20 to-transparent rounded-full blur-3xl"
      />
    </div>
  );
}
