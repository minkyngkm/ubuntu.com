import { test, expect, } from "@playwright/test";
import { selectProducts, acceptCookiePolicy, clickRecaptcha, acceptTerms } from "./helplers/commands";

  const ENDPOINTS = {
    calculate: "/account/canonical-ua/purchase/calculate*",
    postPurchase: "/pro/purchase*",
    preview: "/pro/purchase/preview*",
    ensure: "/account/purchase-account*",
    customerInfo: "/account/customer-info*",
    getPurchase: "/account/purchases/*",
    postInvoice: "/account/purchases/*/retry*",
  };

  test.describe("Checkout - Region and taxes", () => {
    test("user: it should show correct non-VAT price", async ({page}) => {
      await page.goto("/pro/subscribe")
      await acceptCookiePolicy(page)
      await selectProducts(page);
      await page.getByRole("button", { name: "Buy now" }).click();

      await page.click('button[type="submit"]')
      await expect(page).toHaveURL('/account/checkout');

      const preview = await page.waitForResponse(ENDPOINTS.preview);

      await page.locator(':nth-match(:text("Edit"), 1)').click();
      await page.getByLabel("Country/Region:").selectOption({ label: 'Afghanistan' })
      await page.locator(':nth-match(:text("Save"), 1)').click();
      
      expect(preview.status()).toBe(200);
      
      await expect(page.locator("data-testid=tax")).not.toBeVisible();
    })

  test("user: it should show correct VAT price", async ({page}) => {
    await page.goto("/pro/subscribe")
    await acceptCookiePolicy(page)
    await selectProducts(page);
    await page.getByRole("button", { name: "Buy now" }).click();
    
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/account/checkout');
    
    const preview = await page.waitForResponse(ENDPOINTS.preview);
    
    await page.locator(':nth-match(:text("Edit"), 1)').click();
    await page.getByLabel("Country/Region:").selectOption({ label: 'France' })
    await page.locator(':nth-match(:text("Save"), 1)').click();
    
    expect(preview.status()).toBe(200);

    await expect(page.locator("data-testid=tax")).toBeVisible()
    await expect( page.locator("data-testid=total")).toBeVisible();
  })
})

test.describe("Checkout - your inforamtion", ()=>{
  test("user: clicks cancel should reset field", async ({page}) => {
    await page.goto("/pro/subscribe")
    await acceptCookiePolicy(page)
    await selectProducts(page);
    await page.getByRole("button", { name: "Buy now" }).click();
    
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/account/checkout');
    
    const responsePromise = page.waitForResponse(ENDPOINTS.preview);

    await page.locator(':nth-match(:text("Edit"), 2)').click();
    await page.getByLabel("Name:").fill("Abcd")
    await page.getByLabel("Address:").fill("Abcd");
    await page.getByLabel("City:").fill("Abcd");
    await page.getByLabel("Postal code:").fill("Abcd");
    await page.locator(':nth-match(:text("Save"), 1)').click();

    const response = await responsePromise;

    expect(response.status()).toBe(404);

    await expect(page.locator("data-testid=customer-name")).not.toBeVisible()
    await expect(page.locator("data-testid=customer-address")).not.toBeVisible()
    await expect(page.locator("data-testid=customer-city")).not.toBeVisible()
    await expect(page.locator("data-testid=customer-postal-code")).not.toBeVisible()
  })
})

test.describe("Checkout purchase", ()=>{
  test("user: it should purchase", async ({page}) => {
    await page.goto("/pro/subscribe")
    await acceptCookiePolicy(page)
    await selectProducts(page);
    await page.getByRole("button", { name: "Buy now" }).click();
    
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/account/checkout');
    
    await acceptTerms(page)
    await clickRecaptcha(page)
    
    await page.route(ENDPOINTS.postPurchase, (route) => {
      expect(route.request().url().includes("/pro/purchase")).toBeTruthy();
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          status: "success",
        }),
      });
    })

    await page.route(ENDPOINTS.preview, (route) => {
      expect(route.request().url().includes("/pro/purchase/preview")).toBeTruthy();
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          status: "success",
        }),
      });
    })

    await page.route(ENDPOINTS.getPurchase, (route) => {
      expect(route.request().url().includes("/account/purchases")).toBeTruthy();
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          status: "success",
        }),
      });
    })

    await page.getByRole("button",{ name: "Buy"}).click()

    await expect(page).toHaveURL('/pro/dashboard');
    await expect(page.getByText("Your subscriptions")).toBeTruthy()
  })
})