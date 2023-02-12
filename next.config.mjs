// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./env/server.mjs"));

const withPWA = require("next-pwa")({
	// disable during local development (unless focusing on SW)
	disable: process.env.NODE_ENV !== "production",
	// disable: false,
	dest: "public",
	swSrc: "worker/sw.ts",
	buildExcludes: [/.*sw\.js$/],
});

module.exports = withPWA(
	/** @type {import('next').NextConfig} */
	{
		reactStrictMode: false,
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
	}
);
