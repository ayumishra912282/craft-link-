import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles, Globe, LogOut, PlusCircle, LayoutDashboard, ShoppingBag, Menu, X } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, isArtisan, logout } = useAuth();
  const { lang, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F5]/90 dark:bg-[#0B0F17]/90 backdrop-blur-md border-b border-stone-200/70 dark:border-stone-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <img
              src="/icon.png"
              alt="CraftLink Logo"
              className="h-10 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-xs"
            />
            <div className="flex flex-col">
              <div className="text-2xl font-black tracking-tight font-serif flex items-center leading-none">
                <span className="text-[#1E4D2B] dark:text-emerald-400">Craft</span>
                <span className="text-[#C85A32] dark:text-amber-400">Link</span>
                <span className="text-amber-500 text-xs ml-0.5 font-sans font-bold">✦</span>
              </div>
              <span className="hidden sm:block text-[8.5px] uppercase tracking-widest text-stone-500 dark:text-stone-400 font-extrabold mt-1">
                AI-POWERED MARKETPLACE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/marketplace"
              className={'px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ' + (
                isActive('/marketplace')
                  ? 'bg-amber-100/90 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 font-semibold'
                  : 'text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-300 hover:bg-stone-100/80 dark:hover:bg-stone-800/60'
              )}
            >
              <span className="flex items-center gap-1.5 font-sans">
                <ShoppingBag className="w-4 h-4 text-terracotta dark:text-amber-400" />
                {t('marketplace')}
              </span>
            </Link>

            {isArtisan && (
              <>
                <Link
                  to="/artisan/dashboard"
                  className={'px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ' + (
                    isActive('/artisan/dashboard')
                      ? 'bg-amber-100/90 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 font-semibold'
                      : 'text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-300 hover:bg-stone-100/80 dark:hover:bg-stone-800/60'
                  )}
                >
                  <span className="flex items-center gap-1.5 font-sans">
                    <LayoutDashboard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    {t('artisanDashboard')}
                  </span>
                </Link>

                <Link
                  to="/artisan/products/new"
                  className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-600 to-terracotta text-white shadow-sm hover:from-amber-700 hover:to-terracotta-dark transition-all hover:shadow-md hover:scale-[1.02]"
                >
                  <PlusCircle className="w-4 h-4 animate-pulse" />
                  <span>{t('createProductWithAI')}</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Tools */}
          <div className="hidden md:flex items-center space-x-3">
            {/* 11 Indian Regional Languages Selector */}
            <LanguageSelector />

            {/* Dark/Light Dual Theme Switch */}
            <ThemeToggle />

            {user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-stone-200 dark:border-stone-800">
                <div className="text-right">
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">{user.name}</div>
                  <div className="text-[10px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full inline-block font-medium border border-amber-200/60 dark:border-amber-800/50">
                    {user.role === 'artisan' ? (lang === 'hi' ? 'कारीगर' : 'Artisan') : (lang === 'hi' ? 'खरीदार' : 'Buyer')}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-stone-500 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                  title={t('logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/otp-login"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/50 transition-colors"
                >
                  OTP Login
                </Link>
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-amber-400 shadow-sm transition-colors"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Action Controls */}
          <div className="flex items-center md:hidden space-x-1.5">
            <LanguageSelector />
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-[#131B2A]/95 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <Link
            to="/marketplace"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-stone-800 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-800"
          >
            {t('marketplace')}
          </Link>
          {isArtisan && (
            <>
              <Link
                to="/artisan/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-stone-800 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-800"
              >
                {t('artisanDashboard')}
              </Link>
              <Link
                to="/artisan/products/new"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-terracotta dark:text-amber-400 bg-amber-50 dark:bg-stone-800"
              >
                {t('createProductWithAI')}
              </Link>
            </>
          )}
          {user ? (
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-stone-900 dark:text-stone-100">{user.name}</div>
                <div className="text-xs text-stone-500 dark:text-stone-400 capitalize">{user.role}</div>
              </div>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 rounded-lg"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <Link
                to="/otp-login"
                onClick={() => setMenuOpen(false)}
                className="block text-center py-2 text-sm font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl"
              >
                Instant OTP Login
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2 text-sm font-medium border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 rounded-xl"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2 text-sm font-semibold bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 rounded-xl"
                >
                  {t('register')}
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
