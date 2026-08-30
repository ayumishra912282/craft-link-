import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, UserCheck, ShoppingCart, RefreshCw } from 'lucide-react';
import { metaApi } from '../services/api';

export default function DemoBanner() {
  const { user, demoLogin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSwitchRole = async (role) => {
    await demoLogin(role);
    if (role === 'artisan') {
      navigate('/artisan/dashboard');
    } else {
      navigate('/marketplace');
    }
  };

  const handleResetData = async () => {
    try {
      await metaApi.resetDemoData();
      alert('Demo data successfully refreshed with authentic Indian crafts!');
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-gradient-to-r from-stone-900 via-indigoCraft to-stone-900 text-stone-200 text-xs py-2 px-4 shadow-inner border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> SIH 2026 Live Demo Mode
          </span>
          <span className="hidden sm:inline text-stone-300">
            Active Persona: <strong className="text-white">{user?.name || 'Guest'} ({user?.role || 'Guest'})</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-400 hidden md:inline">Quick Switch:</span>
          <button
            onClick={() => handleSwitchRole('artisan')}
            className={'px-2.5 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ' + (
              user?.role === 'artisan'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
            )}
          >
            <UserCheck className="w-3 h-3" />
            Artisan Mode
          </button>

          <button
            onClick={() => handleSwitchRole('buyer')}
            className={'px-2.5 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ' + (
              user?.role === 'buyer'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
            )}
          >
            <ShoppingCart className="w-3 h-3" />
            Buyer Mode
          </button>

          <button
            onClick={handleResetData}
            className="px-2 py-1 rounded text-[11px] bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-all flex items-center gap-1"
            title="Reset database to default seed state"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
}
