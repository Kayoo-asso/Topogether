/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')

module.exports = withPWA({
  pwa: {
    // disable during local development (unless focusing on SW)
    disable: process.env.NODE_ENV !== "production",
    dest: 'public',
    swSrc: 'worker/sw.ts',
  },
  reactStrictMode: false,
  images: {
    domains: ['builder.topogether.com', 'imagedelivery.net'],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
});