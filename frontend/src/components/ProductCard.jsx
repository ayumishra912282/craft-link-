import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles, Eye, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function ProductCard({ product, matchReasons = [], index = 0 }) {
  const { t } = useLanguage();
  const cardRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // 3D tilt effect on mouse move
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    setTilt({ x: y * -6, y: x * 6 }); // subtle 3D tilt
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${isHovered ? '8px' : '0px'})`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
      }}
      className="group bg-white dark:bg-[#131B2A] rounded-2xl overflow-hidden border border-stone-200/80 dark:border-stone-800/80 hover:border-amber-400/60 dark:hover:border-amber-400/40 shadow-sm hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-900 craft-img-container">
        <img
          src={product.image_url}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Craft Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.07 + 0.2 }}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 dark:bg-[#0B0F17]/90 text-stone-900 dark:text-stone-100 backdrop-blur-md shadow-sm border border-stone-100 dark:border-stone-800 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-[#C85A27] dark:text-amber-400" />
            <span>{product.craft_type}</span>
          </motion.span>
        </div>

        {/* GI Verified */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span className="p-1.5 rounded-full bg-emerald-600/90 text-white backdrop-blur-md shadow-sm flex items-center justify-center" title="GI Tag Provenance Verified">
            <ShieldCheck className="w-3.5 h-3.5" />
          </span>
          {/* Like Button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => setLiked(!liked)}
            className={`p-1.5 rounded-full backdrop-blur-md shadow-sm flex items-center justify-center transition-colors ${liked ? 'bg-red-500 text-white' : 'bg-white/90 text-stone-400 hover:text-red-500'}`}
          >
            <Heart className="w-3.5 h-3.5" fill={liked ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        {/* Price Tag */}
        {product.price > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 + 0.3 }}
            className="absolute bottom-3 right-3"
          >
            <span className="px-3 py-1 rounded-full text-xs font-black bg-stone-900/90 dark:bg-amber-500 text-white dark:text-stone-950 backdrop-blur-md shadow-sm font-mono">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          </motion.div>
        )}

        {/* Quick view overlay button */}
        <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={'/product/' + product.id}
            className="px-4 py-2 rounded-xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-xs font-bold text-stone-900 dark:text-stone-100 shadow-lg border border-white/50 flex items-center gap-1.5 hover:bg-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#C85A27]" />
            Quick View
          </Link>
        </div>
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
            <span>{product.views || 0}</span>
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

          <motion.div whileHover={{ x: 3 }}>
            <Link
              to={'/product/' + product.id}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#C85A27] dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
            >
              <span>{t('viewDetails')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
