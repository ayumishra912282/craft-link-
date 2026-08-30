import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles, Eye, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function ProductCard({ product, matchReasons = [] }) {
  const { t } = useLanguage();

  return (
    <div className="group bg-white dark:bg-[#131B2A] rounded-2xl overflow-hidden border border-stone-200/80 dark:border-stone-800/80 hover:border-amber-400/80 dark:hover:border-amber-400/50 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-900">
        <img
          src={product.image_url}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Craft Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 dark:bg-[#0B0F17]/90 text-stone-900 dark:text-stone-100 backdrop-blur-md shadow-xs border border-stone-100 dark:border-stone-800 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C85A27] dark:text-amber-400" />
            <span>{product.craft_type}</span>
          </span>
        </div>

        {/* GI Provenance Tag if available */}
        <div className="absolute top-3 right-3">
          <span className="p-1.5 rounded-full bg-emerald-600/90 text-white backdrop-blur-md shadow-xs flex items-center justify-center" title="GI Tag Provenance Verified">
            <ShieldCheck className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Price Tag */}
        {product.price > 0 && (
          <div className="absolute bottom-3 right-3">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-stone-900/90 dark:bg-amber-500 text-white dark:text-stone-950 backdrop-blur-md shadow-sm font-mono">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Region & Views */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
          <span className="flex items-center gap-1 font-medium text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-800/40">
            <MapPin className="w-3 h-3 text-[#C85A27] dark:text-amber-400" />
            <span>{product.region}, {product.state}</span>
          </span>
          <span className="flex items-center gap-1 text-[11px] text-stone-400">
            <Eye className="w-3 h-3" />
            <span>{product.views || 0} views</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-[#C85A27] dark:group-hover:text-amber-400 transition-colors line-clamp-1 mb-2">
          <Link to={'/product/' + product.id}>{product.title}</Link>
        </h3>

        {/* Short Description */}
        <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed mb-4 flex-grow font-sans">
          {product.short_description || product.description}
        </p>

        {/* Match Reasons (if from semantic search) */}
        {matchReasons && matchReasons.length > 0 && (
          <div className="mb-3 p-2 bg-amber-50/80 dark:bg-stone-800/80 rounded-xl border border-amber-200/60 dark:border-stone-700">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>{t('whyMatch')}</span>
            </div>
            <ul className="text-[11px] text-amber-800 dark:text-amber-200 space-y-0.5 list-disc list-inside">
              {matchReasons.slice(0, 2).map((reason, idx) => (
                <li key={idx} className="line-clamp-1">{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags & Action */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between mt-auto">
          <div className="flex flex-wrap gap-1 max-w-[65%]">
            {product.tags && product.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="text-[10px] px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-full font-medium">
                #{tag}
              </span>
            ))}
          </div>

          <Link
            to={'/product/' + product.id}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#C85A27] dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 group/link"
          >
            <span>{t('viewDetails')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
