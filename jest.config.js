// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: "./",
});

const testPathIgnorePatterns = process.env.TEST_DB
	? ["/node_modules/"]
	: ["/node_modules/", "test/db"];

// Add any custom config to be passed to Jest
const customJestConfig = {
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	// adding '.' to moduleDirectories makes for nice import paths
	moduleDirectories: ["node_modules", "."],
	roots: ["<rootDir>/test/"],
	testPathIgnorePatterns,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
