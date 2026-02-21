'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Activity, Pill, Sparkles, MessageCircle } from 'lucide-react';

const items = [
  { name: 'Home', href: '/patient', icon: Home },
  { name: 'Log', href: '/patient/log', icon: Activity },
  { name: 'Meds', href: '/patient/medications', icon: Pill },
  { name: 'Journey', href: '/patient/journey', icon: Sparkles },
  { name: 'Chat', href: '/patient/messages', icon: MessageCircle },
];

export function PatientBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-sage-light/20 bg-white/90 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/patient' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-medium transition-colors',
                isActive
                  ? 'text-teal'
                  : 'text-charcoal-light hover:text-charcoal',
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive && 'text-teal')} />
              {item.name}
              {isActive && (
                <span className="mt-0.5 h-1 w-1 rounded-full bg-teal" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
