import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuth } from '../contexts/AuthContext';
import {
  Sparkles, Smartphone, ShieldCheck, ArrowRight,
  RotateCcw, CheckCircle2, AlertCircle, ArrowLeft
} from 'lucide-react';
import { authApi } from '../services/api';
import LiquidGlassCard from '../components/LiquidGlassCard';
import SuccessCheckmark from '../components/SuccessCheckmark';

export default function OTPAuthPage() {
  // ✅ FIX: Use loginWithOtp from context instead of setUser/setToken (which don't exist)
  const { loginWithOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState(location.state?.identifier || '+91 98290 12345');
  const [role, setRole] = useState(location.state?.role || 'artisan');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeStep, setActiveStep] = useState(location.state?.identifier ? 'verify' : 'request');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const inputRefs = useRef([]);

  // Countdown timer for OTP expiry
  useEffect(() => {
    let timer;
    if (activeStep === 'verify' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [activeStep, countdown]);

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter a valid mobile number or email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authApi.sendOtp({ identifier: identifier.trim(), role });
      setActiveStep('verify');
      setCountdown(60);
      setCanResend(false);
      setSuccessMsg('OTP sent to ' + identifier + '! For demo testing, code is 123456.');
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError('');

    // Move to next box automatically
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits entered
    if (newOtp.every((digit) => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split('');
      setOtp(digits);
      handleVerify(pasteData);
    }
  };

  const handleFillDemoOtp = () => {
    const demoDigits = ['1', '2', '3', '4', '5', '6'];
    setOtp(demoDigits);
    handleVerify('123456');
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C85A27', '#1E4D2B', '#F59E0B', '#10B981']
    });
  };

  const handleVerify = async (enteredOtp) => {
    const otpToVerify = enteredOtp || otp.join('');
    if (otpToVerify.length !== 6) {
      setError('Please enter the full 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ✅ FIX: Use loginWithOtp from AuthContext — properly sets user + token
      await loginWithOtp(identifier.trim(), otpToVerify, role);

      setIsVerified(true);
      triggerCelebration();

      setTimeout(() => {
        if (role === 'artisan') {
          navigate('/artisan/dashboard');
        } else {
          navigate('/marketplace');
        }
      }, 1600);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Invalid OTP code. Please use 123456 for demo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Animated background orbs */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed top-20 right-20 w-64 h-64 bg-amber-200/25 rounded-full blur-3xl pointer-events-none -z-10"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed bottom-20 left-20 w-80 h-80 bg-[#C85A27]/10 rounded-full blur-3xl pointer-events-none -z-10"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <LiquidGlassCard className="w-full p-6 sm:p-9 space-y-6" enableCornerMorph={true} enableTilt={true}>
          {/* Subtle background craft glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#C85A27]/10 rounded-full blur-3xl pointer-events-none" />

          {isVerified ? (
            <SuccessCheckmark
              title="OTP Verified Successfully!"
              subtitle={"Welcome to CraftLink! Opening your " + (role === 'artisan' ? 'Artisan Studio' : 'Marketplace') + "..."}
              role={role}
            />
          ) : (
            <>

          {/* Brand & Emblem Header */}
          <div className="text-center space-y-2 relative z-10">
            <motion.img
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              src="/icon.png"
              alt="CraftLink Emblem"
              className="h-14 w-auto mx-auto object-contain drop-shadow-md"
            />
            <h1 className="text-2xl font-black font-serif text-stone-900">
              {activeStep === 'request' ? 'Instant Mobile Login' : 'Verify One-Time Password'}
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              {activeStep === 'request'
                ? 'Enter your phone number or email to receive a secure login OTP'
                : 'Enter the 6-digit code sent to ' + identifier}
            </p>
          </div>

          {/* Demo Fast-Track Tooltip */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2 text-amber-900 font-medium">
              <Sparkles className="w-4 h-4 text-[#C85A27] shrink-0" />
              <span>Demo Test OTP: <strong className="font-mono text-[#C85A27]">123456</strong></span>
            </div>
            {activeStep === 'verify' && (
              <button
                type="button"
                onClick={handleFillDemoOtp}
                className="px-2.5 py-1 rounded-lg bg-[#C85A27] text-white text-[11px] font-bold hover:bg-[#a34418] transition-colors shadow-xs"
              >
                1-Click Fill
              </button>
            )}
          </motion.div>

          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* STEP 1: Phone / Email Input */}
          {activeStep === 'request' && (
            <motion.form
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSendOTP}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="+91 98290 12345 or user@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#C85A27] transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Login As
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('artisan')}
                    className={'py-2 px-3 rounded-xl text-xs font-bold transition-all border ' + (
                      role === 'artisan'
                        ? 'bg-[#1E4D2B] text-white border-[#1E4D2B] shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    )}
                  >
                    Master Artisan
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={'py-2 px-3 rounded-xl text-xs font-bold transition-all border ' + (
                      role === 'buyer'
                        ? 'bg-[#C85A27] text-white border-[#C85A27] shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    )}
                  >
                    Craft Buyer
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending Secure OTP...</span>
                  </span>
                ) : (
                  <>
                    <span>Send One-Time Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </motion.form>
          )}

          {/* STEP 2: 6-Digit Auto-Advancing OTP Input Boxes */}
          {activeStep === 'verify' && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              {/* Split Input Grid */}
              <div className="flex justify-between gap-2" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    whileFocus={{ scale: 1.08, borderColor: '#C85A27' }}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold font-mono rounded-2xl border-2 border-stone-200 bg-stone-50/50 text-stone-900 focus:outline-none focus:bg-white focus:border-[#C85A27] shadow-xs transition-all"
                  />
                ))}
              </div>

              {/* Verification Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleVerify()}
                disabled={loading || otp.some((d) => d === '')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-700 to-[#C85A27] text-white text-xs font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Code...</span>
                  </span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm &amp; Enter Studio</span>
                  </>
                )}
              </motion.button>

              {/* Countdown Timer & Resend */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => { setActiveStep('request'); setOtp(['', '', '', '', '', '']); }}
                  className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-800 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Number</span>
                </button>

                {canResend ? (
                  <button
                    type="button"
                    onClick={() => handleSendOTP()}
                    className="inline-flex items-center gap-1 text-[#C85A27] font-bold hover:underline"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend OTP</span>
                  </button>
                ) : (
                  <span className="font-mono text-stone-400">
                    Resend in <strong className="text-stone-700">{countdown}s</strong>
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {/* Return to Password Login */}
          <div className="pt-2 text-center text-xs text-stone-500 border-t border-stone-100">
            Prefer password authentication?{' '}
            <Link to="/login" className="text-[#C85A27] font-bold hover:underline">
              Sign in with Password
            </Link>
          </div>
            </>
          )}
        </LiquidGlassCard>
      </motion.div>
    </div>
  );
}
