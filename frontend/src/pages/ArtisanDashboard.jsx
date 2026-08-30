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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <ScrollReveal direction="down">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                Master Karigar Studio
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900">
              {user?.name || 'Ramesh Kumawat'}
            </h1>
            <p className="text-xs text-stone-500">
              {user?.craft_type || 'Blue Pottery'} • {user?.region || 'Jaipur'}, {user?.state || 'Rajasthan'}
            </p>
          </div>

          <Link
            to="/artisan/products/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-terracotta to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>{t('addNewProduct')}</span>
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <ScrollReveal delay={0.05}>
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 craft-card-shadow hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-3 text-stone-400">
              <span className="text-xs font-bold uppercase tracking-wider">{t('totalProducts')}</span>
              <Package className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900">
              <AnimatedCounter to={stats?.total_products || products.length} />
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Catalogued with AI</div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 craft-card-shadow hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-3 text-stone-400">
              <span className="text-xs font-bold uppercase tracking-wider">{t('publishedListings')}</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-serif text-emerald-700">
              <AnimatedCounter to={stats?.published_products || products.filter(p => p.status === 'published').length} />
            </div>
            <div className="text-[11px] text-emerald-600 mt-1">Discoverable by buyers</div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 craft-card-shadow hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-3 text-stone-400">
              <span className="text-xs font-bold uppercase tracking-wider">{t('draftListings')}</span>
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-serif text-amber-800">
              <AnimatedCounter to={stats?.draft_products || products.filter(p => p.status === 'draft').length} />
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Ready to be published</div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 craft-card-shadow hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-3 text-stone-400">
              <span className="text-xs font-bold uppercase tracking-wider">{t('totalViews')}</span>
              <Eye className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900">
              <AnimatedCounter to={stats?.total_views || 382} suffix=" views" />
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Buyer engagement</div>
          </div>
        </ScrollReveal>
      </div>

      <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 rounded-3xl p-6 sm:p-8 border border-amber-200/70 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold font-serif text-stone-900">
              Smart Market Matching ? Identified Buyer Segments
            </h2>
            <p className="text-xs text-stone-500">
              AI recommendations based on your craft attributes, materials & styling
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {stats?.top_buyer_segments?.map((seg, idx) => (
            <div key={idx} className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <div className="text-xs font-bold text-stone-900">{seg.segment}</div>
              <div className="text-[10px] text-terracotta font-semibold mt-2">
                High Buyer Affinity
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-serif text-stone-900">
            Your Craft Inventory
          </h2>
          <span className="text-xs text-stone-500">
            {products.length} registered items
          </span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Package className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-xs text-stone-500">You have no products listed yet.</p>
            <Link
              to="/artisan/products/new"
              className="inline-block px-4 py-2 rounded-xl bg-terracotta text-white text-xs font-bold"
            >
              Add your first craft with AI
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {products.map((p) => (
              <div key={p.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-16 h-16 rounded-xl object-cover bg-stone-100 border border-stone-200"
                  />
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
                    p.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                  )}>
                    {p.status === 'published' ? t('statusPublished') : t('statusDraft')}
                  </span>

                  <button
                    onClick={() => handleToggleStatus(p)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                  >
                    {p.status === 'published' ? t('unpublish') : t('publish')}
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
