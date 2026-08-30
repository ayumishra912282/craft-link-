import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { productApi } from '../services/api';

export default function ContactArtisanModal({ product, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    buyer_name: '',
    buyer_email: '',
    buyer_phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await productApi.sendInquiry(product.id, {
        ...formData,
        message: formData.message || ('Interested in ordering "' + product.title + '". Please share details.')
      });
      setSent(true);
    } catch (e) {
      console.error(e);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        {sent ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-serif text-stone-900">Inquiry Transmitted!</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Your message for <strong>{product.title}</strong> has reached <strong>{product.artisan_name}</strong>. The artisan will connect with you via email or phone.
            </p>
            <button
              onClick={() => { setSent(false); onClose(); }}
              className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-terracotta flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-stone-900">Contact Artisan</h3>
                <p className="text-xs text-stone-500">Inquire with {product.artisan_name}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={formData.buyer_name}
                onChange={(e) => setFormData({ ...formData, buyer_name: e.target.value })}
                placeholder="Ananya Sharma"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-terracotta"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Your Email *</label>
                <input
                  type="email"
                  required
                  value={formData.buyer_email}
                  onChange={(e) => setFormData({ ...formData, buyer_email: e.target.value })}
                  placeholder="ananya@example.com"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={formData.buyer_phone}
                  onChange={(e) => setFormData({ ...formData, buyer_phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-terracotta"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Message</label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={'Hi, I would like to inquire about "' + product.title + '". Please let me know the availability.'}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-terracotta"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-terracotta text-white font-semibold text-xs hover:from-amber-700 hover:to-terracotta-dark transition-all flex items-center justify-center gap-2 shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Sending...' : 'Send Inquiry to Artisan'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
