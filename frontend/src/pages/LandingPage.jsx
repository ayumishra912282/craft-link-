import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Camera, ShoppingBag, ArrowRight, ShieldCheck, 
  Globe, TrendingUp, Users, Award, Eye
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { productApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedCounter from '../components/AnimatedCounter';
import CraftVideoShowcase from '../components/CraftVideoShowcase';
import ArtisanAudioStoryteller from '../components/ArtisanAudioStoryteller';
import CraftTextureInspector from '../components/CraftTextureInspector';
import InteractiveCraftMap from '../components/InteractiveCraftMap';
import NaturalPaletteInspector from '../components/NaturalPaletteInspector';
import CraftCategoryMarquee from '../components/CraftCategoryMarquee';
import { FALLBACK_PRODUCTS } from '../data/seedProductsFallback';

export const CRAFT_CATEGORIES = [
  { id: 'pottery', name: 'Blue Pottery & Clay', hindi: 'नीली मिट्टी व बर्तन', icon: '🏺', count: '140+ Crafts' },
  { id: 'textiles', name: 'Handloom & Silk', hindi: 'हथकरघा व रेशम', icon: '🧵', count: '320+ Crafts' },
  { id: 'metal', name: 'Dhokra & Brass', hindi: 'ढोकरा व पीतल', icon: '🪙', count: '85+ Crafts' },
  { id: 'wood', name: 'Channapatna Wood', hindi: 'काष्ठ व खिलौना', icon: '🪵', count: '110+ Crafts' },
  { id: 'painting', name: 'Madhubani & Folk', hindi: 'मधुबनी व लोक चित्र', icon: '🎨', count: '215+ Crafts' },
  { id: 'jewelry', name: 'Filigree Jewelry', hindi: 'हस्तनिर्मित आभूषण', icon: '📿', count: '95+ Crafts' },
];

export default function LandingPage() {
  const { t, lang } = useLanguage();
  const { isDark } = useTheme();
  const [featuredProducts, setFeaturedProducts] = useState(FALLBACK_PRODUCTS.slice(0, 4));

  useEffect(() => {
    productApi.getProducts({ limit: 4, sort_by: 'views' })
      .then(res => {
        if (res.data && res.data.length > 0) setFeaturedProducts(res.data);
      })
      .catch(err => {
        console.warn('Using fallback featured crafts:', err);
        setFeaturedProducts(FALLBACK_PRODUCTS.slice(0, 4));
      });
  }, []);

  return (
    <div className="space-y-32 sm:space-y-48 py-12 sm:py-20 overflow-hidden transition-colors duration-300">
      
      {/* 1. HERO SECTION (Spacious, Breathable & Clean) */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 text-center space-y-10 sm:space-y-12">
        
        {/* Subtle Pill */}
        <ScrollReveal direction="down">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-amber-100/80 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/40 shadow-xs">
            <Sparkles className="w-4 h-4 text-[#C85A32] dark:text-amber-400" />
            <span>
              {lang === 'hi' ? 'भारतीय कारीगरों और हस्तकला का सशक्तिकरण' : 'Empowering India\'s Master Karigars'}
            </span>
          </div>
        </ScrollReveal>

        {/* Editorial Headline with Generous Leading */}
        <ScrollReveal delay={0.1}>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-serif text-stone-900 dark:text-stone-100 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            {lang === 'hi' ? (
              <>
                एक साधारण तस्वीर से{' '}
                <span className="text-[#C85A32] dark:text-amber-400">
                  डिजिटल कैटलॉग
                </span>{' '}
                तक।
              </>
            ) : (
              <>
                From a simple photo to a{' '}
                <span className="text-[#C85A32] dark:text-amber-400">
                  digital catalogue
                </span>.
              </>
            )}
          </h1>
        </ScrollReveal>

        {/* Spacious Body Text */}
        <ScrollReveal delay={0.15}>
          <p className="text-base sm:text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed font-sans">
            {lang === 'hi'
              ? 'शून्य टाइपिंग अवरोध। अपने शिल्प की एक तस्वीर खींचें, और हमारा AI सीधे वैश्विक खरीदारों के लिए पूर्ण विवरण तैयार करेगा।'
              : 'Zero typing barrier. Snap a photo of your craft, and our AI vision generates certified export descriptions, GI provenance, and fair market prices.'}
          </p>
        </ScrollReveal>

        {/* Spacious Call to Action Buttons */}
        <ScrollReveal delay={0.2}>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              to="/artisan/products/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-[#C85A32] hover:bg-[#A94320] text-white font-bold text-base shadow-lg shadow-amber-900/15 hover:scale-[1.02] transition-all"
            >
              <Camera className="w-5 h-5" />
              <span>{t('startSelling')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/marketplace"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-white dark:bg-[#131B2A] text-stone-900 dark:text-stone-100 font-bold text-base border-2 border-stone-200 dark:border-stone-700 hover:border-amber-400 hover:bg-stone-50 dark:hover:bg-stone-800 shadow-sm transition-all"
            >
              <ShoppingBag className="w-5 h-5 text-[#C85A32] dark:text-amber-400" />
              <span>{t('exploreCrafts')}</span>
            </Link>
          </div>
        </ScrollReveal>

        {/* Trust Points */}
        <ScrollReveal delay={0.25}>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-8 text-xs font-semibold text-stone-600 dark:text-stone-400 font-sans">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Zero Typing Barrier</span>
            </span>
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#C85A32] dark:text-amber-400" />
              <span>11 Indian Languages</span>
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>GI Provenance Verified</span>
            </span>
          </div>
        </ScrollReveal>

      </section>

      {/* 2. LIVING CRAFT CATEGORIES (Infinite Moving Horizontal Stream with Pause & Zoom) */}
      <CraftCategoryMarquee />

      {/* 3. DUAL-AUDIENCE GATEWAY (Artisans vs Connoisseurs) */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            
            {/* For Rural Artisans */}
            <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-amber-100/30 dark:from-[#1C263A] dark:via-[#131B2A] dark:to-[#1C263A] border-2 border-amber-200 dark:border-amber-500/30 shadow-lg space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#C85A32] text-white flex items-center justify-center shadow-md">
                  <Camera className="w-7 h-7" />
                </div>
                <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-amber-200/80 dark:bg-amber-950 text-amber-950 dark:text-amber-300">
                  {lang === 'hi' ? 'कारीगरों के लिए' : 'For Artisans'}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
                {lang === 'hi' ? 'तस्वीर अपलोड करें। बाकी AI करेगा।' : 'Upload Photos. AI Does the Rest.'}
              </h3>
              
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                {lang === 'hi'
                  ? 'अंग्रेजी टाइपिंग या कागजी कार्रवाई की कोई आवश्यकता नहीं है। बस अपने शिल्प की एक तस्वीर खींचें।'
                  : 'No English typing or paperwork needed. Just snap a photo of your craft. Our AI assists in 11 Indian languages with export descriptions and fair pricing.'}
              </p>

              <div className="pt-2">
                <Link
                  to="/artisan/products/new"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#C85A32] dark:text-amber-300 hover:underline"
                >
                  <span>{lang === 'hi' ? 'कैटलॉग टूल आज़माएं' : 'Try the Artisan Copilot'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* For Urban Connoisseurs */}
            <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 text-white border-2 border-stone-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <Award className="w-7 h-7" />
                </div>
                <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                  {lang === 'hi' ? 'खरीदारों के लिए' : 'For Collectors'}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {lang === 'hi' ? '100% प्रामाणिक जीआई शिल्प' : '100% Verified GI Heritage'}
              </h3>
              
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-sans">
                {lang === 'hi'
                  ? 'बिचौलियों के बिना सीधे भारत के राष्ट्रीय पुरस्कार विजेता शिल्पकारों से प्रामाणिक हस्तशिल्प खरीदें।'
                  : 'Acquire directly from National Award-winning master artisans with zero middleman markups and cryptographic provenance tracking.'}
              </p>

              <div className="pt-2">
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:underline"
                >
                  <span>{lang === 'hi' ? 'कलेक्शन देखें' : 'Explore Certified Collection'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* 4. IMPACT METRICS */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8">
        <ScrollReveal>
          <div className="bg-gradient-to-r from-[#1E4D2B] via-emerald-950 to-[#1E4D2B] dark:from-[#0E2015] dark:via-[#09140D] dark:to-[#0E2015] rounded-3xl p-10 sm:p-16 text-white shadow-xl border border-emerald-800/40">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-emerald-800/80">
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-5xl font-black font-serif text-amber-300">
                  <AnimatedCounter from={0} to={3450} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm text-emerald-100 font-medium mt-3 flex items-center justify-center gap-1.5 font-sans">
                  <Users className="w-4 h-4" />
                  <span>Artisans Onboarded</span>
                </div>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-5xl font-black font-serif text-amber-300">
                  <AnimatedCounter from={0} to={28} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm text-emerald-100 font-medium mt-3 flex items-center justify-center gap-1.5 font-sans">
                  <Award className="w-4 h-4" />
                  <span>Heritage GI Clusters</span>
                </div>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-5xl font-black font-serif text-amber-300">
                  <AnimatedCounter from={0} to={12800} prefix="₹" suffix="+" />
                </div>
                <div className="text-xs sm:text-sm text-emerald-100 font-medium mt-3 flex items-center justify-center gap-1.5 font-sans">
                  <TrendingUp className="w-4 h-4" />
                  <span>Avg. Monthly Uplift</span>
                </div>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-5xl font-black font-serif text-amber-300">
                  <AnimatedCounter from={0} to={98} suffix="%" />
                </div>
                <div className="text-xs sm:text-sm text-emerald-100 font-medium mt-3 flex items-center justify-center gap-1.5 font-sans">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Extraction Accuracy</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. INTERACTIVE GEOGRAPHIC CRAFT MAP */}
      <InteractiveCraftMap />

      {/* 6. LIVING HERITAGE NATURAL PALETTE INSPECTOR */}
      <NaturalPaletteInspector />

      {/* 7. ARTISAN AUDIO STORYTELLER */}
      <ArtisanAudioStoryteller />

      {/* 8. 360° TEXTURE & WEAVE MICRO-INSPECTOR */}
      <CraftTextureInspector />

      {/* 7. LIVE MARKETPLACE CURATION */}
      {featuredProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 sm:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-xs uppercase tracking-widest font-bold text-[#C85A32] dark:text-amber-400 mb-1">
                  {lang === 'hi' ? 'लाइव बाज़ार' : 'Live Marketplace'}
                </h2>
                <p className="text-2xl sm:text-4xl font-extrabold font-serif text-stone-900 dark:text-stone-100">
                  {lang === 'hi' ? 'प्रमाणित हस्तशिल्प' : 'Discover Authentic Masterpieces'}
                </p>
              </div>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#C85A32] dark:text-amber-400 hover:underline"
              >
                <span>{lang === 'hi' ? 'सभी शिल्प देखें' : 'Explore all crafts'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((p, idx) => (
              <ScrollReveal key={p.id} delay={idx * 0.1}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* 8. INDIAN CRAFT DOCUMENTARIES */}
      <CraftVideoShowcase />

      {/* 9. FINAL CALL TO ACTION */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-12">
        <ScrollReveal>
          <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 rounded-3xl p-12 sm:p-20 text-white text-center relative overflow-hidden shadow-2xl border border-stone-800">
            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <h2 className="text-3xl sm:text-5xl font-extrabold font-serif">
                {lang === 'hi' ? 'क्या आप अपने शिल्प को डिजिटल करने के लिए तैयार हैं?' : 'Ready to digitize your craft with AI?'}
              </h2>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-sans">
                {lang === 'hi'
                  ? 'हजारों भारतीय कारीगरों से जुड़ें जो बिना किसी टाइपिंग के सिर्फ एक फोटो से अपना व्यवसाय बढ़ा रहे हैं।'
                  : 'Join thousands of Indian artisans transforming single photos into thriving digital craft enterprises with zero typing barrier.'}
              </p>
              <div className="pt-4">
                <Link
                  to="/artisan/products/new"
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-[#C85A32] hover:bg-[#A94320] text-white font-bold text-sm shadow-xl transition-all hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t('startSelling')}</span>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
