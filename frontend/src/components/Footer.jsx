import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Award, ShieldCheck, Globe, Users, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 dark:bg-[#070B08] text-stone-300 pt-16 pb-10 border-t border-stone-800 dark:border-stone-800/80 mt-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800 dark:border-stone-800/80">
          {/* Brand & Identity */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2.5">
              <img
                src="/icon.png"
                alt="CraftLink Logo"
                className="h-10 w-auto object-contain bg-white/95 p-1 rounded-xl shadow-xs"
              />
              <div className="flex flex-col">
                <div className="text-xl font-extrabold font-serif flex items-center leading-none">
                  <span className="text-emerald-400">Craft</span>
                  <span className="text-amber-400">Link</span>
                  <span className="text-amber-400 text-xs ml-0.5 font-bold font-sans">✦</span>
                </div>
                <span className="text-[8px] uppercase tracking-widest text-stone-400 font-extrabold mt-1">
                  AI-POWERED MARKETPLACE
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Bridging India's heritage craft ecosystems to global markets using multimodal AI vision, cultural storytelling, and direct market linkage.
            </p>
            <div className="text-xs text-emerald-400 font-medium space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-500">🍃</span>
                <span>Empowering Artisans</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400">✦</span>
                <span>Intelligent Discovery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sky-400">🌐</span>
                <span>Stronger Connections</span>
              </div>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-sans">Platform Gateway</h4>
            <ul className="space-y-2.5 text-xs text-stone-400 font-sans">
              <li>
                <Link to="/marketplace" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>Explore Marketplace</span>
                  <ArrowUpRight className="w-3 h-3 text-stone-500" />
                </Link>
              </li>
              <li>
                <Link to="/artisan/products/new" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>AI Catalogue Copilot</span>
                  <ArrowUpRight className="w-3 h-3 text-stone-500" />
                </Link>
              </li>
              <li>
                <Link to="/artisan/dashboard" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>Artisan Studio Dashboard</span>
                  <ArrowUpRight className="w-3 h-3 text-stone-500" />
                </Link>
              </li>
              <li>
                <Link to="/otp-login" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>Instant Mobile OTP Login</span>
                  <ArrowUpRight className="w-3 h-3 text-stone-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Heritage Clusters */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-sans">Heritage Craft Forms</h4>
            <ul className="space-y-2 text-xs text-stone-400 font-sans">
              <li>Jaipur Blue Pottery (Rajasthan)</li>
              <li>Kashmiri Pashmina & Sozni (J&K)</li>
              <li>Bastar Dhokra Lost-Wax (Chhattisgarh)</li>
              <li>Kutch Rogan Silk Art (Gujarat)</li>
              <li>Banarasi Handloom Zari (Uttar Pradesh)</li>
              <li>Channapatna Lacquer Wood (Karnataka)</li>
            </ul>
          </div>

          {/* Platform Help & Contact */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-sans">CraftLink Help & Support</h4>
            <ul className="space-y-2.5 text-xs text-stone-400 font-sans">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✉️</span>
                <span>Mail: <a href="mailto:support@craftlink.in" className="hover:text-amber-400 font-semibold text-stone-300">support@craftlink.in</a></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400">🆘</span>
                <span>Help Desk: <a href="mailto:help@craftlink.in" className="hover:text-amber-400 font-semibold text-stone-300">help@craftlink.in</a></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sky-400">📞</span>
                <span>Toll-Free: <a href="tel:18002026026" className="hover:text-amber-400 font-semibold text-stone-300 font-mono">+91 1800-202-6026</a></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">💬</span>
                <span>WhatsApp: <span className="text-stone-300 font-mono font-semibold">+91 98765 43210</span></span>
              </li>
              <li className="pt-2 text-[11px] text-stone-500">
                Mon - Sat: 9:00 AM - 7:00 PM IST
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 font-sans">
          <p>© 2026 CraftLink — AI-Powered Marketplace for Indian Artisans.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1.5 text-stone-400">
            <span>Honoring India's Master Karigars</span>
            <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
