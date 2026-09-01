import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { speakHindi } from '../services/voice';
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

  const [phase, setPhase] = useState(0); // 0=logo, 1=text, 2=exit

  useEffect(() => {
    if (!visible) return;
    
    // Play personal voice welcome!
    speakHindi("Namaste! Craft Link mein aapka swagat hai.");
    
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 1000);
    const t3 = setTimeout(() => setVisible(false), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="craftlink-opening"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed inset-0 z-[99999] bg-[#FAF7F5] dark:bg-[#0B0F17] flex items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          {/* Background animated orbs */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 3, opacity: 0.15 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute w-64 h-64 rounded-full bg-amber-400"
            style={{ filter: 'blur(60px)' }}
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2.5, opacity: 0.1 }}
            transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
            className="absolute w-48 h-48 rounded-full bg-[#1E4D2B]"
            style={{ filter: 'blur(50px)', transform: 'translate(100px, 80px)' }}
          />

          {/* Logo + Brand */}
          <div className="text-center space-y-4 relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shadow-2xl"
                style={{ boxShadow: '0 20px 60px rgba(200, 90, 39, 0.4)' }}
              >
                <img src="/icon.png" alt="CraftLink" className="w-14 h-14 object-contain" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-1"
            >
              <div className="text-3xl font-extrabold font-serif tracking-tight text-stone-900 dark:text-stone-100">
                <span className="text-[#1E4D2B]">Craft</span>
                <span className="text-[#C85A27]">Link</span>
                <span className="text-amber-500 text-lg ml-1">✦</span>
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: phase >= 1 ? 1 : 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                className="h-0.5 bg-gradient-to-r from-[#1E4D2B] via-amber-500 to-[#C85A27] rounded-full mx-auto"
                style={{ width: '80px', transformOrigin: 'left' }}
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 1 ? 1 : 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-[10px] uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400 font-semibold flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                AI-Powered Marketplace
                <Sparkles className="w-3 h-3 text-amber-500" />
              </motion.p>
            </motion.div>

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-1.5 pt-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#C85A27]"
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
