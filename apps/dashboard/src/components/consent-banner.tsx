'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, RefreshCw } from 'lucide-react';
import { verifyPatientConsent, type ConsentStatus } from '@/lib/consent-verification';

interface ConsentBannerProps {
  patientId: string;
  onRetry?: () => void;
}

export function ConsentBanner({ patientId, onRetry }: ConsentBannerProps) {
  const [status, setStatus] = useState<ConsentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConsent();
  }, [patientId]);

  async function checkConsent() {
    setLoading(true);
    try {
      const result = await verifyPatientConsent(patientId);
      setStatus(result);
    } catch {
      setStatus({ hasAccess: false, missingConsents: ['unknown'], lastUpdated: null });
    } finally {
      setLoading(false);
    }
  }

  if (loading || !status || status.hasAccess) return null;

  return (
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-amber-800">Patient Consent Required</h3>
          <p className="mt-1 text-sm text-amber-700">
            This patient has not granted consent for clinician data access, or their consent has been revoked.
            Under DPDPA 2023, patient data cannot be displayed without active consent.
          </p>
          {status.missingConsents.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {status.missingConsents.map((consent) => (
                <span
                  key={consent}
                  className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"
                >
                  <Shield className="h-3 w-3" />
                  {consent.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}
          <button
            onClick={() => { checkConsent(); onRetry?.(); }}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-200 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Re-check Consent
          </button>
        </div>
      </div>
    </div>
  );
}
