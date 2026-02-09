module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: ["**/*.integration.test.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"]
};
