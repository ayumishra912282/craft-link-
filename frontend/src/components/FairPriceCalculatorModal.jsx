import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, X, ShieldCheck, Sparkles, Check, ArrowRight, Award, Info, Heart } from 'lucide-react';

export default function FairPriceCalculatorModal({ isOpen, onClose, product }) {
  const [craftHours, setCraftHours] = useState(product?.price > 10000 ? 120 : product?.price > 2000 ? 36 : 14);
  const [hourlyWage, setHourlyWage] = useState(120); // Rs 120/hr fair living wage
  const [materialCost, setMaterialCost] = useState(Math.round((product?.price || 1850) * 0.35));
  const [isGiVerified, setIsGiVerified] = useState(true);

  if (!isOpen) return null;

  const artisanLaborValue = craftHours * hourlyWage;
  const giHeritagePremium = isGiVerified ? Math.round(artisanLaborValue * 0.15) : 0;
  const platformFairFee = Math.round((artisanLaborValue + materialCost + giHeritagePremium) * 0.05); // Only 5% direct platform fee (vs 60-80% middleman cut)
  const totalFairEstimate = artisanLaborValue + materialCost + giHeritagePremium + platformFairFee;
  const artisanSharePercent = Math.round(((artisanLaborValue + giHeritagePremium) / totalFairEstimate) * 100);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="bg-white dark:bg-[#131B2A] rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-6 text-stone-900 dark:text-stone-100 relative"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Fair-Wage & Provenance Simulator</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-luxury font-bold">
                Transparent Craft Valuation
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                Real-time breakdown of fair remuneration directly reaching {product?.artisan_name || "the artisan"}.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Controls */}
          <div className="space-y-4 text-xs font-sans">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Handcrafting Dedication Time:</span>
                <span className="text-[#C85A27] dark:text-amber-400 font-mono">{craftHours} Hours</span>
              </div>
              <input
                type="range"
                min="4"
                max="240"
                value={craftHours}
                onChange={(e) => setCraftHours(Number(e.target.value))}
                className="w-full accent-[#C85A27] h-2 bg-stone-200 dark:bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Living Wage per Hour:</span>
                <span className="text-stone-900 dark:text-amber-400 font-mono">₹{hourlyWage} / hr</span>
              </div>
              <input
                type="range"
                min="80"
                max="250"
                value={hourlyWage}
                onChange={(e) => setHourlyWage(Number(e.target.value))}
                className="w-full accent-[#C85A27] h-2 bg-stone-200 dark:bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Transparent Cost Breakdown Table */}
          <div className="bg-stone-50 dark:bg-[#0B0F17] rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800 space-y-2.5 text-xs font-sans">
            <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
              <span>Artisan Dedicated Labor ({craftHours} hrs × ₹{hourlyWage})</span>
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100">₹{artisanLaborValue.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
              <span>Rare Geographical Raw Materials & Firing</span>
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100">₹{materialCost.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
              <span className="flex items-center gap-1">
                <span>GI Tag Heritage Lineage Bonus</span>
                <Award className="w-3.5 h-3.5 text-amber-500" />
              </span>
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100">₹{giHeritagePremium.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
              <span>CraftLink Direct Platform Maintenance (5%)</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">₹{platformFairFee.toLocaleString('en-IN')}</span>
            </div>

            <div className="border-t border-stone-200 dark:border-stone-800 pt-3 flex justify-between items-center text-sm font-bold">
              <span>Estimated Fair Retail Valuation:</span>
              <span className="text-lg font-mono text-[#C85A27] dark:text-amber-400">
                ₹{totalFairEstimate.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Karigar Direct Impact Highlight */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs font-mono">
                {artisanSharePercent}%
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Direct Karigar Share
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
                  Zero middleman cuts (middlemen take up to 70% in offline markets).
                </div>
              </div>
            </div>

            <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-600/20" />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 font-bold text-xs hover:opacity-90 transition-opacity"
          >
            Done • Close Valuation Inspector
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
