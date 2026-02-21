'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Shield, Heart, Loader2, CheckCircle2, Leaf } from 'lucide-react';
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
      setTimeout(() => router.push('/patient'), 800);
    } else {
      setLoading(false);
      setError('Invalid OTP. Use 000000 for dev bypass.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream p-5">
      <div className="w-full max-w-md">
        {/* Logo & Tagline */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal text-white">
            <Leaf className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-heading text-3xl font-bold text-teal">PalliCare</h1>
          <p className="mt-1 text-base text-charcoal-light">Your Wellness Companion</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-white p-8">
          <h2 className="text-center font-heading text-2xl font-bold text-charcoal">
            {stage === 'phone' && 'Welcome Back'}
            {stage === 'otp' && 'Enter OTP'}
            {stage === 'success' && 'Welcome'}
          </h2>
          <p className="mt-2 text-center text-sm text-charcoal-light">
            {stage === 'phone' && 'Sign in with your registered mobile number'}
            {stage === 'otp' && `We sent a 6-digit code to +91 ${phone}`}
            {stage === 'success' && 'Authentication successful. Redirecting...'}
          </p>

          {/* Phone stage */}
          {stage === 'phone' && (
            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal">
                  Mobile Number
                </label>
                <div className="flex items-center gap-0">
                  <span className="flex h-14 items-center rounded-l-2xl border border-r-0 border-charcoal/10 bg-cream px-4 text-base font-medium text-charcoal/60">
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
                    className="h-14 flex-1 rounded-r-2xl border border-charcoal/10 bg-white px-4 text-lg tracking-wider text-charcoal placeholder:text-charcoal/25 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-alert-critical">{error}</p>
              )}

              <button
                onClick={handleRequestOtp}
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-teal text-base font-bold text-white transition-colors hover:bg-teal/90 disabled:opacity-50"
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

              <p className="text-center text-sm text-charcoal/40">
                Dev mode: any number works. OTP: <code className="font-mono text-teal">000000</code>
              </p>
            </div>
          )}

          {/* OTP stage */}
          {stage === 'otp' && (
            <div className="mt-8 space-y-5">
              <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
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
                    className="h-16 w-14 rounded-2xl border border-charcoal/10 bg-white text-center text-3xl font-bold text-charcoal focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                  />
                ))}
              </div>

              {error && (
                <p className="text-center text-sm text-alert-critical">{error}</p>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-teal text-base font-bold text-white transition-colors hover:bg-teal/90 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Verify &amp; Sign In
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => { setStage('phone'); setOtp(['', '', '', '', '', '']); setError(''); }}
                  className="text-teal hover:underline"
                >
                  Change number
                </button>
                <button
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0}
                  className={cn('transition-colors', resendCooldown > 0 ? 'cursor-not-allowed text-charcoal/30' : 'text-teal hover:underline')}
                >
                  {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend OTP'}
                </button>
              </div>
            </div>
          )}

          {/* Success stage */}
          {stage === 'success' && (
            <div className="mt-8 flex flex-col items-center gap-4">
              <CheckCircle2 className="h-16 w-16 text-sage" />
              <p className="text-base text-charcoal-light">Taking you to your wellness space...</p>
              <Loader2 className="h-5 w-5 animate-spin text-teal" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-1.5 text-sm text-charcoal/30">
            <Shield className="h-3.5 w-3.5" />
            DPDPA 2023 Compliant
          </div>
          <div className="mt-2 flex items-center justify-center gap-1.5 text-sm text-charcoal/25">
            <Heart className="h-3.5 w-3.5" />
            Built with compassion for your comfort
          </div>
        </div>
      </div>
    </div>
  );
}
