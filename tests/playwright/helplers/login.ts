import { Browser, Page, chromium } from '@playwright/test';
import config, { STORAGE_STATE } from '../../../playwright.config';

export const login = async () => {
  const browser: Browser = await chromium.launch({
    headless: false,
    args: [
      `--unsafely-treat-insecure-origin-as-secure=${config.use?.baseURL}`,
    ],
  });
  const context = await browser.newContext();
  const page: Page = await context.newPage();

  const storageState = await context.storageState();
  const cookies = storageState.cookies;
  if (!cookies){
    await page.goto(config.use?.baseURL + "/login");
    await page.locator('#cookie-policy-button-accept').click();
  
    await page.fill('input[name="email"]', process.env.PLAYWRIGHT_USER_ID as string) ;
    await page.fill('input[name="password"]', process.env.PLAYWRIGHT_PASSWORD as string);
  
    await Promise.all([
      page.click('button[type="submit"]'),
    ]);
  
    await Promise.all([
      page.click('button[type="submit"]'), // Click "Yes, log me in"
    ]);
  
    await page.context().storageState({ path: STORAGE_STATE });
  }
  await browser.close();
}
