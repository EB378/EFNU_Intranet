import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from 'next-pwa';

const nextIntl = createNextIntlPlugin();

const withPWA = withPWAInit({
  dest: 'public',  
  disable: process.env.NODE_ENV == 'development',
  register: true,
});


/** @type {import('next').NextConfig} */
const nextConfig = {
};



export default withPWA(nextIntl(nextConfig));
