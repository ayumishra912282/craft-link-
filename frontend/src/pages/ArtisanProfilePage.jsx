import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { artisanApi } from '../services/api';
import { User, MapPin, Hammer, Save, CheckCircle2 } from 'lucide-react';

export default function ArtisanProfilePage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: user?.name || 'Ramesh Kumawat',
    phone: user?.phone || '+91 98290 12345',
    craft_type: user?.craft_type || 'Blue Pottery',
    state: user?.state || 'Rajasthan',
    region: user?.region || 'Jaipur',
    preferred_language: user?.preferred_language || 'en',
    craft_story: user?.craft_story || 'Master artisan with 28 years of experience preserving Jaipur heritage blue pottery craft.'
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await artisanApi.updateProfile(user?.id || 'artisan-ramesh-01', formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900">
          Artisan Profile & Workshop Lineage
        </h1>
        <p className="text-xs text-stone-500">
          Your identity and craft context are preserved across all AI-generated catalogues
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md space-y-5">
        {saved && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile successfully updated!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Artisan Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-terracotta"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Craft Tradition</label>
            <input
              type="text"
              value={formData.craft_type}
              onChange={(e) => setFormData({ ...formData, craft_type: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Village / City</label>
            <input
              type="text"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-terracotta"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Craft Story / Cultural Heritage</label>
          <textarea
            rows={4}
            value={formData.craft_story}
            onChange={(e) => setFormData({ ...formData, craft_story: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs leading-relaxed focus:outline-none focus:border-terracotta"
          />
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-all flex items-center gap-2 shadow"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
