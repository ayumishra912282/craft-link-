import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ScrollReveal from './ScrollReveal';

export const CRAFT_CATEGORIES = [
  { id: 'pottery', name: 'Blue Pottery & Clay', hindi: 'नीली मिट्टी व बर्तन', icon: '🏺', state: 'Rajasthan', count: '140+ Crafts' },
  { id: 'textiles', name: 'Handloom & Silk', hindi: 'हथकरघा व रेशम', icon: '🧵', state: 'Uttar Pradesh', count: '320+ Crafts' },
  { id: 'metal', name: 'Dhokra & Brass', hindi: 'ढोकरा व पीतल', icon: '🪙', state: 'Chhattisgarh', count: '85+ Crafts' },
  { id: 'wood', name: 'Channapatna Wood', hindi: 'काष्ठ व खिलौना', icon: '🪵', state: 'Karnataka', count: '110+ Crafts' },
  { id: 'painting', name: 'Madhubani & Folk', hindi: 'मधुबनी व लोक चित्र', icon: '🎨', state: 'Bihar', count: '215+ Crafts' },
  { id: 'jewelry', name: 'Filigree Jewelry', hindi: 'हस्तनिर्मित आभूषण', icon: '📿', state: 'Odisha', count: '95+ Crafts' },
  { id: 'pashmina', name: 'Pashmina & Sozni', hindi: 'पश्मीना व शॉल', icon: '🧣', state: 'Kashmir', count: '180+ Crafts' },
  { id: 'rogan', name: 'Rogan Oil Art', hindi: 'रोगन चित्रकला', icon: '🖌️', state: 'Gujarat', count: '45+ Crafts' },
  { id: 'phulkari', name: 'Phulkari Stitches', hindi: 'फुलकारी कशीदाकारी', icon: '🪡', state: 'Punjab', count: '160+ Crafts' },
  { id: 'bidri', name: 'Bidriware Silver Inlay', hindi: 'बिदरी शिल्प', icon: '🦅', state: 'Karnataka', count: '90+ Crafts' },
  { id: 'warli', name: 'Warli Tribal Art', hindi: 'वारली लोक कला', icon: '🐅', state: 'Maharashtra', count: '175+ Crafts' },
  { id: 'mirror', name: 'Aranmula Metal Mirror', hindi: 'आरणमुला दर्पण', icon: '🪞', state: 'Kerala', count: '60+ Crafts' }
];

export default function CraftCategoryMarquee() {
  const { lang } = useLanguage();

  // Duplicate for seamless endless looping
  const marqueeItems = [...CRAFT_CATEGORIES, ...CRAFT_CATEGORIES];

  return (
    <section className="py-16 sm:py-24 overflow-hidden select-none">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto mb-14 px-6 space-y-3">
          <div className="text-xs font-bold uppercase tracking-widest text-[#C85A32] dark:text-amber-400 font-sans">
            {lang === 'hi' ? 'शिल्प विधाएँ' : 'Heritage Craft Collections'}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-stone-900 dark:text-stone-100">
            {lang === 'hi' ? 'श्रेणियों के अनुसार अन्वेषण करें' : 'Explore by Craft Form'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            {lang === 'hi'
              ? 'किसी भी श्रेणी पर कर्सर ले जाकर रोकें और सीधे बाज़ार में देखें।'
              : 'Hover on any craft card to pause the continuous stream and discover regional collections.'}
          </p>
        </div>
      </ScrollReveal>

      {/* Infinite Horizontal Moving Stream */}
      <div className="relative w-full overflow-hidden group">
        
        {/* Soft edge fade masks for high-end look */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#FAF7F5] dark:from-[#0B0F17] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#FAF7F5] dark:from-[#0B0F17] to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] gap-6 px-4">
          {marqueeItems.map((cat, idx) => (
            <Link
              key={`${cat.id}-${idx}`}
              to={`/marketplace?category=${encodeURIComponent(cat.id)}`}
              className="w-56 h-64 shrink-0 flex flex-col justify-between items-center p-7 rounded-3xl bg-white dark:bg-[#131B2A] text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 shadow-sm transition-all duration-300 ease-out cursor-pointer hover:bg-[#C85A32] hover:text-white hover:border-[#C85A32] hover:scale-90 hover:shadow-2xl text-center group/card"
            >
              <div className="text-4xl group-hover/card:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#C85A32] dark:text-amber-400 group-hover/card:text-amber-200">
                  {cat.state}
                </div>
                <div className="font-heading font-bold text-base leading-snug line-clamp-2">
                  {lang === 'hi' ? cat.hindi : cat.name}
                </div>
              </div>

              <div className="text-[11px] font-bold px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40 group-hover/card:bg-white/20 group-hover/card:text-white group-hover/card:border-white/30 transition-colors">
                {cat.count}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
