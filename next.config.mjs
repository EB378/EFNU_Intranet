// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from 'next-pwa';

const nextIntl = createNextIntlPlugin();

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // ✅ Disable in dev
});

/** @type {import('next').NextConfig} */
const baseConfig = {
  output: 'standalone',
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'atis.efnu.fi',
      },
    ],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
    {
      source: '/sw.js',
      headers: [
        { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
        { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
      ],
    },
  ],
};

export default withPWA(nextIntl(baseConfig));
