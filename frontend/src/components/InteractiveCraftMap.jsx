import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Sparkles, ArrowRight, ShieldCheck, Users, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ScrollReveal from './ScrollReveal';

export const CRAFT_HUBS = [
  {
    id: 'rajasthan',
    name: 'Jaipur & Jodhpur',
    state: 'Rajasthan',
    craft: 'Blue Pottery & Handblock Prints',
    artisanCount: 420,
    giRegisteredYear: '2008',
    materials: 'Natural Quartz, Egyptian Copper Oxide',
    coordinates: { top: '38%', left: '28%' },
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    description: '400-year-old Persian-Rajput lineage crafted without clay on manual hand wheels.'
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    craft: 'Kadwa Banarasi Silk & Zari',
    artisanCount: 890,
    giRegisteredYear: '2009',
    materials: 'Mulberry Silk, Electroplated Pure Silver Zari',
    coordinates: { top: '44%', left: '56%' },
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    description: 'Individually hand-engraved motifs taking 3 to 6 months of master pit-loom weaving.'
  },
  {
    id: 'bastar',
    name: 'Bastar & Kondagaon',
    state: 'Chhattisgarh',
    craft: 'Dhokra Lost-Wax Bronze',
    artisanCount: 230,
    giRegisteredYear: '2012',
    materials: 'Forest Beeswax, Alluvial River Clay, Molten Brass',
    coordinates: { top: '56%', left: '52%' },
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80',
    description: '4,000-year-old Indus Valley lost-wax method preserved by indigenous tribal sculptors.'
  },
  {
    id: 'kashmir',
    name: 'Srinagar Valley',
    state: 'Jammu & Kashmir',
    craft: 'Pashmina & Sozni Needlecraft',
    artisanCount: 510,
    giRegisteredYear: '2005',
    materials: 'Changthangi Cashmere Wool, Vegetable Dyes',
    coordinates: { top: '16%', left: '32%' },
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
    description: 'Micro-needle hand embroidery woven from high-altitude Ladakhi mountain goats.'
  },
  {
    id: 'karnataka',
    name: 'Channapatna',
    state: 'Karnataka',
    craft: 'Eco Lacquer Woodcraft',
    artisanCount: 310,
    giRegisteredYear: '2006',
    materials: 'Aale Mara (Ivory Wood), Natural Lac, Turmeric Dye',
    coordinates: { top: '78%', left: '38%' },
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    description: 'Safe non-toxic children toys polished using natural palm leaves and vegetable extracts.'
  },
  {
    id: 'gujarat',
    name: 'Nirona, Kutch',
    state: 'Gujarat',
    craft: 'Rogan Castor Oil Painting',
    artisanCount: 85,
    giRegisteredYear: '2014',
    materials: 'Castor Seed Gel, Natural Mineral Pigments',
    coordinates: { top: '48%', left: '18%' },
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    description: 'Only one master family lineage remaining on Earth practicing metal stylus freehand painting.'
  }
];

export default function InteractiveCraftMap() {
  const { lang } = useLanguage();
  const [selectedHub, setSelectedHub] = useState(CRAFT_HUBS[0]);

  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
            <MapPin className="w-3.5 h-3.5 text-[#C85A32] dark:text-amber-400" />
            <span>{lang === 'hi' ? 'भौगोलिक शिल्प मानचित्र' : 'Geographic Craft Lineage'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-stone-900 dark:text-stone-100">
            {lang === 'hi' ? 'भारत के ऐतिहासिक शिल्प केंद्र' : 'Explore Heritage Clusters of India'}
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {lang === 'hi'
              ? 'क्षेत्रीय जीआई मान्यता प्राप्त क्लस्टरों और मास्टर कारीगरों का सीधे अन्वेषण करें।'
              : 'Interactive discovery of certified GI origin hubs and master karigar communities.'}
          </p>
        </div>
      </ScrollReveal>

      {/* Main Grid: Hub Selector & Interactive Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: Hub Selection List */}
        <div className="lg:col-span-5 space-y-3">
          {CRAFT_HUBS.map((hub) => (
            <button
              key={hub.id}
              onClick={() => setSelectedHub(hub)}
              className={`w-full text-left p-5 rounded-2xl transition-all border flex items-center justify-between group ${
                selectedHub.id === hub.id
                  ? 'bg-[#C85A32] text-white border-[#C85A32] shadow-md shadow-amber-900/15'
                  : 'bg-white dark:bg-[#131B2A] text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-500/50'
              }`}
            >
              <div>
                <div className={`text-xs font-bold ${selectedHub.id === hub.id ? 'text-amber-200' : 'text-[#C85A32] dark:text-amber-400'}`}>
                  {hub.state}
                </div>
                <div className="text-base font-bold font-heading mt-0.5">
                  {hub.name}
                </div>
                <div className={`text-xs mt-1 ${selectedHub.id === hub.id ? 'text-white/90' : 'text-stone-500 dark:text-stone-400'}`}>
                  {hub.craft}
                </div>
              </div>
              <div className={`text-xs font-bold px-3 py-1 rounded-full ${
                selectedHub.id === hub.id
                  ? 'bg-white/20 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}>
                {hub.artisanCount}+ Karigars
              </div>
            </button>
          ))}
        </div>

        {/* Right: Rich Hub Spotlight Showcase */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedHub.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full bg-white dark:bg-[#131B2A] rounded-3xl p-8 sm:p-10 border border-stone-200 dark:border-stone-800 shadow-xl flex flex-col justify-between space-y-6"
            >
              <div className="space-y-6">
                <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-900 relative">
                  <img
                    src={selectedHub.image}
                    alt={selectedHub.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>GI Registered {selectedHub.giRegisteredYear}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-widest font-bold text-[#C85A32] dark:text-amber-400">
                    {selectedHub.state} • Heritage Cluster
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-stone-900 dark:text-stone-100 mt-1">
                    {selectedHub.craft}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-300 mt-3 leading-relaxed">
                    {selectedHub.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800">
                    <div className="text-[10px] uppercase font-bold text-stone-400">Verified Raw Materials</div>
                    <div className="text-xs font-semibold text-stone-800 dark:text-stone-200 mt-1">{selectedHub.materials}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800">
                    <div className="text-[10px] uppercase font-bold text-stone-400">Active Karigars</div>
                    <div className="text-xs font-semibold text-stone-800 dark:text-stone-200 mt-1">{selectedHub.artisanCount} Master Artisans</div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100 dark:border-stone-800">
                <Link
                  to={`/marketplace?region=${encodeURIComponent(selectedHub.name)}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 font-bold text-xs hover:opacity-90 transition-opacity"
                >
                  <span>Browse Crafts from {selectedHub.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
