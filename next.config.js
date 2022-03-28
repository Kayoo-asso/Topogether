/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: false,
  images: {
    domains: ['builder.topogether.com', 'imagedelivery.net'],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.experiments = config.experiments || {};
    config.experiments.topLevelAwait = true;
    return config;
  },
}
