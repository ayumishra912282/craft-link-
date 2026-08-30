import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi, recommendationApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles, MapPin, ShieldCheck, MessageSquare, ArrowLeft, Eye, Award, User, Layers, Palette, Calculator, MessageCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ContactArtisanModal from '../components/ContactArtisanModal';
import FairPriceCalculatorModal from '../components/FairPriceCalculatorModal';
import WhatsAppArtisanInquiryModal from '../components/WhatsAppArtisanInquiryModal';
import { FALLBACK_PRODUCTS } from '../data/seedProductsFallback';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { t } = useLanguage();

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    productApi.getProduct(id)
      .then(res => {
        setProduct(res.data);
        return recommendationApi.getRecommendations(id);
      })
      .then(recRes => {
        setRecommendations(recRes.data);
      })
      .catch(err => {
        console.warn('Product detail API fetch failed, utilizing fallback dataset:', err);
        const found = FALLBACK_PRODUCTS.find(p => p.id === id) || FALLBACK_PRODUCTS[0];
        setProduct(found);
        setRecommendations(FALLBACK_PRODUCTS.filter(p => p.id !== found.id).slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-stone-400">
        <div className="animate-spin w-8 h-8 border-4 border-[#C85A27] border-t-transparent rounded-full mx-auto mb-3" />
        <span className="text-xs font-semibold">Loading craft masterpiece...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100 mb-2">Product Not Found</h2>
        <Link to="/marketplace" className="text-xs text-[#C85A27] dark:text-amber-400 hover:underline font-bold">
          ← Return to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-[#C85A27] dark:hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white dark:bg-[#131B2A] rounded-3xl p-6 sm:p-10 border border-stone-200/80 dark:border-stone-800 shadow-md">
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 relative group">
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-stone-900/90 text-stone-900 dark:text-stone-100 backdrop-blur-md shadow-sm border border-stone-100 dark:border-stone-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C85A27] dark:text-amber-400" />
                <span>{product.craft_type}</span>
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/40 rounded-2xl border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between text-xs text-amber-900 dark:text-amber-300">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#C85A27] dark:text-amber-400 shrink-0" />
              <span>{t('verifiedHandmade')}</span>
            </div>
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider bg-white dark:bg-stone-900 px-2 py-0.5 rounded shadow-xs border border-amber-200/50 dark:border-amber-800/40">
              AI Digitized Provenance
            </span>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1 font-bold text-[#C85A27] dark:text-amber-400 bg-orange-50 dark:bg-orange-950/50 px-2.5 py-1 rounded-lg border border-orange-200/40 dark:border-orange-900/40">
                <MapPin className="w-3.5 h-3.5" />
                <span>{product.region}, {product.state}</span>
              </span>
              <span className="flex items-center gap-1 text-[11px] text-stone-400">
                <Eye className="w-3.5 h-3.5" />
                <span>{product.views || 0} views</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-luxury text-stone-900 dark:text-stone-100 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300">
              <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-[10px]">
                <User className="w-3.5 h-3.5" />
              </div>
              <span>Crafted by <strong className="text-stone-900 dark:text-stone-100">{product.artisan_name}</strong></span>
            </div>

            {product.price > 0 && (
              <div className="pt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-stone-900 dark:text-amber-400 font-mono">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-stone-400 font-medium font-sans">(Direct Karigar Price • 0% Middleman)</span>
              </div>
            )}

            <div className="pt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed space-y-2 font-sans">
              <p>{product.description}</p>
            </div>

            <div className="pt-4 grid grid-cols-2 gap-3 text-xs font-sans">
              <div className="p-3 bg-stone-50 dark:bg-stone-900/80 rounded-xl border border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-1.5 text-stone-400 font-bold uppercase text-[10px] mb-1">
                  <Layers className="w-3 h-3 text-[#C85A27] dark:text-amber-400" />
                  <span>Material</span>
                </div>
                <div className="font-semibold text-stone-900 dark:text-stone-100">{product.material}</div>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-900/80 rounded-xl border border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-1.5 text-stone-400 font-bold uppercase text-[10px] mb-1">
                  <Palette className="w-3 h-3 text-[#C85A27] dark:text-amber-400" />
                  <span>Colors</span>
                </div>
                <div className="font-semibold text-stone-900 dark:text-stone-100">
                  {product.colors && product.colors.length > 0 ? product.colors.join(', ') : 'Natural Tones'}
                </div>
              </div>
            </div>

            {product.buyer_segments && product.buyer_segments.length > 0 && (
              <div className="pt-2">
                <div className="text-[11px] font-bold uppercase text-stone-400 tracking-wider mb-1.5">
                  {t('potentialBuyers')}:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.buyer_segments.map((seg, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-medium border border-amber-200/50 dark:border-amber-800/40">
                      {seg}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setWhatsappOpen(true)}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 font-sans"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Karigar Directly</span>
            </button>

            <button
              onClick={() => setCalculatorOpen(true)}
              className="py-3.5 px-5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 font-sans border border-stone-200 dark:border-stone-700"
            >
              <Calculator className="w-4 h-4 text-[#C85A27] dark:text-amber-400" />
              <span>Fair-Wage Calculator</span>
            </button>

            <button
              onClick={() => setContactModalOpen(true)}
              className="py-3.5 px-4 rounded-2xl bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
              title="Send Web Inquiry"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {product.craft_story && (
        <section className="bg-gradient-to-br from-amber-50/70 via-stone-50 to-orange-50/50 dark:from-[#131B2A] dark:via-[#111622] dark:to-[#131B2A] rounded-3xl p-6 sm:p-10 border border-amber-200/60 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-[#C85A27] text-white flex items-center justify-center shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-luxury text-stone-900 dark:text-stone-100">
                {t('craftProvenance')}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">Cultural & Geographical Heritage of {product.craft_type}</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed max-w-4xl font-sans">
            {product.craft_story}
          </p>
        </section>
      )}

      {recommendations.length > 0 && (
        <section className="space-y-6 pt-4">
          <div>
            <h2 className="text-xs uppercase tracking-widest font-bold text-[#C85A27] dark:text-amber-400 mb-1 font-sans">
              Curated Recommendations
            </h2>
            <p className="text-2xl font-bold font-luxury text-stone-900 dark:text-stone-100">
              {t('youMayAlsoLike')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((rec) => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <ContactArtisanModal
        product={product}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      <FairPriceCalculatorModal
        product={product}
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
      />

      <WhatsAppArtisanInquiryModal
        product={product}
        isOpen={whatsappOpen}
        onClose={() => setWhatsappOpen(false)}
      />
    </div>
  );
}
