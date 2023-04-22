/** @type {import("prettier").Config} */
const config = {
	useTabs: true,
	plugins: [require.resolve("prettier-plugin-tailwindcss")],
};

module.exports = config;
