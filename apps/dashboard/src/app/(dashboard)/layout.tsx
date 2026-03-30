'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/lib/auth';
import { isRouteAllowed } from '@/lib/role-config';
import { DevRoleSwitcher } from '@/components/layout/DevRoleSwitcher';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Redirect to home if the current route is not allowed for this role
  useEffect(() => {
    if (!isAuthenticated || !pathname) return;
    if (!isRouteAllowed(user?.clinicianRole, pathname)) {
      router.replace('/');
    }
  }, [pathname, user?.clinicianRole, isAuthenticated, router]);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar — always visible on lg */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar />
          </div>
        </>
      )}

      <div className="flex flex-1 flex-col lg:pl-64">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>

      {/* Dev-only role switcher */}
      <DevRoleSwitcher />
    </div>
  );
}
