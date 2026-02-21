'use client';

import { useState } from 'react';
import { PatientAuthProvider } from '@/lib/patient-auth';
import { PatientNav } from '@/components/patient/PatientNav';
import { PatientHeader } from '@/components/patient/PatientHeader';
import { PatientBottomNav } from '@/components/patient/PatientBottomNav';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PatientAuthProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-cream via-white to-lavender-light/30">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <div className="fixed inset-y-0 left-0 w-72">
            <PatientNav />
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-charcoal/30 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
              <PatientNav />
            </div>
          </>
        )}

        {/* Main content area */}
        <div className="flex flex-1 flex-col lg:pl-72">
          <PatientHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-4 pb-20 lg:p-6 lg:pb-6">{children}</main>
        </div>

        {/* Mobile bottom navigation */}
        <PatientBottomNav />
      </div>
    </PatientAuthProvider>
  );
}
