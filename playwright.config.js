// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests/e2e',  // Only run tests from this folder
  timeout: 30000,
  retries: 1,
});
