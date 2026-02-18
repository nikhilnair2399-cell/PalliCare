import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,

  // Transpile shared packages from monorepo
  transpilePackages: ['@pallicare/shared-types'],

  // Image optimization for patient photos and charts
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },

  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_APP_NAME: 'PalliCare Dashboard',
    NEXT_PUBLIC_APP_VERSION: '0.1.0',
  },
};

export default nextConfig;
