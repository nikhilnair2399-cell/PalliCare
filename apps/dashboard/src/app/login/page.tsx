'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, ArrowRight, Shield, Heart, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Stage = 'phone' | 'otp' | 'success';

export default function LoginPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first OTP input
  useEffect(() => {
    if (stage === 'otp') otpRefs.current[0]?.focus();
  }, [stage]);

  async function handleRequestOtp() {
    if (phone.length < 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    setError('');
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStage('otp');
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    // Auto-advance
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
    // Simulate verification
    await new Promise((r) => setTimeout(r, 1000));
    // Dev bypass: 000000 always works
    if (code === '000000' || code === '123456') {
      localStorage.setItem('token', 'dev-jwt-token');
      setStage('success');
      setLoading(false);
      setTimeout(() => router.push('/'), 800);
    } else {
      setLoading(false);
      setError('Invalid OTP. Use 000000 for dev bypass.');
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left: Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-teal p-12 text-white">
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
              Palliative Care & Pain Management Platform
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              Real-time patient monitoring, symptom tracking, medication management,
              and care team collaboration &mdash; built for India&rsquo;s palliative care needs.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { label: 'Active Patients', value: '24' },
              { label: 'Alerts Today', value: '7' },
              { label: 'Care Plans', value: '18' },
              { label: 'Team Messages', value: '42' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/10 p-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="mt-0.5 text-xs text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Shield className="h-3.5 w-3.5" />
          DPDPA 2023 Compliant &middot; Data stored in AIIMS infrastructure
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-10 lg:hidden flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-lg font-bold text-white">
              P
            </div>
            <h1 className="font-heading text-2xl font-bold text-teal">PalliCare</h1>
          </div>

          <h2 className="font-heading text-2xl font-bold text-charcoal">
            {stage === 'phone' && 'Clinician Sign In'}
            {stage === 'otp' && 'Enter OTP'}
            {stage === 'success' && 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-charcoal/60">
            {stage === 'phone' && 'Enter your registered mobile number to receive an OTP'}
            {stage === 'otp' && `We sent a 6-digit code to +91 ${phone}`}
            {stage === 'success' && 'Authentication successful. Redirecting...'}
          </p>

          {/* Phone stage */}
          {stage === 'phone' && (
            <div className="mt-8 space-y-4">
              <div>
                <label className="text-xs font-semibold text-charcoal/60 uppercase">
                  Mobile Number
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <span className="flex h-12 items-center rounded-l-xl border border-r-0 border-sage-light/30 bg-cream/50 px-3 text-sm font-medium text-charcoal/60">
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

              {error && (
                <p className="text-xs text-alert-critical">{error}</p>
              )}

              <button
                onClick={handleRequestOtp}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-teal/90 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Request OTP
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-charcoal/40">
                Dev mode: any number works. OTP bypass: <code className="font-mono text-teal">000000</code>
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
                    ref={(el) => { otpRefs.current[i] = el; }}
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
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-teal/90 disabled:opacity-50"
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
                  onClick={() => { setStage('phone'); setOtp(['', '', '', '', '', '']); setError(''); }}
                  className="text-teal hover:underline"
                >
                  Change number
                </button>
                <button className="text-charcoal/40 hover:text-charcoal/60">
                  Resend OTP
                </button>
              </div>
            </div>
          )}

          {/* Success stage */}
          {stage === 'success' && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <CheckCircle2 className="h-16 w-16 text-alert-success" />
              <p className="text-sm text-charcoal/60">Redirecting to dashboard...</p>
              <Loader2 className="h-5 w-5 animate-spin text-teal" />
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 border-t border-sage-light/20 pt-6 text-center">
            <p className="text-xs text-charcoal/40">
              PalliCare v1.0.0 &middot; AIIMS Bhopal &middot; Department of Anaesthesiology & Palliative Medicine
            </p>
            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-charcoal/30">
              <Heart className="h-3 w-3" />
              Built with compassion for palliative care
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
