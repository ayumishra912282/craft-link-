import React, { useState } from 'react';
import { Search, Sparkles, X, Lightbulb } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function SearchWithSemanticAI({ onSearch, isSearching = false, currentIntent = null }) {
  const [query, setQuery] = useState('');
  const { t } = useLanguage();

  const suggestedQueries = [
    "I want traditional handmade home decoration from Rajasthan",
    "Show me eco-friendly non-toxic wooden toys",
    "Find authentic Kashmiri Pashmina shawls with needle embroidery",
    "Brass lost-wax tribal sculpture for living room decor"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleSuggestionClick = (sq) => {
    setQuery(sq);
    onSearch(sq);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center bg-white rounded-2xl border-2 border-stone-200 group-hover:border-amber-500/80 focus-within:border-terracotta shadow-md shadow-amber-900/5 transition-all p-1.5 sm:p-2">
          <div className="pl-3 pr-2 text-stone-400 group-focus-within:text-terracotta transition-colors">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none py-2 px-1"
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={isSearching}
            className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-terracotta text-white font-semibold text-xs sm:text-sm hover:from-amber-700 hover:to-terracotta-dark shadow-sm transition-all disabled:opacity-70"
          >
            {isSearching ? (
              <span className="flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">AI Search</span>
              </span>
            )}
          </button>
        </div>
      </form>

      {/* AI Intent Interpretation Badge */}
      {currentIntent && (
        <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-xl border border-amber-200/80 flex items-center justify-between text-xs animate-fadeIn">
          <div className="flex items-center gap-2 text-amber-900 font-medium">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>AI Interpreted Intent:</strong> {currentIntent}
            </span>
          </div>
          <button
            onClick={handleClear}
            className="text-[11px] font-bold text-amber-800 hover:underline shrink-0 ml-2"
          >
            Show All
          </button>
        </div>
      )}

      {/* Instant Natural Language Prompts */}
      {!currentIntent && (
        <div className="mt-3 flex items-center flex-wrap gap-1.5 text-xs text-stone-500">
          <span className="flex items-center gap-1 font-semibold text-stone-600 mr-1 text-[11px]">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            Try Natural Queries:
          </span>
          {suggestedQueries.map((sq, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSuggestionClick(sq)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 border border-stone-200/80 hover:border-amber-300 text-stone-700 hover:text-amber-900 transition-all text-left"
            >
              "{sq}"
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
