module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.js"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/__tests__/**/*.(ts|tsx|js)", "**/*.(test|spec).(ts|tsx|js)"],
  // Focus coverage on testable business logic, not UI/JSX
  collectCoverageFrom: [
    "logic/**/*.{ts,tsx}", // Pure business logic
    "store/**/*.{ts,tsx}", // State management
    "utils/**/*.{ts,tsx}", // Utility functions
    "types/**/*.{ts,tsx}", // Type definitions
    "!app/**/*", // UI screens - test with integration tests
    "!components/**/*", // UI components - test with component tests
    "!utils/gameCountAudit.ts", // Complex utility - test separately
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/__tests__/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    "logic/**/*.ts": {
      branches: 95,
      functions: 100,
      lines: 95,
      statements: 95,
    },
    "store/**/*.ts": {
      branches: 85,
      functions: 90,
      lines: 85,
      statements: 85,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
