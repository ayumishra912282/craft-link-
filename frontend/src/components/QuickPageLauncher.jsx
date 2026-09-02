import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Home, ShoppingBag, Sparkles, LayoutDashboard,
  User, Lock, Smartphone, UserPlus, X, ArrowRight, ExternalLink
} from 'lucide-react';

export default function QuickPageLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const pages = [
    {
      title: 'Home & Hero Showcase',
      path: '/',
      icon: Home,
      badge: 'Start',
      badgeColor: 'bg-stone-100 text-stone-700',
      description: 'Vision, 4-step magic flow, impact numbers'
    },
    {
      title: 'Craft Marketplace',
      path: '/marketplace',
      icon: ShoppingBag,
      badge: 'Live',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: 'Semantic vector search, craft filters, regional catalogue'
    },
    {
      title: 'Product Story Showcase',
      path: '/product/prod-blue-pottery-vase-01',
      icon: ExternalLink,
      badge: 'GI Tag',
      badgeColor: 'bg-amber-100 text-amber-800',
      description: 'Cultural provenance, AI recommendations, artisan inquiries'
    },
    {
      title: 'AI Catalogue Copilot',
      path: '/artisan/products/new',
      icon: Sparkles,
      badge: 'Multimodal AI',
      badgeColor: 'bg-purple-100 text-purple-800',
      description: 'Zero-typing photo upload & 4-stage AI catalogue generation'
    },
    {
      title: 'Artisan Studio Dashboard',
      path: '/artisan/dashboard',
      icon: LayoutDashboard,
      badge: 'Artisan',
      badgeColor: 'bg-amber-100 text-amber-900',
      description: 'Real-time catalogue stats, views, buyer segment matches'
    },
    {
      title: 'Artisan Heritage Profile',
      path: '/artisan/profile',
      icon: User,
      badge: 'Master Karigar',
      badgeColor: 'bg-orange-100 text-orange-900',
      description: 'Lineage story, GI accreditation, craft experience'
    },
    {
      title: 'Password Sign-In',
      path: '/login',
      icon: Lock,
      badge: 'PBKDF2 + JWT',
      badgeColor: 'bg-blue-100 text-blue-800',
      description: 'Pre-filled demo credentials, password reveal toggle'
    },
    {
      title: 'Instant Mobile OTP Login',
      path: '/otp-login',
      icon: Smartphone,
      badge: '6-Digit OTP',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: 'Auto-advancing 6-box input, countdown timer, celebration'
    },
    {
      title: 'Artisan & Buyer Registration',
      path: '/register',
      icon: UserPlus,
      badge: 'Onboarding',
      badgeColor: 'bg-stone-100 text-stone-700',
      description: 'Regional language preference, craft specialization'
    }
  ];

  return (
    <>
      {/* Floating Launcher Trigger Pill (Bottom Left) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="fixed bottom-6 left-6 z-40"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900/95 hover:bg-black text-white shadow-2xl border border-stone-700 backdrop-blur-md transition-all hover:scale-105"
          title="Direct Page Navigator — Jump directly to any page"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-[#C85A27] flex items-center justify-center p-0.5">
            <Compass className="w-3.5 h-3.5 text-stone-950 animate-spin-slow" />
          </div>
          <span className="text-xs font-bold font-serif tracking-wide hidden sm:inline">
            Direct Page Navigator
          </span>
          <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1.5 py-0.2 rounded-full font-mono font-bold">
            9 Pages
          </span>
        </button>
      </motion.div>

      {/* Modal Quick-Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 max-h-[88vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1E4D2B] to-[#C85A27] flex items-center justify-center text-white shadow-md">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-serif text-stone-900">
                      CraftLink Direct Page Navigator
                    </h2>
                    <p className="text-xs text-stone-500">
                      Instantly jump to any page or workflow in the application
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Pages Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pages.map((p) => {
                  const Icon = p.icon;
                  const isCurrent = location.pathname === p.path;
                  return (
                    <Link
                      key={p.path}
                      to={p.path}
                      onClick={() => setIsOpen(false)}
                      className={'p-3.5 rounded-2xl border transition-all flex flex-col justify-between group ' + (
                        isCurrent
                          ? 'bg-amber-50/80 border-[#C85A27] shadow-sm'
                          : 'bg-stone-50/70 hover:bg-white border-stone-200 hover:border-amber-300 hover:shadow-md'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={'w-8 h-8 rounded-xl flex items-center justify-center transition-colors ' + (
                            isCurrent
                              ? 'bg-[#C85A27] text-white'
                              : 'bg-white text-stone-700 group-hover:bg-[#1E4D2B] group-hover:text-white shadow-xs'
                          )}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-900 group-hover:text-[#C85A27] transition-colors">
                              {p.title}
                            </div>
                            <div className="text-[10px] text-stone-400 font-mono">{p.path}</div>
                          </div>
                        </div>

                        <span className={'text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ' + p.badgeColor}>
                          {p.badge}
                        </span>
                      </div>

                      <p className="text-[11px] text-stone-500 mt-2 line-clamp-1">
                        {p.description}
                      </p>
                    </Link>
                  );
                })}
              </div>

              {/* Footer Helper Note */}
              <div className="pt-2 flex items-center justify-between text-xs text-stone-400 border-t border-stone-100">
                <span>Tip: You can access this navigator from anywhere in the app</span>
                <span className="font-bold text-[#C85A27]">Smart India Hackathon 2026</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
