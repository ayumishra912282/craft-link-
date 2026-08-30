import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles, Hammer, ShoppingBag, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [role, setRole] = useState('artisan');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    craft_type: 'Blue Pottery',
    state: 'Rajasthan',
    region: 'Jaipur',
    preferred_language: 'en',
    craft_story: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await register({
        ...formData,
        role
      });
      if (role === 'artisan') {
        navigate('/artisan/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Registration failed. Email may already be in use.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <img
          src="/icon.png"
          alt="CraftLink Emblem"
          className="h-16 w-auto mx-auto object-contain drop-shadow-md"
        />
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900">
          Join <span className="text-[#1E4D2B]">Craft</span><span className="text-[#C85A27]">Link</span>
        </h1>
        <p className="text-xs text-stone-500 font-medium">
          AI-Powered Marketplace • Create your account to sell crafts or discover authentic treasures
        </p>
      </div>

      {/* Role Selector */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-stone-100 rounded-2xl">
        <button
          type="button"
          onClick={() => setRole('artisan')}
          className={'py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ' + (role === 'artisan' ? 'bg-white text-stone-900 shadow-sm border border-stone-200' : 'text-stone-500 hover:text-stone-900')}
        >
          <Hammer className="w-4 h-4 text-terracotta" />
          <span>I am an Artisan</span>
        </button>

        <button
          type="button"
          onClick={() => setRole('buyer')}
          className={'py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ' + (role === 'buyer' ? 'bg-white text-stone-900 shadow-sm border border-stone-200' : 'text-stone-500 hover:text-stone-900')}
        >
          <ShoppingBag className="w-4 h-4 text-indigoCraft" />
          <span>I am a Buyer</span>
        </button>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md space-y-4">
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Full Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={role === 'artisan' ? 'Ramesh Kumawat' : 'Ananya Sharma'}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-terracotta"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Password *</label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#C85A27]"
            />
          </div>
        </div>

        {/* Artisan-specific Onboarding fields */}
        {role === 'artisan' && (
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Artisan Profile & Craft Context
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Primary Craft</label>
                <input
                  type="text"
                  value={formData.craft_type}
                  onChange={(e) => setFormData({ ...formData, craft_type: e.target.value })}
                  placeholder="Blue Pottery"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Village/City</label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="Jaipur"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Rajasthan"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Short Craft Story / Bio</label>
              <textarea
                rows={2}
                value={formData.craft_story}
                onChange={(e) => setFormData({ ...formData, craft_story: e.target.value })}
                placeholder="4th generation master craftsman creating traditional glazed ceramic pottery in Jaipur..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-terracotta text-white text-xs font-bold hover:from-amber-700 hover:to-terracotta-dark transition-all flex items-center justify-center gap-2 shadow"
        >
          <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="pt-2 text-center text-xs text-stone-500">
          Already have an account?{' '}
          <Link to="/login" className="text-terracotta font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </form>
    </div>
  );
}
