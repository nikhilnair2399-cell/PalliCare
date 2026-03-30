import type { Metadata } from 'next';
import { Nunito, Inter } from 'next/font/google';
import { Providers } from '@/components/layout/Providers';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PalliCare Dashboard',
    template: '%s | PalliCare',
  },
  description:
    'Clinician dashboard for palliative care patient management — AIIMS Bhopal',
  icons: {
    icon: '/favicon.png',
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nunito.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Inline theme script — runs before paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-cream antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
