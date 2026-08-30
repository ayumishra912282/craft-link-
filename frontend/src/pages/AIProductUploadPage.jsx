import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { aiApi, productApi } from '../services/api';
import { SAMPLE_CRAFTS } from '../data/sampleCrafts';
import AIProcessingModal from '../components/AIProcessingModal';
import {
  Sparkles, Upload, RotateCw, Send, Save, ArrowLeft
} from 'lucide-react';

export default function AIProductUploadPage() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState('upload');
  const [modalStep, setModalStep] = useState(1);

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [craftHint, setCraftHint] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    title_hindi: '',
    description: '',
    description_hindi: '',
    short_description: '',
    category: 'Home Decor',
    craft_type: 'Blue Pottery',
    material: '',
    colors: [],
    region: 'Jaipur',
    state: 'Rajasthan',
    price: 1850,
    tags: [],
    buyer_segments: [],
    craft_story: '',
    image_url: '',
    status: 'published'
  });

  const [saving, setSaving] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (sample) => {
    setImagePreview(sample.imageUrl);
    setSelectedFile(null);
    setCraftHint(sample.hint);
  };

  const runAIPipeline = async () => {
    if (!imagePreview) {
      alert('Please upload a product photo or select a demo craft sample first.');
      return;
    }

    setStep('analyzing');
    setModalStep(1);

    try {
      await new Promise(r => setTimeout(r, 600));
      setModalStep(2);

      let analysisRes;
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        if (craftHint) uploadData.append('craft_hint', craftHint);
        analysisRes = await aiApi.analyzeProduct(uploadData);
      } else {
        const uploadData = new FormData();
        uploadData.append('image_base64', imagePreview);
        if (craftHint) uploadData.append('craft_hint', craftHint);
        analysisRes = await aiApi.analyzeProduct(uploadData);
      }

      const attributes = analysisRes.data;
      setModalStep(3);

      const catalogRes = await aiApi.generateCatalog({
        product_type: attributes.product_type,
        craft: attributes.craft,
        material: attributes.material,
        colors: attributes.colors,
        region: attributes.region,
        state: attributes.state,
        category: attributes.category,
        keywords: attributes.keywords,
        artisan_name: user?.name || 'Master Artisan',
        craft_notes: craftHint,
        suggested_price: 1850,
        language: lang
      });

      const catalog = catalogRes.data;
      setModalStep(4);
      await new Promise(r => setTimeout(r, 600));

      setFormData({
        title: catalog.title,
        title_hindi: catalog.title_hindi || '',
        description: catalog.description,
        description_hindi: catalog.description_hindi || '',
        short_description: catalog.short_description,
        category: catalog.category,
        craft_type: catalog.craft_type,
        material: catalog.material,
        colors: catalog.colors || [],
        region: catalog.region,
        state: catalog.state,
        price: catalog.suggested_price || 1850,
        tags: catalog.tags || [],
        buyer_segments: catalog.buyer_segments || [],
        craft_story: catalog.craft_story,
        image_url: imagePreview,
        status: 'published'
      });

      setStep('review');
    } catch (err) {
      console.error(err);
      alert('AI analysis encountered an issue. Using deterministic craft fallback.');
      setStep('review');
    }
  };

  const handleSaveProduct = async (statusToSet = 'published') => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        status: statusToSet,
        artisan_id: user?.id || 'artisan-ramesh-01',
        artisan_name: user?.name || 'Master Artisan',
        ai_generated: true
      };

      const res = await productApi.createProduct(payload);
      alert(statusToSet === 'published' ? '?? Product published live to marketplace!' : 'Draft saved in your studio!');
      navigate('/product/' + res.data.id);
    } catch (err) {
      console.error(err);
      alert('Failed to save product listing. Please check required fields.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-terracotta" />
          <span>AI Multimodal Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900">
          {step === 'review' ? t('aiReviewTitle') : t('createProductWithAI')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          {step === 'review' ? t('aiReviewSubtitle') : t('aiUploadSubtitle')}
        </p>
      </div>

      <AIProcessingModal currentStep={modalStep} isOpen={step === 'analyzing'} />

      {step === 'upload' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-dashed border-stone-300 hover:border-amber-500/80 shadow-md transition-all text-center">
            {imagePreview ? (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm relative">
                  <img src={imagePreview} alt="Uploaded craft preview" className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-900/90 text-white backdrop-blur-sm">
                    Ready for AI
                  </span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <label className="cursor-pointer text-xs font-bold text-terracotta hover:underline">
                    <span>Change Photo</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                  <Upload className="w-8 h-8 text-terracotta" />
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-bold text-stone-800 block">
                    {t('dropImageHere')}
                  </span>
                  <span className="text-xs text-stone-400 block">
                    PNG, JPG, WEBP or camera snapshot up to 10MB
                  </span>
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            )}

            <div className="mt-6 pt-6 border-t border-stone-100 max-w-lg mx-auto text-left">
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Optional Artisan Note / Audio Context:
              </label>
              <input
                type="text"
                value={craftHint}
                onChange={(e) => setCraftHint(e.target.value)}
                placeholder="e.g., 'Handmade blue pottery vase from Kot Jewar village near Jaipur'"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-terracotta"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-stone-500 text-center">
              {t('selectDemoPhoto')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SAMPLE_CRAFTS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectPreset(sample)}
                  className={'p-2.5 rounded-2xl border text-left transition-all flex flex-col items-center ' + (
                    imagePreview === sample.imageUrl
                      ? 'bg-amber-50 border-terracotta shadow-md scale-102'
                      : 'bg-white border-stone-200 hover:border-amber-300'
                  )}
                >
                  <img
                    src={sample.imageUrl}
                    alt={sample.name}
                    className="w-full h-24 object-cover rounded-xl mb-2"
                  />
                  <span className="font-bold text-xs text-stone-900 text-center line-clamp-1">
                    {sample.name}
                  </span>
                  <span className="text-[10px] text-stone-500 text-center">
                    {sample.region}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={runAIPipeline}
              disabled={!imagePreview}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-600 via-terracotta to-amber-700 text-white font-bold text-base shadow-lg shadow-amber-800/20 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>Let AI Understand & Create Catalogue</span>
            </button>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-md space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between pb-6 border-b border-stone-100">
            <button
              onClick={() => setStep('upload')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-terracotta"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Upload Different Photo</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => runAIPipeline()}
                className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{t('regenerateAI')}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
                <img src={formData.image_url} alt="Listing preview" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/70 text-xs space-y-2 text-amber-900">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-terracotta" />
                  <span>AI Copilot Detected Attributes</span>
                </div>
                <div className="text-[11px] text-amber-800">
                  Every field on the right is completely editable so you retain 100% control over your craft presentation.
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">{t('fieldTitle')} *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 font-serif font-bold text-sm text-stone-900 focus:outline-none focus:border-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">{t('fieldDescription')} *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">{t('fieldCategory')}</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-terracotta"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">{t('fieldCraft')}</label>
                  <input
                    type="text"
                    value={formData.craft_type}
                    onChange={(e) => setFormData({ ...formData, craft_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-terracotta"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">{t('fieldPrice')}</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 font-bold focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">{t('fieldMaterial')}</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-terracotta"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">{t('fieldRegion')} & State</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      placeholder="Region (e.g. Jaipur)"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-terracotta"
                    />
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State (e.g. Rajasthan)"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-terracotta"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">{t('fieldBuyerSegments')}</label>
                <input
                  type="text"
                  value={formData.buyer_segments.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    buyer_segments: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="Home Decor Buyers, Boutique Stores, Gift Shoppers"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">{t('fieldCraftStory')}</label>
                <textarea
                  rows={3}
                  value={formData.craft_story}
                  onChange={(e) => setFormData({ ...formData, craft_story: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed focus:outline-none focus:border-terracotta"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveProduct('draft')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4 text-stone-500" />
              <span>{t('saveDraft')}</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveProduct('published')}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-terracotta to-amber-700 text-white text-xs font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 shadow"
            >
              <Send className="w-4 h-4" />
              <span>{saving ? 'Publishing...' : t('publishProduct')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
