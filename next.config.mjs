/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

import nextPWA from "next-pwa";

const withPWA = nextPWA({
	// disable during local development (unless focusing on SW)
	disable: process.env.NODE_ENV !== "production",
	// disable: false,
	dest: "public",
	swSrc: "worker/sw.ts",
	buildExcludes: [/.*sw\.js$/],
});

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	webpack(config) {
		// SVGR
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			use: "@svgr/webpack",
		});
		return config;
	},
	swcMinify: true,
	experimental: {
    swcPlugins: [
      [
        'next-superjson-plugin',
        {
          excluded: [],
        },
      ],
    ],
  },
};

export default withPWA(config);
