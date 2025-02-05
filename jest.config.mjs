export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  snapshotSerializers: ["@tact-lang/ton-jest/serializers"],
  globalSetup: './jest.setup.mjs',
  globalTeardown: './jest.teardown.mjs',
};