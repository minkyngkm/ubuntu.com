import { chromium, FullConfig } from '@playwright/test';

const userEmail = process.env.PLAYWRIGHT_USER_ID;
const userPassword = process.env.PLAYWRIGHT_USER_PASSWORD;
export const userAuthFile = "playwright/.auth/user.json";

const newUserEmail = process.env.PLAYWRIGHT_NEW_USER_ID;
const newUserPassword = process.env.PLAYWRIGHT_NEW_USER_PASSWORD;
export const newUserAuthFile = "playwright/.auth/newUser.json"

async function globalSetup(config: FullConfig) {
  const baseURL = "http://0.0.0.0:8001";
  const browser = await chromium.launch();

  const contextUser1 = await browser.newContext();
  const page1 = await contextUser1.newPage();
  await page1.goto(baseURL + "/login");
  await page1.locator('#cookie-policy-button-accept').click();
  await page1.fill('input[name="email"]', process.env.PLAYWRIGHT_USER_ID as string) ;
  await page1.fill('input[name="password"]', process.env.PLAYWRIGHT_USER_PASSWORD as string);
  await page1.click('button[type="submit"]')
  await page1.click('button[type="submit"]'), // Click "Yes, log me in"
  await page1.context().storageState({ path: userAuthFile  });

  const contextUser2 = await browser.newContext();
  const page2 = await contextUser2.newPage();
  await page2.goto(baseURL + "/login");
  await page2.locator('#cookie-policy-button-accept').click();
  await page2.fill('input[name="email"]', process.env.PLAYWRIGHT_NEW_USER_ID as string) ;
  await page2.fill('input[name="password"]', process.env.PLAYWRIGHT_NEW_USER_PASSWORD as string);
  await page2.click('button[type="submit"]')
  await page2.click('button[type="submit"]'), // Click "Yes, log me in"
  await page2.context().storageState({ path: newUserAuthFile });

  await browser.close();
}

export default globalSetup;