import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'npm start',   // <-- how to start your app
    port: 5001,             // <-- your app port
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  }
});
