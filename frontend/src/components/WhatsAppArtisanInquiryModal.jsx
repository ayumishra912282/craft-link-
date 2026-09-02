import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Check, Send, Sparkles, PhoneCall, ShieldCheck } from 'lucide-react';

export default function WhatsAppArtisanInquiryModal({ isOpen, onClose, product }) {
  const [buyerName, setBuyerName] = useState('Ananya Sharma');
  const [pincode, setPincode] = useState('110001');
  const [inquiryLanguage, setInquiryLanguage] = useState('hi'); // 'hi' or 'en'
  const [customNote, setCustomNote] = useState('');

  if (!isOpen) return null;

  const artisanName = product?.artisan_name || 'Master Artisan';
  const craftTitle = product?.title || 'Authentic Handcrafted Piece';
  const productPrice = product?.price ? `₹${Number(product.price).toLocaleString('en-IN')}` : 'Direct Valuation';

  // Construct customized multilingual WhatsApp message
  const generatedMessageHindi = `नमस्ते ${artisanName} जी! 🙏\n\nमैंने CraftLink पर आपका उत्पाद देखा है:\n📦 *${craftTitle}* (${productPrice})\n📍 डिलीवरी पिनकोड: ${pincode}\n\n${customNote ? `प्रश्न / कस्टमाइजेशन: ${customNote}\n\n` : ''}कृपया मुझे इस उत्पाद की उपलब्धता और डिलीवरी समय के बारे में जानकारी दें। धन्यवाद!\n— ${buyerName}`;

  const generatedMessageEnglish = `Hello ${artisanName} ji! 🙏\n\nI discovered your authentic craft on CraftLink:\n📦 *${craftTitle}* (${productPrice})\n📍 Delivery Pincode: ${pincode}\n\n${customNote ? `Notes/Customization: ${customNote}\n\n` : ''}Could you please share details regarding piece availability and dispatch timeline? Thank you!\n— ${buyerName}`;

  const finalMessage = inquiryLanguage === 'hi' ? generatedMessageHindi : generatedMessageEnglish;
  const whatsappUrl = `https://wa.me/919829012345?text=${encodeURIComponent(finalMessage)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="bg-white dark:bg-[#131B2A] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-5 text-stone-900 dark:text-stone-100 relative"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Direct Artisan Trade Linkage</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-luxury font-bold">
                Connect Directly with {artisanName.split(' ')[0]}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                Zero middleman commissions. Connect via WhatsApp in your preferred regional language.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Controls */}
          <div className="space-y-3.5 text-xs font-sans">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Your Name</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#0B0F17] text-stone-900 dark:text-stone-100 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Delivery Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#0B0F17] text-stone-900 dark:text-stone-100 font-semibold font-mono"
                />
              </div>
            </div>

            {/* Language Selector */}
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Inquiry Language Template:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInquiryLanguage('hi')}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    inquiryLanguage === 'hi'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-transparent'
                  }`}
                >
                  हिन्दी (Hindi Template)
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryLanguage('en')}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    inquiryLanguage === 'en'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-transparent'
                  }`}
                >
                  English Template
                </button>
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Custom Request / Color preference (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Can this be customized in Turquoise Green or gift packed?"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#0B0F17] text-stone-900 dark:text-stone-100"
              />
            </div>

            {/* Preview Box */}
            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/50 text-[11px] font-mono text-emerald-900 dark:text-emerald-200 whitespace-pre-line leading-relaxed">
              {finalMessage}
            </div>
          </div>

          {/* Action */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/30 transition-all font-sans"
          >
            <Send className="w-4 h-4" />
            <span>Open in WhatsApp & Chat with Karigar</span>
          </a>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
