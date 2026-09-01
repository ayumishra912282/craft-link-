import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { artisanApi, productApi } from '../services/api';
import {
  Sparkles, Package, Eye, FileText, CheckCircle2,
  TrendingUp, Clock, Trash2
} from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

export default function ArtisanDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const artisanId = user?.id || 'artisan-ramesh-01';

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes] = await Promise.all([
        artisanApi.getStats(artisanId),
        productApi.getProducts({ artisan_id: artisanId })
      ]);
      setStats(statsRes.data);
      setProducts(prodRes.data);
    } catch (e) {
      console.error('Failed to load artisan dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [artisanId]);

  const handleTogglePublish = async (product) => {
    try {
      const newStatus = product.status === 'published' ? 'draft' : 'published';
      await productApi.updateProduct(product.id, { status: newStatus });
      loadDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productApi.deleteProduct(productId);
        loadDashboardData();
      } catch (e) {
        console.error(e);
      }
    }
  };


  // Show skeleton while loading
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="skeleton h-10 w-64 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0,1,2,3].map(i => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
        <div className="skeleton h-40 rounded-3xl" />
        <div className="skeleton h-64 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Master Karigar Studio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900 dark:text-stone-100">
            {user?.name || 'Artisan'}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {user?.craft_type || 'Handicraft'} • {user?.region || 'India'}, {user?.state || 'India'}
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/artisan/products/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-[#C85A27] to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl transition-shadow pulse-ring"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>{t('addNewProduct')}</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: t('totalProducts'), value: stats?.total_products || products.length, icon: Package, color: 'text-amber-600', sub: 'Catalogued with AI' },
          { label: t('publishedListings'), value: stats?.published_products || products.filter(p => p.status === 'published').length, icon: CheckCircle2, color: 'text-emerald-600', sub: 'Discoverable by buyers', valueColor: 'text-emerald-700 dark:text-emerald-400' },
          { label: t('draftListings'), value: stats?.draft_products || products.filter(p => p.status === 'draft').length, icon: FileText, color: 'text-amber-600', sub: 'Ready to publish', valueColor: 'text-amber-800 dark:text-amber-400' },
          { label: t('totalViews'), value: stats?.total_views || 0, icon: Eye, color: 'text-indigo-600', sub: 'Buyer engagement', suffix: '' },
        ].map(({ label, value, icon: Icon, color, sub, valueColor, suffix }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            className="bg-white dark:bg-[#131B2A] p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-3 text-stone-400">
              <span className="text-xs font-bold uppercase tracking-wider dark:text-stone-500">{label}</span>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className={`text-2xl sm:text-3xl font-extrabold font-serif ${valueColor || 'text-stone-900 dark:text-stone-100'}`}>
              <AnimatedCounter to={value} suffix={suffix} />
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">{sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Buyer Segments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 dark:from-amber-950/20 dark:via-stone-900 dark:to-stone-900 rounded-3xl p-6 sm:p-8 border border-amber-200/70 dark:border-amber-800/30 shadow-sm space-y-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold font-serif text-stone-900 dark:text-stone-100">
              Smart Market Matching — Identified Buyer Segments
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              AI recommendations based on your craft attributes, materials &amp; styling
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {stats?.top_buyer_segments?.map((seg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="p-3.5 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shadow-xs flex flex-col justify-between"
            >
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100">{seg.segment}</div>
              <div className="text-[10px] text-[#C85A27] font-semibold mt-2">
                High Buyer Affinity
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Product Inventory */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-[#131B2A] rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-md space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100">
            Your Craft Inventory
          </h2>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            {products.length} registered items
          </span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Package className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto" />
            </motion.div>
            <p className="text-xs text-stone-500 dark:text-stone-400">You have no products listed yet.</p>
            <Link
              to="/artisan/products/new"
              className="inline-block px-4 py-2 rounded-xl bg-[#C85A27] text-white text-xs font-bold hover:bg-amber-700 transition-colors"
            >
              Add your first craft with AI
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.04 }}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="w-16 h-16 rounded-xl object-cover bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=60'; }}
                    />
                    <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-stone-900 ${p.status === 'published' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 hover:text-[#C85A27] dark:hover:text-amber-400 transition-colors">
                      <Link to={'/product/' + p.id}>{p.title}</Link>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-1">
                      <span className="font-medium">{p.craft_type}</span>
                      <span>•</span>
                      <span className="font-semibold text-stone-900 dark:text-amber-400 font-mono">₹{Number(p.price || 0).toLocaleString('en-IN')}</span>
                      <span>•</span>
                      <span>{p.views || 0} views</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <span className={'px-2.5 py-1 rounded-full text-xs font-bold ' + (
                    p.status === 'published'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  )}>
                    {p.status === 'published' ? t('statusPublished') : t('statusDraft')}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTogglePublish(p)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors"
                  >
                    {p.status === 'published' ? t('unpublish') : t('publish')}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
