import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi, searchApi, metaApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import ProductCard from '../components/ProductCard';
import SearchWithSemanticAI from '../components/SearchWithSemanticAI';
import FilterSidebar from '../components/FilterSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import { FALLBACK_PRODUCTS } from '../data/seedProductsFallback';

// Skeleton card for loading state
function ProductCardSkeleton({ index }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white dark:bg-[#131B2A] rounded-2xl overflow-hidden border border-stone-200/80 dark:border-stone-800/80 shadow-sm"
    >
      <div className="skeleton aspect-[4/3]" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-2/3 rounded-lg" />
        <div className="skeleton h-5 w-full rounded-lg" />
        <div className="skeleton h-3 w-full rounded-lg" />
        <div className="skeleton h-3 w-4/5 rounded-lg" />
        <div className="flex justify-between pt-2">
          <div className="skeleton h-3 w-16 rounded-full" />
          <div className="skeleton h-3 w-16 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

export default function MarketplacePage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [currentIntent, setCurrentIntent] = useState(null);
  const [matchReasons, setMatchReasons] = useState({});

  const [categories, setCategories] = useState([]);
  const [craftTypes, setCraftTypes] = useState([]);
  const [regions, setRegions] = useState([]);

  const selectedCategory = searchParams.get('category') || '';
  const selectedCraft = searchParams.get('craft') || '';
  const selectedRegion = searchParams.get('region') || '';
  const sortBy = searchParams.get('sort') || 'newest';

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      metaApi.getCategories(),
      metaApi.getCrafts(),
      metaApi.getRegions()
    ]).then(([catRes, craftRes, regRes]) => {
      setCategories(catRes.data);
      setCraftTypes(craftRes.data);
      setRegions(regRes.data);
    }).catch(() => {
      setCategories(['Home Decor', 'Apparel & Accessories', 'Tribal Art & Sculptures', 'Toys & Games']);
      setCraftTypes(['Blue Pottery', 'Pashmina Weaving', 'Dhokra Bell Metal', 'Lacquer Woodcraft', 'Banarasi Silk', 'Madhubani Painting']);
      setRegions(['Rajasthan', 'Jammu & Kashmir', 'Chhattisgarh', 'Karnataka', 'Uttar Pradesh', 'Bihar']);
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = searchParams.get('q');
        if (query) {
          setIsSearching(true);
          const res = await searchApi.semanticSearch({
            query,
            category: selectedCategory || null,
            craft_type: selectedCraft || null,
            region: selectedRegion || null,
            limit: 30
          });
          setProducts(res.data.products);
          setCurrentIntent(res.data.interpreted_intent);
          setMatchReasons(res.data.match_reasons || {});
          setIsSearching(false);
        } else {
          const res = await productApi.getProducts({
            status: 'published',
            category: selectedCategory || null,
            craft_type: selectedCraft || null,
            region: selectedRegion || null,
            sort_by: sortBy,
            limit: 50
          });
          setProducts(res.data && res.data.length > 0 ? res.data : FALLBACK_PRODUCTS);
          setCurrentIntent(null);
          setMatchReasons({});
        }
      } catch (err) {
        console.warn('API fetch failed, utilizing fallback dataset:', err);
        let filtered = [...FALLBACK_PRODUCTS];
        if (selectedCategory) filtered = filtered.filter(p => p.category === selectedCategory);
        if (selectedCraft) filtered = filtered.filter(p => p.craft_type === selectedCraft);
        if (selectedRegion) filtered = filtered.filter(p => p.state === selectedRegion || p.region.includes(selectedRegion));
        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, selectedCategory, selectedCraft, selectedRegion, sortBy]);

  const handleSearch = (q) => {
    const newParams = new URLSearchParams(searchParams);
    if (q) {
      newParams.set('q', q);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const handleFilterChange = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set(key, val);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto mb-6"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900 dark:text-stone-100 mb-2">
          {t('marketplaceTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Discover certified regional crafts directly from master karigars across India.
        </p>
      </motion.div>

      <SearchWithSemanticAI
        onSearch={handleSearch}
        isSearching={isSearching}
        currentIntent={currentIntent}
      />

      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200 dark:border-stone-800">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#C85A27]" />
          <span>Filters</span>
        </button>

        <div className="text-xs font-medium text-stone-500 dark:text-stone-400">
          Showing <strong className="text-stone-900 dark:text-stone-100">{products.length}</strong> handcrafted items
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-400 hidden sm:inline">{t('sortBy')}:</span>
          <select
            value={sortBy}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-800 dark:text-stone-200 font-medium focus:outline-none focus:border-[#C85A27] cursor-pointer"
          >
            <option value="newest">{t('sortNewest')}</option>
            <option value="views">{t('sortViews')}</option>
            <option value="price_asc">{t('sortPriceLow')}</option>
            <option value="price_desc">{t('sortPriceHigh')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterSidebar
            categories={categories}
            craftTypes={craftTypes}
            regions={regions}
            selectedCategory={selectedCategory}
            selectedCraft={selectedCraft}
            selectedRegion={selectedRegion}
            onCategoryChange={(val) => handleFilterChange('category', val)}
            onCraftChange={(val) => handleFilterChange('craft', val)}
            onRegionChange={(val) => handleFilterChange('region', val)}
            onReset={handleResetFilters}
          />
        </div>

        <AnimatePresence>
          {mobileFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden col-span-1 mb-4 overflow-hidden"
            >
              <FilterSidebar
                categories={categories}
                craftTypes={craftTypes}
                regions={regions}
                selectedCategory={selectedCategory}
                selectedCraft={selectedCraft}
                selectedRegion={selectedRegion}
                onCategoryChange={(val) => { handleFilterChange('category', val); setMobileFilterOpen(false); }}
                onCraftChange={(val) => { handleFilterChange('craft', val); setMobileFilterOpen(false); }}
                onRegionChange={(val) => { handleFilterChange('region', val); setMobileFilterOpen(false); }}
                onReset={handleResetFilters}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="col-span-1 lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} index={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-[#C85A27] mx-auto flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100">{t('noProductsFound')}</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                Try searching using descriptive craft terms or reset your active filters.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleResetFilters}
                className="px-5 py-2 rounded-xl bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors"
              >
                Clear all filters
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {products.map((p, index) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  matchReasons={matchReasons[p.id] || []}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
