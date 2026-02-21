'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PatientAuthProvider } from '@/lib/patient-auth';
import { PatientNav } from '@/components/patient/PatientNav';
import { PatientHeader } from '@/components/patient/PatientHeader';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Login page gets its own full-screen layout — no sidebar/header
  if (pathname === '/patient/login') {
    return <>{children}</>;
  }

  return (
    <PatientAuthProvider>
      <div className="flex min-h-screen bg-cream">
        {/* Desktop sidebar — always visible on lg */}
        <div className="hidden lg:block">
          <PatientNav onNavigate={() => setSidebarOpen(false)} />
        </div>

        {/* Mobile sidebar overlay with smooth transition */}
        <div
          className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-200 lg:hidden ${
            sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-out lg:hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <PatientNav onNavigate={() => setSidebarOpen(false)} />
        </div>

        <div className="flex flex-1 flex-col lg:pl-64">
          <PatientHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-5 lg:p-8">
            <div className="animate-in fade-in duration-300">
              {children}
            </div>
          </main>
        </div>
      </div>
    </PatientAuthProvider>
  );
}
