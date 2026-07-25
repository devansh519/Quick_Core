module.exports = {
    testEnvironment: "node",

    roots: ["<rootDir>/tests"],

    testMatch: ["**/*.test.js"],

    collectCoverageFrom: [
        "src/**/*.js",
        "!src/config/**",
        "!src/constants/**",
        "!src/db/**",
        "!src/server.js",
    ],

    coverageDirectory: "coverage",

    coverageProvider: "v8",

    setupFilesAfterEnv: ["<rootDir>/tests/helpers/setup.js"],

    clearMocks: true,

    verbose: true,

    testTimeout: 30000,
};