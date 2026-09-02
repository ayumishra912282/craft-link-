import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, Sparkles, Layers, ShieldCheck, Check } from 'lucide-react';

export const TEXTURE_SAMPLES = [
  {
    id: 'tex-blue-pottery',
    title: 'Cobalt Glaze Craquelure & Quartz Micro-Pores',
    craft: 'Jaipur Blue Pottery',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=90',
    details: 'Low-temperature copper-cobalt oxide glaze forming subtle authentic micro-fissures characteristic of authentic GI Jaipur quartz ceramics.',
    zoomLevel: '8x Optical Micro-View'
  },
  {
    id: 'tex-banarasi-zari',
    title: 'Pure Silver Electroplated Kadwa Zari Weave',
    craft: 'Banarasi Handloom Silk',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=90',
    details: 'Independent warp-and-weft interlocking with zero floats on reverse, woven using real silk and 98% pure silver core filaments.',
    zoomLevel: '12x Optical Micro-View'
  },
  {
    id: 'tex-dhokra-bronze',
    title: 'Lost-Wax Honeycomb Beeswax & Molten Brass Patina',
    craft: 'Bastar Dhokra Bronze',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=90',
    details: 'Unique porous texture created when Sal-forest beeswax vaporizes during molten brass pouring at 1100°C.',
    zoomLevel: '6x Optical Micro-View'
  }
];

export default function CraftTextureInspector() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });

  const activeTex = TEXTURE_SAMPLES[selectedIdx];

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x, y });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="bg-white dark:bg-[#131B2A] rounded-3xl p-6 sm:p-10 border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-[#C85A27] dark:text-amber-300 text-xs font-bold font-sans">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>360° Material & Weave Micro-Inspector</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-luxury font-bold text-stone-900 dark:text-stone-100">
              Inspect Authentic Microscopic Craft Textures
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-sans">
              Hover over the craft canvas to optically examine hand-spun silk warps, raw quartz glazes, and lost-wax bronze patinas.
            </p>
          </div>

          {/* Sample Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {TEXTURE_SAMPLES.map((sample, idx) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setSelectedIdx(idx);
                  setIsZoomed(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedIdx === idx
                    ? 'bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 shadow-sm scale-102'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {sample.craft}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Lens Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div
            className="lg:col-span-8 relative aspect-[16/10] rounded-2xl overflow-hidden bg-stone-900 cursor-crosshair border border-stone-200 dark:border-stone-800 group shadow-md"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={activeTex.image}
              alt={activeTex.title}
              className="w-full h-full object-cover transition-transform duration-300"
              style={{
                transformOrigin: `${lensPos.x}% ${lensPos.y}%`,
                transform: isZoomed ? 'scale(2.2)' : 'scale(1)'
              }}
            />

            {/* Overlays */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-mono font-bold flex items-center gap-1.5 border border-white/20">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{activeTex.zoomLevel}</span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 px-4 py-2.5 rounded-xl bg-black/75 backdrop-blur-md text-white text-xs flex items-center justify-between pointer-events-none">
              <span className="font-serif italic">{activeTex.title}</span>
              <span className="text-[10px] text-amber-400 font-mono">Move Cursor to Zoom</span>
            </div>
          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-4 space-y-4 font-sans">
            <div className="p-5 rounded-2xl bg-stone-50 dark:bg-[#0B0F17] border border-stone-200/80 dark:border-stone-800 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#C85A27] dark:text-amber-400">
                Provenance Authentication:
              </div>

              <h4 className="text-lg font-bold font-luxury text-stone-900 dark:text-stone-100">
                {activeTex.title}
              </h4>

              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {activeTex.details}
              </p>

              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% GI Cluster Origin Verified</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                  <Check className="w-3.5 h-3.5 text-amber-500" />
                  <span>Zero industrial synthetic imitation dyes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
