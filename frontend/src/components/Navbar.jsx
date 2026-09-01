import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Globe, LogOut, PlusCircle, LayoutDashboard, ShoppingBag, Menu, X, User } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, isArtisan, logout } = useAuth();
  const { lang, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Detect scroll for navbar shadow enhancement
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-xl shadow-lg shadow-stone-900/5 dark:shadow-black/20 border-b border-stone-200/50 dark:border-stone-800/50'
          : 'bg-[#FAF7F5]/90 dark:bg-[#0B0F17]/90 backdrop-blur-md border-b border-stone-200/70 dark:border-stone-800/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <motion.img
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              src="/icon.png"
              alt="CraftLink Logo"
              className="h-10 sm:h-11 w-auto object-contain drop-shadow-sm"
            />
            <div className="flex flex-col">
              <div className="text-2xl font-black tracking-tight font-serif flex items-center leading-none">
                <span className="text-[#1E4D2B] dark:text-emerald-400 group-hover:text-[#C85A27] transition-colors duration-300">Craft</span>
                <span className="text-[#C85A32] dark:text-amber-400">Link</span>
                <motion.span
                  animate={{ rotate: [0, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-amber-500 text-xs ml-0.5 font-sans font-bold"
                >✦</motion.span>
              </div>
              <span className="hidden sm:block text-[8.5px] uppercase tracking-widest text-stone-500 dark:text-stone-400 font-extrabold mt-1">
                AI-POWERED MARKETPLACE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {[
              { to: '/marketplace', label: t('marketplace'), icon: ShoppingBag },
            ].map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={'relative px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ' + (
                  isActive(to)
                    ? 'bg-amber-100/90 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 font-semibold'
                    : 'text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-300 hover:bg-stone-100/80 dark:hover:bg-stone-800/60'
                )}
              >
                <span className="flex items-center gap-1.5 font-sans">
                  <Icon className="w-4 h-4 text-[#C85A27] dark:text-amber-400" />
                  {label}
                </span>
                {isActive(to) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-xl bg-amber-100/90 dark:bg-amber-500/20 -z-10"
                  />
                )}
              </Link>
            ))}

            {isArtisan && (
              <>
                <Link
                  to="/artisan/dashboard"
                  className={'relative px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ' + (
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

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/artisan/products/new"
                    className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-600 to-[#C85A27] text-white shadow-sm hover:shadow-md transition-shadow pulse-ring"
                  >
                    <PlusCircle className="w-4 h-4 animate-pulse" />
                    <span>AI Upload</span>
                  </Link>
                </motion.div>
              </>
            )}
          </nav>

          {/* Right Action Tools */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageSelector />
            <ThemeToggle />

            {user ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3 pl-2 border-l border-stone-200 dark:border-stone-800"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-[#C85A27] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100">{user.name}</div>
                    <div className="text-[10px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full inline-block font-medium border border-amber-200/60 dark:border-amber-800/50">
                      {user.role === 'artisan' ? '🎨 Artisan' : '🛍 Buyer'}
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={logout}
                  className="p-2 text-stone-500 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                  title={t('logout')}
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-amber-400 shadow-sm transition-colors"
                  >
                    {t('register')}
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Mobile Action Controls */}
          <div className="flex items-center md:hidden space-x-1.5">
            <LanguageSelector />
            <ThemeToggle />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white/98 dark:bg-[#131B2A]/98 px-4 pt-2 pb-6 space-y-2 shadow-xl overflow-hidden backdrop-blur-xl"
          >
            {[
              { to: '/marketplace', label: t('marketplace'), icon: '🛍' },
              ...(isArtisan ? [
                { to: '/artisan/dashboard', label: t('artisanDashboard'), icon: '📊' },
                { to: '/artisan/products/new', label: t('createProductWithAI'), icon: '✨' },
              ] : [])
            ].map(({ to, label, icon }, i) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-stone-800 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors"
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </Link>
              </motion.div>
            ))}

            {user ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-[#C85A27] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-stone-900 dark:text-stone-100">{user.name}</div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 capitalize">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 rounded-lg"
                >
                  {t('logout')}
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2"
              >
                <Link
                  to="/otp-login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center py-2.5 text-sm font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl"
                >
                  ⚡ Instant OTP Login
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
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
