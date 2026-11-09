// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env'), quiet: true });

const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json');

module.exports = defineConfig({
  testDir: './tests',
  // One shared user account means one shared server-side cart,
  // so UI tests run one at a time to keep the cart state predictable.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://rahulshettyacademy.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },

  projects: [
    // 1. Logs in once and saves the session (localStorage token) to disk.
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
    },
    // 2. UI tests reuse the saved session.
    {
      name: 'chromium',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    // 3. API tests need no browser session.
    {
      name: 'api',
      testDir: './tests/api',
    },
  ],
});
