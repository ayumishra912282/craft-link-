import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const INDIAN_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', region: 'Pan-India & Global' },
  { code: 'hi', name: 'Hindi', native: '\u0939\u093f\u0928\u094d\u0926\u0940', region: 'North & Central India' },
  { code: 'bn', name: 'Bengali', native: '\u09ac\u09be\u0982\u09b2\u09be', region: 'West Bengal & Tripura' },
  { code: 'mr', name: 'Marathi', native: '\u092e\u0930\u093e\u0920\u0940', region: 'Maharashtra & Goa' },
  { code: 'ta', name: 'Tamil', native: '\u0ba4\u0bae\u0bbf\u0bb4\u0bcd', region: 'Tamil Nadu & Puducherry' },
  { code: 'te', name: 'Telugu', native: '\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41', region: 'Andhra Pradesh & Telangana' },
  { code: 'gu', name: 'Gujarati', native: '\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0', region: 'Gujarat & Kutch' },
  { code: 'kn', name: 'Kannada', native: '\u0c95\u0ca8\u0ccd\u0ca8\u0ca1', region: 'Karnataka' },
  { code: 'ml', name: 'Malayalam', native: '\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02', region: 'Kerala' },
  { code: 'pa', name: 'Punjabi', native: '\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40', region: 'Punjab' },
  { code: 'or', name: 'Odia', native: '\u0b13\u0b21\u0b3c\u0b3f\u0b06', region: 'Odisha' }
];

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = INDIAN_LANGUAGES.find(l => l.code === lang) || INDIAN_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 dark:bg-[#131B2A] hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700/80 shadow-xs transition-all'
        title='Select Indian Regional Language'
      >
        <Globe className='w-3.5 h-3.5 text-[#C85A32] dark:text-amber-400' />
        <span className='font-serif font-bold'>{currentLang.native}</span>
        <ChevronDown className={'w-3 h-3 text-stone-400 transition-transform ' + (isOpen ? 'rotate-180' : '')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className='absolute right-0 mt-2 w-72 sm:w-80 bg-white/95 dark:bg-[#131B2A]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-stone-200/90 dark:border-stone-700/90 p-3 z-50 space-y-2'
          >
            <div className='flex items-center justify-between px-2 py-1 border-b border-stone-100 dark:border-stone-800'>
              <div>
                <div className='text-xs font-bold font-serif text-stone-900 dark:text-stone-100'>Select Regional Language</div>
                <div className='text-[10px] text-stone-400 font-sans'>11 Official Indian Regional Languages</div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className='p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg'
              >
                <X className='w-3.5 h-3.5' />
              </button>
            </div>

            <div className='max-h-72 overflow-y-auto space-y-1 pr-1 scrollbar-none'>
              {INDIAN_LANGUAGES.map((item) => {
                const isSelected = item.code === lang;
                return (
                  <button
                    key={item.code}
                    type='button'
                    onClick={() => {
                      setLang(item.code);
                      setIsOpen(false);
                    }}
                    className={'w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all ' + (
                      isSelected
                        ? 'bg-amber-50 dark:bg-amber-950/60 border border-[#C85A32]/40 text-[#C85A32] dark:text-amber-300'
                        : 'hover:bg-stone-50 dark:hover:bg-stone-800/80 text-stone-700 dark:text-stone-300'
                    )}
                  >
                    <div>
                      <div className='text-xs font-bold font-serif'>
                        {item.native} <span className='text-[11px] font-sans font-normal text-stone-500 dark:text-stone-400'>({item.name})</span>
                      </div>
                      <div className='text-[9.5px] text-stone-400 font-sans'>{item.region}</div>
                    </div>

                    {isSelected && (
                      <div className='w-5 h-5 rounded-full bg-[#C85A32] dark:bg-amber-500 text-white dark:text-stone-950 flex items-center justify-center shrink-0'>
                        <Check className='w-3 h-3' />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
