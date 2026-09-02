import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function FilterSidebar({
  categories = [],
  craftTypes = [],
  regions = [],
  selectedCategory,
  selectedCraft,
  selectedRegion,
  onCategoryChange,
  onCraftChange,
  onRegionChange,
  onReset
}) {
  const { t } = useLanguage();

  const hasFilters = selectedCategory || selectedCraft || selectedRegion;

  return (
    <aside className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2 font-bold text-sm text-stone-900">
          <Filter className="w-4 h-4 text-terracotta" />
          <span>Filters</span>
        </div>
        {hasFilters && (
          <button
            onClick={onReset}
            className="text-xs text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2.5">
          {t('allCategories')}
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1 text-xs">
          <button
            onClick={() => onCategoryChange('')}
            className={'w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ' + (
              !selectedCategory ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-600 hover:bg-stone-50'
            )}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={'w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ' + (
                selectedCategory === cat ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-600 hover:bg-stone-50'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Craft Traditions */}
      <div>
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2.5">
          {t('filterByCraft')}
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1 text-xs">
          <button
            onClick={() => onCraftChange('')}
            className={'w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ' + (
              !selectedCraft ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-600 hover:bg-stone-50'
            )}
          >
            All Crafts
          </button>
          {craftTypes.map((craft) => (
            <button
              key={craft}
              onClick={() => onCraftChange(craft)}
              className={'w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ' + (
                selectedCraft === craft ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-600 hover:bg-stone-50'
              )}
            >
              {craft}
            </button>
          ))}
        </div>
      </div>

      {/* Regions / States */}
      <div>
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2.5">
          {t('filterByState')}
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1 text-xs">
          <button
            onClick={() => onRegionChange('')}
            className={'w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ' + (
              !selectedRegion ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-600 hover:bg-stone-50'
            )}
          >
            All India
          </button>
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => onRegionChange(reg)}
              className={'w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ' + (
                selectedRegion === reg ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-600 hover:bg-stone-50'
              )}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
