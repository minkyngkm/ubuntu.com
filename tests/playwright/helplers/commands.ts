import { Page } from "@playwright/test";

export const selectProducts = async (
  page: Page,
  productUser = "organisation",
  quantity = 2,
  machineType = "physical",
  version = "20.04",
) => {
  await page.locator(`[value='${productUser}']`).check();
  await page.locator("#quantity-input").fill(`${quantity}`);
  await page.locator(`[value='${machineType}']`).check();
  await page.getByRole('tab', { name: `${version} LTS`}).click();
  await page.getByRole('radio', { name: 'Ubuntu Pro (Infra-only)', exact: true }).check()
};

export const acceptCookiePolicy = async (
  page: Page,
) => {
  await page.getByRole("button", { name: "Accept all and visit site" }).click();
};

export const acceptTerms = async (page: Page) => {
  await page.getByText(/I agree to the Ubuntu Pro service terms/).click()
  await page.getByText(/I agree to the Ubuntu Pro description/).click()
}

export const clickRecaptcha = async (page: Page) => {
  await page.frameLocator('[title="reCAPTCHA"]').getByRole('checkbox', { name: 'I\'m not a robot' }).click({force: true});
}