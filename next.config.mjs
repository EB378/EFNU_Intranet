//next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from 'next-pwa';

const nextIntl = createNextIntlPlugin();

const withPWA = withPWAInit({
  dest: 'public',  
  register: true,
});


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  compress: true,
  images: {
    domains: ['atis.efnu.fi'],
  },
};



export default withPWA(nextIntl(nextConfig));
