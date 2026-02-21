'use client';

import { useState } from 'react';
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

  // Login page gets its own full-screen layout — no sidebar/header
  if (pathname === '/patient/login') {
    return <>{children}</>;
  }

  return (
    <PatientAuthProvider>
      <div className="flex min-h-screen">
        {/* Desktop sidebar — always visible on lg */}
        <div className="hidden lg:block">
          <PatientNav onNavigate={() => setSidebarOpen(false)} />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
              <PatientNav onNavigate={() => setSidebarOpen(false)} />
            </div>
          </>
        )}

        <div className="flex flex-1 flex-col lg:pl-64">
          <PatientHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </PatientAuthProvider>
  );
}
