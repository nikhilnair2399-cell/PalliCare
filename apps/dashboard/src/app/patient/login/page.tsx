'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Shield, Heart, Loader2, CheckCircle2, Leaf, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

type Stage = 'phone' | 'otp' | 'success';

/* ── Keyframe styles for animations ──────────────────────── */
const shakeKeyframes = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}
@keyframes pulse-scale {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
@keyframes draw-check {
  0% { stroke-dashoffset: 24; }
  100% { stroke-dashoffset: 0; }
}
@keyframes fade-up {
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}
`;

export default function PatientLoginPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shakeError, setShakeError] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const [showDevHint, setShowDevHint] = useState(false);
  const [lastPulseIdx, setLastPulseIdx] = useState(-1);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneRef = useRef<HTMLInputElement | null>(null);

  // Restore remembered phone on mount
  useEffect(() => {
    const saved = localStorage.getItem('patient_remember_phone');
    if (saved) {
      setPhone(saved);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (stage === 'otp') otpRefs.current[0]?.focus();
  }, [stage]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Clear shake after animation
  useEffect(() => {
    if (!shakeError) return;
    const t = setTimeout(() => setShakeError(false), 500);
    return () => clearTimeout(t);
  }, [shakeError]);

  // Clear pulse after animation
  useEffect(() => {
    if (lastPulseIdx < 0) return;
    const t = setTimeout(() => setLastPulseIdx(-1), 200);
    return () => clearTimeout(t);
  }, [lastPulseIdx]);

  function triggerError(msg: string) {
    setError(msg);
    setShakeError(true);
  }

  async function handleResendOtp() {
    if (resendCooldown > 0) return;
    setOtp(['', '', '', '', '', '']);
    setError('');
    setResendCooldown(30);
    await new Promise((r) => setTimeout(r, 500));
    otpRefs.current[0]?.focus();
  }

  async function handleRequestOtp() {
    if (phone.length < 10) {
      triggerError('Enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    setError('');
    // Save phone if remember me is on
    if (rememberMe) {
      localStorage.setItem('patient_remember_phone', phone);
    } else {
      localStorage.removeItem('patient_remember_phone');
    }
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStage('otp');
    setResendCooldown(30);
  }

  const handleVerifyOtp = useCallback(async (otpDigits: string[]) => {
    const code = otpDigits.join('');
    if (code.length !== 6) {
      triggerError('Enter all 6 digits');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 1000));
    if (code === '000000' || code === '123456') {
      localStorage.setItem('patient_token', 'dev-patient-jwt-token');
      localStorage.setItem(
        'patient_user',
        JSON.stringify({
          id: 'patient-001',
          name: 'Rajesh Kumar',
          phone,
          uhid: 'AIIMS-BPL-2024-001234',
          preferred_language: 'en',
        }),
      );
      setStage('success');
      setLoading(false);

      // Check if onboarding is needed
      const onboarded = localStorage.getItem('patient_onboarding_complete');
      if (onboarded === 'true') {
        setTimeout(() => router.push('/patient'), 800);
      } else {
        setTimeout(() => router.push('/patient/onboarding'), 800);
      }
    } else {
      setLoading(false);
      triggerError('Invalid OTP. Try 000000 for demo.');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone, router]);

  function handleOtpChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setLastPulseIdx(index);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when 6th digit entered
    if (value && index === 5) {
      const code = next.join('');
      if (code.length === 6) {
        handleVerifyOtp(next);
      }
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      handleVerifyOtp(otp);
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const digits = pasted.split('');
    const next = [...otp];
    digits.forEach((d, i) => { next[i] = d; });
    setOtp(next);
    const focusIdx = Math.min(digits.length, 5);
    otpRefs.current[focusIdx]?.focus();

    // Auto-submit if pasted all 6
    if (next.join('').length === 6) {
      setTimeout(() => handleVerifyOtp(next), 100);
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shakeKeyframes }} />

      <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-8 sm:p-5">
        <div className="w-full max-w-md" style={{ animation: 'fade-up 0.5s ease-out' }}>

          {/* Logo & Tagline */}
          <div className="mb-8 sm:mb-10 flex flex-col items-center text-center">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-teal text-white shadow-lg shadow-teal/20">
              <Leaf className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <h1 className="mt-3 sm:mt-4 font-heading text-2xl sm:text-3xl font-bold text-teal">
              PalliCare
            </h1>
            <p className="mt-1 text-sm sm:text-base text-charcoal-light">
              Your Wellness Companion
            </p>
          </div>

          {/* Form Card */}
          <div
            className="overflow-hidden rounded-2xl bg-white p-5 sm:p-8"
            style={{ animation: 'fade-up 0.5s ease-out 0.1s both' }}
          >
            <h2 className="text-center font-heading text-xl sm:text-2xl font-bold text-charcoal">
              {stage === 'phone' && 'Welcome Back'}
              {stage === 'otp' && 'Verify OTP'}
              {stage === 'success' && 'Welcome!'}
            </h2>
            <p className="mt-2 text-center text-sm text-charcoal-light">
              {stage === 'phone' && 'Sign in with your registered mobile number'}
              {stage === 'otp' && (
                <>We sent a 6-digit code to <span className="font-medium text-charcoal">+91 {phone}</span></>
              )}
              {stage === 'success' && 'Authentication successful'}
            </p>

            {/* ── Phone Stage ──────────────────────────── */}
            {stage === 'phone' && (
              <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-5" style={{ animation: 'fade-up 0.3s ease-out' }}>
                <div>
                  <label className="mb-1.5 sm:mb-2 block text-sm font-medium text-charcoal">
                    Mobile Number
                  </label>
                  <div className="flex items-center gap-0">
                    <span className="flex h-12 sm:h-14 items-center rounded-l-xl sm:rounded-l-2xl border border-r-0 border-charcoal/10 bg-cream px-3 sm:px-4 text-sm sm:text-base font-medium text-charcoal/60">
                      +91
                    </span>
                    <input
                      ref={phoneRef}
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, ''));
                        setError('');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleRequestOtp()}
                      placeholder="98765 43210"
                      className="h-12 sm:h-14 flex-1 rounded-r-xl sm:rounded-r-2xl border border-charcoal/10 bg-white px-3 sm:px-4 text-base sm:text-lg tracking-wider text-charcoal placeholder:text-charcoal/25 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Remember me toggle */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={rememberMe}
                    onClick={() => setRememberMe(!rememberMe)}
                    className={cn(
                      'relative h-5 w-9 rounded-full transition-colors duration-200',
                      rememberMe ? 'bg-teal' : 'bg-charcoal/15'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                        rememberMe && 'translate-x-4'
                      )}
                    />
                  </button>
                  <span className="text-sm text-charcoal/60">Remember my number</span>
                </label>

                {/* Error */}
                {error && (
                  <div
                    className="rounded-xl bg-red-50 px-3 py-2 text-sm text-alert-critical"
                    style={shakeError ? { animation: 'shake 0.4s ease-in-out' } : undefined}
                  >
                    {error}
                  </div>
                )}

                <button
                  onClick={handleRequestOtp}
                  disabled={loading}
                  className="flex h-12 sm:h-14 w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-teal text-sm sm:text-base font-bold text-white transition-all hover:bg-teal/90 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Request OTP
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>

                {/* Dev hint (collapsible) */}
                <button
                  onClick={() => setShowDevHint(!showDevHint)}
                  className="w-full text-center text-xs text-charcoal/30 hover:text-charcoal/50 transition-colors"
                >
                  {showDevHint ? 'Hide' : 'Show'} demo info
                </button>
                {showDevHint && (
                  <p className="text-center text-sm text-charcoal/40 rounded-lg bg-cream/60 px-3 py-2">
                    Demo mode: any number works. OTP: <code className="font-mono text-teal">000000</code>
                  </p>
                )}
              </div>
            )}

            {/* ── OTP Stage ──────────────────────────────── */}
            {stage === 'otp' && (
              <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-5" style={{ animation: 'fade-up 0.3s ease-out' }}>
                <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={cn(
                        'h-12 w-10 sm:h-16 sm:w-14 rounded-xl sm:rounded-2xl border bg-white text-center text-2xl sm:text-3xl font-bold text-charcoal focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all',
                        digit ? 'border-teal/40' : 'border-charcoal/10',
                      )}
                      style={lastPulseIdx === i ? { animation: 'pulse-scale 0.2s ease-out' } : undefined}
                    />
                  ))}
                </div>

                {/* Error */}
                {error && (
                  <div
                    className="rounded-xl bg-red-50 px-3 py-2 text-center text-sm text-alert-critical"
                    style={shakeError ? { animation: 'shake 0.4s ease-in-out' } : undefined}
                  >
                    {error}
                  </div>
                )}

                <button
                  onClick={() => handleVerifyOtp(otp)}
                  disabled={loading}
                  className="flex h-12 sm:h-14 w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-teal text-sm sm:text-base font-bold text-white transition-all hover:bg-teal/90 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Verify & Sign In
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    onClick={() => {
                      setStage('phone');
                      setOtp(['', '', '', '', '', '']);
                      setError('');
                    }}
                    className="text-teal hover:underline"
                  >
                    Change number
                  </button>
                  <button
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0}
                    className={cn(
                      'transition-colors',
                      resendCooldown > 0
                        ? 'cursor-not-allowed text-charcoal/30'
                        : 'text-teal hover:underline',
                    )}
                  >
                    {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend OTP'}
                  </button>
                </div>

                <p className="text-center text-xs text-charcoal/30">
                  OTP auto-submits when you enter all 6 digits
                </p>
              </div>
            )}

            {/* ── Success Stage ───────────────────────────── */}
            {stage === 'success' && (
              <div className="mt-8 flex flex-col items-center gap-4" style={{ animation: 'fade-up 0.4s ease-out' }}>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sage/15">
                  <CheckCircle2 className="h-12 w-12 text-sage" />
                </div>
                <p className="text-base text-charcoal-light">
                  Taking you to your wellness space...
                </p>
                <Loader2 className="h-5 w-5 animate-spin text-teal" />
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="mt-6 sm:mt-8 space-y-3 text-center"
            style={{ animation: 'fade-up 0.5s ease-out 0.2s both' }}
          >
            {/* Terms & Privacy links */}
            <div className="flex items-center justify-center gap-3 text-xs text-charcoal/35">
              <button className="hover:text-teal hover:underline transition-colors">
                Terms of Service
              </button>
              <span className="text-charcoal/15">|</span>
              <button className="hover:text-teal hover:underline transition-colors">
                Privacy Policy
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-charcoal/25">
              <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              DPDPA 2023 Compliant
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-charcoal/20">
              <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Built with compassion for your comfort
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
