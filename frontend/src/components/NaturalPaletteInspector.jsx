import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Check, Copy, Sparkles } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export const PIGMENTS = [
  { name: 'Indigo Nil', hex: '#1E2B4D', origin: 'Tamil Nadu & Bengal Indigofera Leaves', role: 'Royal Silks & Blockprints' },
  { name: 'Jaipur Cobalt', hex: '#1A4B8C', origin: 'Egyptian Copper Oxide & Natural Gum', role: 'Glazed Blue Pottery' },
  { name: 'Bastar Ochre', hex: '#C85A32', origin: 'Natural Red Soil & River Iron Clay', role: 'Lost-Wax Bronze & Terracotta' },
  { name: 'Kashmiri Saffron', hex: '#F59E0B', origin: 'Pampore Crocus Sativus Stigmas', role: 'Pure Pashmina Shawl Borders' },
  { name: 'Channapatna Turmeric', hex: '#EAB308', origin: 'Curcuma Longa Root & Vegetable Lac', role: 'Organic Wood Lacquerware' },
  { name: 'Varanasi Raw Silk', hex: '#FAF7F5', origin: 'Natural Unbleached Mulberry Cocoons', role: 'Kadwa Brocade Foundation' }
];

export default function NaturalPaletteInspector() {
  const [copiedHex, setCopiedHex] = useState(null);

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
      <ScrollReveal>
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#131B2A] border border-stone-200 dark:border-stone-800 shadow-xl space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 mb-2">
                <Palette className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>100% Non-Toxic Botanical & Mineral Sourcing</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-stone-900 dark:text-stone-100">
                Living Indian Heritage Color Palette
              </h2>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs leading-relaxed">
              Extracted from ancestral organic dyes and raw minerals used by our master artisans.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {PIGMENTS.map((pigment) => (
              <div
                key={pigment.hex}
                onClick={() => copyToClipboard(pigment.hex)}
                className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 hover:border-amber-400 cursor-pointer transition-all hover:-translate-y-1 group"
              >
                <div
                  className="w-full aspect-square rounded-xl shadow-xs mb-3 flex items-end justify-end p-2 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: pigment.hex }}
                >
                  <div className="w-6 h-6 rounded-md bg-black/40 backdrop-blur-xs flex items-center justify-center text-white">
                    {copiedHex === pigment.hex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </div>
                </div>
                <div className="font-heading font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                  {pigment.name}
                </div>
                <div className="font-mono text-[10px] text-stone-400 mt-0.5">
                  {pigment.hex}
                </div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-2 line-clamp-2 leading-tight">
                  {pigment.origin}
                </div>
              </div>
            ))}
          </div>

        </div>
      </ScrollReveal>
    </section>
  );
}
