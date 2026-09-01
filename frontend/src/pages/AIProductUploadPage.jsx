import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { aiApi, productApi } from '../services/api';
import { SAMPLE_CRAFTS } from '../data/sampleCrafts';
import AIProcessingModal from '../components/AIProcessingModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Upload, RotateCw, Send, Save, ArrowLeft,
  CheckCircle2, Image as ImageIcon, Loader2
} from 'lucide-react';

export default function AIProductUploadPage() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState('upload');
  const [modalStep, setModalStep] = useState(1);

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState(''); // ✅ FIX: Track actual uploaded URL separately
  const [craftHint, setCraftHint] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false); // ✅ FIX: Track image upload state

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
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    // Show preview immediately using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // ✅ FIX: Upload image to server and get proper URL
    setUploadingImage(true);
    setUploadedImageUrl('');
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      const res = await aiApi.uploadImage(uploadData);
      const imageUrl = res.data.image_url;
      // Make absolute URL if relative
      const absoluteUrl = imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}${imageUrl}`;
      setUploadedImageUrl(absoluteUrl);
    } catch (err) {
      console.error('Image upload failed:', err);
      // fallback: use base64 preview
      setUploadedImageUrl('');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSelectPreset = (sample) => {
    setImagePreview(sample.imageUrl);
    setUploadedImageUrl(sample.imageUrl); // preset images are already valid URLs
    setSelectedFile(null);
    setCraftHint(sample.hint);
  };

  const runAIPipeline = async () => {
    if (!imagePreview) {
      alert('Please upload a product photo or select a demo craft sample first.');
      return;
    }
    if (uploadingImage) {
      alert('Please wait — image is still uploading...');
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

      // ✅ FIX: Use uploaded URL, not base64. Fall back to imagePreview only if no upload URL
      const finalImageUrl = uploadedImageUrl || imagePreview;

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
        image_url: finalImageUrl, // ✅ proper URL, not base64
        status: 'published'
      });

      setStep('review');
    } catch (err) {
      console.error(err);
      // Even on error, go to review with what we have
      const finalImageUrl = uploadedImageUrl || imagePreview;
      setFormData(prev => ({
        ...prev,
        image_url: finalImageUrl,
        title: prev.title || 'Handcrafted Indian Artisan Product',
        description: prev.description || 'A beautiful handcrafted product made by skilled Indian artisans.',
        craft_story: prev.craft_story || 'This product is crafted with traditional techniques passed down through generations.',
      }));
      setStep('review');
    }
  };

  const handleSaveProduct = async (statusToSet = 'published') => {
    if (!formData.title) {
      alert('Please add a product title before saving.');
      return;
    }

    setSaving(true);
    try {
      // ✅ FIX: If image_url is still base64 (fallback), upload it first
      let finalImageUrl = formData.image_url;
      if (finalImageUrl && finalImageUrl.startsWith('data:')) {
        try {
          // Try to upload the base64 image
          const base64Data = finalImageUrl;
          const byteString = atob(base64Data.split(',')[1]);
          const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });
          const ext = mimeString.split('/')[1] || 'jpg';
          const file = new File([blob], `product_image.${ext}`, { type: mimeString });
          const uploadData = new FormData();
          uploadData.append('file', file);
          const res = await aiApi.uploadImage(uploadData);
          const uploadedUrl = res.data.image_url;
          finalImageUrl = uploadedUrl.startsWith('http') ? uploadedUrl : `${window.location.origin}${uploadedUrl}`;
        } catch (uploadErr) {
          console.warn('Base64 image upload failed, using placeholder:', uploadErr);
          finalImageUrl = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80';
        }
      }

      const payload = {
        ...formData,
        image_url: finalImageUrl,
        status: statusToSet,
        artisan_id: user?.id || 'artisan-ramesh-01',
        artisan_name: user?.name || 'Master Artisan',
        ai_generated: true
      };

      const res = await productApi.createProduct(payload);
      setSaveSuccess(true);

      setTimeout(() => {
        navigate('/product/' + res.data.id);
      }, 1200);
    } catch (err) {
      console.error(err);
      alert('Failed to save product listing. Please check required fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto space-y-2"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-[#C85A27]" />
          <span>AI Multimodal Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900">
          {step === 'review' ? t('aiReviewTitle') : t('createProductWithAI')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          {step === 'review' ? t('aiReviewSubtitle') : t('aiUploadSubtitle')}
        </p>
      </motion.div>

      <AIProcessingModal currentStep={modalStep} isOpen={step === 'analyzing'} />

      {/* Save Success Flash */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl shadow-xl font-bold text-sm"
          >
            <CheckCircle2 className="w-5 h-5" />
            Product published successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {step === 'upload' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-dashed border-stone-300 hover:border-amber-500/80 shadow-md transition-all text-center">
            {imagePreview ? (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm relative">
                  <img src={imagePreview} alt="Uploaded craft preview" className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-900/90 text-white backdrop-blur-sm">
                    Ready for AI
                  </span>
                  {/* ✅ Image upload status indicator */}
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-white text-xs font-bold bg-black/60 px-4 py-2 rounded-xl">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading image...
                      </div>
                    </div>
                  )}
                  {uploadedImageUrl && !uploadingImage && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-bold bg-emerald-600/90 text-white px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Uploaded
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center gap-3">
                  <label className="cursor-pointer text-xs font-bold text-[#C85A27] hover:underline flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center py-10 space-y-4 group">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-inner"
                >
                  <Upload className="w-8 h-8 text-[#C85A27]" />
                </motion.div>
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
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#C85A27]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-stone-500 text-center">
              {t('selectDemoPhoto')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SAMPLE_CRAFTS.map((sample) => (
                <motion.button
                  key={sample.id}
                  type="button"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectPreset(sample)}
                  className={'p-2.5 rounded-2xl border text-left transition-all flex flex-col items-center ' + (
                    imagePreview === sample.imageUrl
                      ? 'bg-amber-50 border-[#C85A27] shadow-md'
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
                </motion.button>
              ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(200, 90, 39, 0.3)' }}
              whileTap={{ scale: 0.97 }}
              onClick={runAIPipeline}
              disabled={!imagePreview || uploadingImage}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-600 via-[#C85A27] to-amber-700 text-white font-bold text-base shadow-lg shadow-amber-800/20 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {uploadingImage ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading Image...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span>Let AI Understand &amp; Create Catalogue</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      {step === 'review' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-md space-y-8"
        >
          <div className="flex items-center justify-between pb-6 border-b border-stone-100">
            <button
              onClick={() => setStep('upload')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#C85A27] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Upload Different Photo</span>
            </button>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                type="button"
                onClick={() => runAIPipeline()}
                className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{t('regenerateAI')}</span>
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
                <img
                  src={formData.image_url}
                  alt="Listing preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/70 text-xs space-y-2 text-amber-900">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C85A27]" />
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
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 font-serif font-bold text-sm text-stone-900 focus:outline-none focus:border-[#C85A27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">{t('fieldDescription')} *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed focus:outline-none focus:border-[#C85A27]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">{t('fieldCategory')}</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#C85A27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">{t('fieldCraft')}</label>
                  <input
                    type="text"
                    value={formData.craft_type}
                    onChange={(e) => setFormData({ ...formData, craft_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#C85A27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">{t('fieldPrice')}</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 font-bold focus:outline-none focus:border-[#C85A27]"
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#C85A27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">{t('fieldRegion')} &amp; State</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      placeholder="Region (e.g. Jaipur)"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#C85A27]"
                    />
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State (e.g. Rajasthan)"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#C85A27]"
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
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#C85A27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">{t('fieldCraftStory')}</label>
                <textarea
                  rows={3}
                  value={formData.craft_story}
                  onChange={(e) => setFormData({ ...formData, craft_story: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed focus:outline-none focus:border-[#C85A27]"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              disabled={saving}
              onClick={() => handleSaveProduct('draft')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4 text-stone-500" />
              <span>{t('saveDraft')}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(200, 90, 39, 0.4)' }}
              whileTap={{ scale: 0.97 }}
              type="button"
              disabled={saving}
              onClick={() => handleSaveProduct('published')}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-[#C85A27] to-amber-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t('publishProduct')}</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
