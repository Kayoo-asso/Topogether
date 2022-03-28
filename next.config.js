/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
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
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: [
          {
            key: 'Accept-CH',
            value: 'Viewport-Width, Downlink'
          }
        ],
      },
    ]
  }
}
