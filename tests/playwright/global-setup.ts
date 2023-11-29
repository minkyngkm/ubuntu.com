import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(baseURL + "/login");
  await page.locator('#cookie-policy-button-accept').click();
  await page.fill('input[name="email"]', process.env.PLAYWRIGHT_USER_ID as string) ;
  await page.fill('input[name="password"]', process.env.PLAYWRIGHT_PASSWORD as string);
  await page.click('button[type="submit"]')
  await page.click('button[type="submit"]'), // Click "Yes, log me in"
  await page.context().storageState({ path: storageState as string  });
  await browser.close();
}

export default globalSetup;