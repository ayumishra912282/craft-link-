import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi, searchApi, metaApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import ProductCard from '../components/ProductCard';
import SearchWithSemanticAI from '../components/SearchWithSemanticAI';
import FilterSidebar from '../components/FilterSidebar';
import { Sparkles, SlidersHorizontal, Loader2 } from 'lucide-react';
import { FALLBACK_PRODUCTS } from '../data/seedProductsFallback';

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
    }).catch(err => {
      // Fallback categories if server not reached
      setCategories(['Home Decor', 'Apparel & Accessories', 'Tribal Art & Sculptures', 'Toys & Games']);
      setCraftTypes(['Blue Pottery', 'Pashmina Weaving & Sozni', 'Dhokra Bell Metal', 'Lacquer Woodcraft', 'Banarasi Handloom Silk', 'Madhubani Folk Painting']);
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
      <div className="text-center max-w-2xl mx-auto mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900 mb-2">
          {t('marketplaceTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Discover certified regional crafts directly from master karigars across India.
        </p>
      </div>

      <SearchWithSemanticAI
        onSearch={handleSearch}
        isSearching={isSearching}
        currentIntent={currentIntent}
      />

      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-terracotta" />
          <span>Filters</span>
        </button>

        <div className="text-xs font-medium text-stone-500">
          Showing <strong className="text-stone-900">{products.length}</strong> handcrafted items
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-400 hidden sm:inline">{t('sortBy')}:</span>
          <select
            value={sortBy}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 font-medium focus:outline-none focus:border-terracotta cursor-pointer"
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

        {mobileFilterOpen && (
          <div className="lg:hidden col-span-1 mb-4">
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
          </div>
        )}

        <div className="col-span-1 lg:col-span-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-stone-400 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
              <span className="text-xs font-semibold">Discovering artisanal listings...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-terracotta mx-auto flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-serif text-stone-900">{t('noProductsFound')}</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Try searching using descriptive craft terms or reset your active filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  matchReasons={matchReasons[p.id] || []}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
