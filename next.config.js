/** @type {import('next').NextConfig} */
const {InjectManifest} = require('workbox-webpack-plugin');

const withPWA = require('next-pwa')

module.exports = withPWA({
  pwa: {
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

  // webpack(config) {
  //   config.experiments = config.experiments || {};
  //   config.experiments.topLevelAwait = true;
  //   return config;
  // },
});