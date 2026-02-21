'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, ArrowRight, Shield, Heart, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Stage = 'phone' | 'otp' | 'success';

export default function PatientLoginPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (stage === 'otp') otpRefs.current[0]?.focus();
  }, [stage]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

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
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStage('otp');
    setResendCooldown(30);
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerifyOtp() {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Enter all 6 digits');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 1000));

    if (code === '000000' || code === '123456') {
      // Store patient session
      const devUser = {
        id: 'dev-patient-001',
        name: 'Rajesh Kumar',
        phone,
        uhid: 'AIIMS-BPL-2024-001234',
        preferred_language: 'en',
      };
      localStorage.setItem('patient_token', 'dev-patient-jwt-token');
      localStorage.setItem('patient_user', JSON.stringify(devUser));
      setStage('success');
      setLoading(false);
      setTimeout(() => router.push('/patient'), 800);
    } else {
      setLoading(false);
      setError('Invalid OTP. Use 000000 for dev bypass.');
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left: Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-sage via-teal to-teal-dark p-12 text-white">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 font-heading text-2xl font-bold">
              P
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold">PalliCare</h1>
              <p className="text-sm text-white/70">AIIMS Bhopal</p>
            </div>
          </div>
          <div className="mt-16 max-w-md">
            <h2 className="text-2xl font-bold leading-snug">
              Your Wellness Companion
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              Track your symptoms, manage medications, practice breathing exercises,
              and stay connected with your care team &mdash; all in one place.
            </p>
          </div>
          <div className="mt-12 space-y-4">
            {[
              { icon: '🌿', text: 'Log symptoms easily and track your progress' },
              { icon: '💊', text: 'Never miss a medication with smart reminders' },
              { icon: '🧘', text: 'Breathing exercises for comfort and calm' },
              { icon: '💬', text: 'Message your care team anytime' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                <span className="text-xl">{item.icon}</span>
                <p className="text-sm text-white/90">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Shield className="h-3.5 w-3.5" />
          DPDPA 2023 Compliant &middot; Your data is safe and secure
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-cream to-lavender-light/30 p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sage to-teal text-lg font-bold text-white">
              P
            </div>
            <h1 className="font-heading text-2xl font-bold text-teal">PalliCare</h1>
          </div>

          <h2 className="font-heading text-2xl font-bold text-charcoal">
            {stage === 'phone' && 'Welcome'}
            {stage === 'otp' && 'Enter OTP'}
            {stage === 'success' && 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-charcoal-light">
            {stage === 'phone' && 'Sign in with your registered mobile number'}
            {stage === 'otp' && `We sent a 6-digit code to +91 ${phone}`}
            {stage === 'success' && 'Taking you to your wellness dashboard...'}
          </p>

          {/* Phone stage */}
          {stage === 'phone' && (
            <div className="mt-8 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-charcoal-light">
                  Mobile Number
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <span className="flex h-12 items-center rounded-l-xl border border-r-0 border-sage-light/30 bg-cream/50 px-3 text-sm font-medium text-charcoal-light">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ''));
                      setError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleRequestOtp()}
                    placeholder="98765 43210"
                    className="h-12 flex-1 rounded-r-xl border border-sage-light/30 bg-white px-4 text-lg tracking-wider text-charcoal placeholder:text-charcoal/30 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                    autoFocus
                  />
                </div>
              </div>

              {error && <p className="text-xs text-alert-critical">{error}</p>}

              <button
                onClick={handleRequestOtp}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sage to-teal py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-charcoal/40">
                Dev mode: any number works. OTP bypass:{' '}
                <code className="font-mono text-teal">000000</code>
              </p>
            </div>
          )}

          {/* OTP stage */}
          {stage === 'otp' && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="h-14 w-12 rounded-xl border border-sage-light/30 bg-white text-center text-2xl font-bold text-charcoal focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                  />
                ))}
              </div>

              {error && (
                <p className="text-center text-xs text-alert-critical">{error}</p>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sage to-teal py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Verify & Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs">
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
                  {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend OTP'}
                </button>
              </div>
            </div>
          )}

          {/* Success stage */}
          {stage === 'success' && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <CheckCircle2 className="h-16 w-16 text-sage" />
              <p className="text-sm text-charcoal-light">
                Redirecting to your dashboard...
              </p>
              <Loader2 className="h-5 w-5 animate-spin text-teal" />
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 border-t border-sage-light/20 pt-6 text-center">
            <p className="text-xs text-charcoal/40">
              PalliCare v1.0.0 &middot; AIIMS Bhopal
            </p>
            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-charcoal/30">
              <Heart className="h-3 w-3" />
              Built with compassion for your comfort
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
