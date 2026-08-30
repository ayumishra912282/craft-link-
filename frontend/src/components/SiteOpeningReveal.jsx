import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SiteOpeningReveal() {
  const [visible, setVisible] = useState(() => {
    try {
      if (sessionStorage.getItem('craftlink_intro_seen')) return false;
      sessionStorage.setItem('craftlink_intro_seen', 'true');
      return true;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 700);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="craftlink-opening"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
          className="fixed inset-0 z-[99999] bg-[#FAF7F5] dark:bg-[#0B0F17] flex items-center justify-center pointer-events-none select-none"
        >
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl sm:text-3xl font-heading font-extrabold tracking-widest text-stone-900 dark:text-stone-100 uppercase"
            >
              Craft<span className="text-[#C85A32] dark:text-amber-400">Link</span>
            </motion.div>
            <div className="w-12 h-0.5 bg-[#C85A32] dark:bg-amber-400 mx-auto rounded-full" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
