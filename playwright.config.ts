import { defineConfig, devices } from '@playwright/test';
import * as path from "path";

export const STORAGE_STATE = path.join(__dirname, "playwright/.auth/user.json");

import * as dotenv from 'dotenv';
 
dotenv.config({
    path:  path.join(__dirname, ".env.local")
});
 
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: path.join(__dirname, "tests/playwright"),
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  globalSetup: require.resolve('./tests/playwright/global-setup'),
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    baseURL: "http://0.0.0.0:8001/",
    ignoreHTTPSErrors: true,
  },
  
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'checkout',
      testMatch: "checkout.spec.ts",
      use: { ...devices['Desktop Chrome'], baseURL: "http://0.0.0.0:8001/", storageState: STORAGE_STATE},
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    url: 'http://0.0.0.0:8001/',
    reuseExistingServer: !process.env.CI,
  },
});
