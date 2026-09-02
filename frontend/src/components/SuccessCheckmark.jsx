import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function SuccessCheckmark({
  title = "Authentication Verified!",
  subtitle = "Welcome to CraftLink Studio. Redirecting you now...",
  role = "artisan"
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-6 select-none"
    >
      {/* Centered Animated Checkmark Circle */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* 1. Outer Expanding Ripple Glow Wave */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0.8 }}
          animate={{ scale: [0.8, 1.45, 1.2], opacity: [0.8, 0, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500 to-[#1E4D2B] blur-md"
        />

        {/* 2. Secondary Glowing Halo Ring */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-100 via-white to-amber-50 shadow-xl border-2 border-emerald-500/40"
        />

        {/* 3. SVG Path Draw Animation for Circle and Checkmark */}
        <svg
          className="w-20 h-20 relative z-10 drop-shadow-md"
          viewBox="0 0 52 52"
          fill="none"
        >
          {/* Animated Circle Outline */}
          <motion.circle
            cx="26"
            cy="26"
            r="23"
            stroke="#10B981"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, rotate: -90 }}
            animate={{ pathLength: 1, rotate: 0 }}
            transition={{ duration: 0.65, ease: [0.65, 0, 0.35, 1] }}
          />

          {/* Animated Checkmark Tick Path */}
          <motion.path
            d="M14.5 27.5 L22.5 35.5 L37.5 17.5"
            stroke="#1E4D2B"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { delay: 0.35, duration: 0.45, ease: [0.65, 0, 0.35, 1] },
              opacity: { delay: 0.35, duration: 0.1 }
            }}
          />
        </svg>

        {/* 4. Orbiting Pop Sparkles */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.9] }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="absolute -top-1 -right-1 text-amber-500"
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.9] }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="absolute -bottom-1 -left-1 text-[#C85A27]"
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
      </div>

      {/* Title & Feedback Description */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="space-y-2"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-300/80 text-xs font-bold shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Verified & Encrypted</span>
        </div>

        <h2 className="text-2xl font-black font-serif text-stone-900">
          {title}
        </h2>
        <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
          {subtitle}
        </p>
      </motion.div>

      {/* Progress Bar To Redirect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-48 h-1.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200"
      >
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-emerald-500 to-[#1E4D2B] rounded-full"
        />
      </motion.div>
    </motion.div>
  );
}
