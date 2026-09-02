import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function SiteOpeningLoader() {
  const [loading, setLoading] = useState(() => {
    // Only show once per session for best user experience
    try {
      const shown = sessionStorage.getItem('craftlink_loader_shown');
      if (shown) return false;
      sessionStorage.setItem('craftlink_loader_shown', 'true');
      return true;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="site-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[999999] bg-[#FAF7F5] dark:bg-[#0B0F17] flex flex-col items-center justify-center pointer-events-none select-none transition-colors duration-300"
        >
          <div className="relative flex flex-col items-center space-y-4">
            {/* Minimal Luxury Rotating Spinner */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full border-2 border-amber-200 dark:border-stone-800 border-t-[#C85A32] dark:border-t-amber-400"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#C85A32] dark:text-amber-400" />
              </div>
            </div>

            {/* Clean Modern Wordmark */}
            <div className="text-center space-y-1">
              <span className="font-serif font-bold text-lg tracking-widest text-stone-900 dark:text-stone-100 uppercase">
                Craft<span className="text-[#C85A32] dark:text-amber-400">Link</span>
              </span>
              <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-stone-400 dark:text-stone-500">
                Heritage Digitization
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
