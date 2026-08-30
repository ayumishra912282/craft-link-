import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Sparkles, UserCheck, ShoppingCart, Lock, Mail, ArrowRight,
  Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck, Key,
  Smartphone
} from 'lucide-react';
import LiquidGlassCard from '../components/LiquidGlassCard';

export default function LoginPage() {
  const { login, demoLogin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [authMethod, setAuthMethod] = useState('password'); // 'password' or 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const redirectPath = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await login(email.trim(), password);
      setSuccessMsg('Authentication successful! Redirecting...');
      setTimeout(() => {
        if (redirectPath) {
          navigate(redirectPath);
        } else if (res.user.role === 'artisan') {
          navigate('/artisan/dashboard');
        } else {
          navigate('/marketplace');
        }
      }, 500);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Authentication failed. Please verify your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePreFill = (role) => {
    if (role === 'artisan') {
      setEmail('artisan@craftlink.in');
      setPassword('artisan123');
    } else {
      setEmail('buyer@craftlink.in');
      setPassword('buyer123');
    }
    setError('');
  };

  const handleInstantDemo = async (role) => {
    setLoading(true);
    setError('');
    try {
      await demoLogin(role);
      if (role === 'artisan') {
        navigate('/artisan/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      console.error(err);
      setError('Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating Animated Gradient Craft Background Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-1/4 w-72 h-72 bg-amber-200/35 rounded-full blur-3xl pointer-events-none -z-10"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
          y: [0, 25, 0],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#C85A27]/15 rounded-full blur-3xl pointer-events-none -z-10"
      />

      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <motion.img
            initial={{ scale: 0.8, rotate: -6 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            src="/icon.png"
            alt="CraftLink Emblem"
            className="h-16 w-auto mx-auto object-contain drop-shadow-md"
          />
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900">
            Welcome to <span className="text-[#1E4D2B]">Craft</span><span className="text-[#C85A27]">Link</span>
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            AI-Powered Marketplace • Empowering Artisans & Intelligent Discovery
          </p>
        </div>

        {/* SIH Evaluator Demo Helper Box */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl border border-amber-200/80 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between text-amber-900">
            <div className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#C85A27]" />
              <span>Hackathon Quick-Access Credentials</span>
            </div>
            <span className="text-[10px] bg-amber-200/70 text-amber-950 font-bold px-2 py-0.5 rounded-full">
              SIH 2026
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handlePreFill('artisan')}
              className="p-2.5 bg-white hover:bg-amber-100/60 rounded-xl border border-stone-200 text-left transition-all group shadow-xs"
              title="Click to populate form with Artisan credentials"
            >
              <div className="font-bold text-stone-900 group-hover:text-amber-800 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-[#C85A27]" />
                <span>Artisan Login</span>
              </div>
              <div className="text-[10px] text-stone-500 font-mono mt-0.5">artisan@craftlink.in</div>
              <div className="text-[10px] text-stone-400 font-mono">Pass: artisan123</div>
            </button>

            <button
              type="button"
              onClick={() => handlePreFill('buyer')}
              className="p-2.5 bg-white hover:bg-amber-100/60 rounded-xl border border-stone-200 text-left transition-all group shadow-xs"
              title="Click to populate form with Buyer credentials"
            >
              <div className="font-bold text-stone-900 group-hover:text-indigoCraft flex items-center gap-1">
                <ShoppingCart className="w-3.5 h-3.5 text-indigoCraft" />
                <span>Buyer Login</span>
              </div>
              <div className="text-[10px] text-stone-500 font-mono mt-0.5">buyer@craftlink.in</div>
              <div className="text-[10px] text-stone-400 font-mono">Pass: buyer123</div>
            </button>
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] text-stone-500 border-t border-amber-200/60">
            <span>Or 1-click instant access:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleInstantDemo('artisan')}
                className="font-bold text-[#C85A27] hover:underline flex items-center gap-0.5"
              >
                <span>Artisan Demo</span>
                <span>→</span>
              </button>
              <span className="text-stone-300 dark:text-stone-700">•</span>
              <button
                type="button"
                onClick={() => handleInstantDemo('buyer')}
                className="font-bold text-indigo-600 dark:text-amber-400 hover:underline flex items-center gap-0.5"
              >
                <span>Buyer Demo</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Animated Auth Method Selector */}
        <div className="p-1 bg-stone-100 rounded-2xl grid grid-cols-2 gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMethod('password')}
            className={'py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ' + (
              authMethod === 'password'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            )}
          >
            <Lock className="w-3.5 h-3.5 text-[#C85A27]" />
            <span>Password Login</span>
          </button>

          <Link
            to="/otp-login"
            className="py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-stone-600 hover:text-stone-900 hover:bg-white/60"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
            <span>One-Time OTP Login</span>
          </Link>
        </div>

        {/* Main Liquid Glass Authentication Form */}
        <LiquidGlassCard enableCornerMorph={true} enableTilt={true}>
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 rounded-2xl bg-red-50/90 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="artisan@craftlink.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200/90 bg-white/80 text-xs text-stone-900 focus:outline-none focus:border-[#C85A27] focus:bg-white transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-stone-700">Password *</label>
                <span className="text-[11px] text-stone-400">(min 6 characters)</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200/90 bg-white/80 text-xs text-stone-900 focus:outline-none focus:border-[#C85A27] focus:bg-white transition-all font-mono shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#C85A27] focus:ring-amber-500"
                />
                <span>Remember my session</span>
              </label>

              <span className="text-[11px] text-stone-400 font-mono">PBKDF2 + JWT</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span>Sign In with Password</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </motion.button>

            <div className="pt-2 text-center text-xs text-stone-500 border-t border-stone-100">
              New artisan or craft buyer?{' '}
              <Link to="/register" className="text-[#C85A27] font-bold hover:underline">
                Create a free account
              </Link>
            </div>
          </form>
        </LiquidGlassCard>

        {/* Security Trust Badge */}
        <div className="text-center flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>End-to-end authenticated session with Supabase & JWT encryption</span>
        </div>
      </motion.div>
    </div>
  );
}
