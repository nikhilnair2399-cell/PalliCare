'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Shows a gentle install prompt when the PWA is installable.
 * Uses the beforeinstallprompt event on Chrome/Edge/Samsung.
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
      return;
    }

    // User previously dismissed
    if (sessionStorage.getItem('pwa-dismissed')) {
      setDismissed(true);
      return;
    }

    function handlePrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }

    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  if (isStandalone || dismissed || !deferredPrompt) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsStandalone(true);
    }
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    setDismissed(true);
    sessionStorage.setItem('pwa-dismissed', '1');
  }

  return (
    <div className="rounded-2xl bg-teal/5 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10">
          <Download className="h-5 w-5 text-teal" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-charcoal">
            Install PalliCare
          </p>
          <p className="mt-0.5 text-sm text-charcoal-light">
            Add to your home screen for quick access, even offline.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleInstall}
              className="rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal/90"
            >
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-xl px-3 py-2 text-sm text-charcoal-light transition-colors hover:bg-charcoal/5"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="shrink-0 rounded-lg p-1 text-charcoal/30 hover:text-charcoal/60"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
