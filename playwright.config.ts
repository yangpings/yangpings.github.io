import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  // Desktop tests use a 1440px window: below 1361px the header switches to the full-screen menu.
  use: { baseURL: 'http://127.0.0.1:5173', browserName: 'chromium', viewport: { width: 1440, height: 900 } },
  webServer: { command: 'npm run dev', url: 'http://127.0.0.1:5173', reuseExistingServer: !process.env.CI },
});
