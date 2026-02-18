import type { Metadata } from 'next';
import { Providers } from '@/components/layout/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'PalliCare Dashboard',
    template: '%s | PalliCare',
  },
  description:
    'Clinician dashboard for palliative care patient management — AIIMS Bhopal',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#f8faf9] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
