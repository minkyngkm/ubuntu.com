import { test, expect, } from "@playwright/test";
import { selectProducts, acceptCookiePolicy, clickRecaptcha, acceptTerms } from "./helplers/commands";
import { mockChangeCountry, mockPreview } from "./helplers/mockAPI";

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

      await mockChangeCountry(page, ENDPOINTS.customerInfo, "JP")
      
      await mockPreview(page, ENDPOINTS.preview ,{ currency: "USD",
      subtotal: 45000,
      tax: 0,
      total: 45000, 
      end_of_cycle: "2042-02-03T16:32:54Z"})

      await page.locator(':nth-match(:text("Edit"), 1)').click();
      await page.getByLabel("Country/Region:").selectOption({ label: 'Japan' })
      await page.locator(':nth-match(:text("Save"), 1)').click();

      await page.waitForTimeout(3000);

      const country = await page.$('[data-testid="country"]')
      const countryText = await country?.innerText();

      expect(countryText).toBe("Japan")
      expect(await page.$('[data-testid="total"]')).toBeNull();
      expect(await page.$('[data-testid="tax"]')).toBeNull();
    })

  test("user: it should show correct VAT price", async ({page}) => {
    await page.goto("/pro/subscribe")
    await acceptCookiePolicy(page)
    await selectProducts(page);
    await page.getByRole("button", { name: "Buy now" }).click();
    
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/account/checkout');
    
    await mockChangeCountry(page, ENDPOINTS.customerInfo, "FR")
    await mockPreview(page, ENDPOINTS.preview ,{"currency": "usd",
    "end_of_cycle": "2024-11-29T11:14:37Z",
    "id": "",
    "items": null,
    "payment_status": null,
    "reason": "upcoming",
    "start_of_cycle": "2023-11-29T11:14:37Z",
    "status": "draft",
    "tax_amount": 9000,
    "total": 54000,
    "url": null })

    await page.locator(':nth-match(:text("Edit"), 1)').click();
    await page.getByLabel("Country/Region:").selectOption({ label: 'France' })
    await page.locator(':nth-match(:text("Save"), 1)').click();
    
    await page.waitForTimeout(3000);

    const country = await page.$('[data-testid="country"]')
    const countryText = await country?.innerText();

    expect(countryText).toBe("France")

    await expect(page.locator('[data-testid="tax"]')).toBeVisible()
    await expect(page.locator('[data-testid="total"]')).toBeVisible();
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
    
    await page.locator(':nth-match(:text("Edit"), 2)').click();
    await page.getByLabel("Name:").fill("Abcd")
    await page.getByLabel("Address:").fill("Abcd");
    await page.getByLabel("City:").fill("Abcd");
    await page.getByLabel("Postal code:").fill("Abcd");
    await page.locator(':nth-match(:text("Save"), 1)').click();

    expect(await page.$("data-testid=customer-name")).toBeNull();
    expect(await page.$("data-testid=customer-address")).toBeNull();
    expect(await page.$("data-testid=customer-city")).toBeNull();;
    expect(await page.$("data-testid=customer-postal-code")).toBeNull();
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
    await page.waitForTimeout(3000)

    await page.route(ENDPOINTS.customerInfo, async (route) => {
      await route.fulfill({
        status: 200,
      });
    })
    await page.route(ENDPOINTS.preview, async (route) => {
      await route.fulfill({
        status: 200,
      });
    })
    await page.route(ENDPOINTS.postPurchase, async (route) => {
      await route.fulfill({
        status: 200,
      });
    })
    await page.route(ENDPOINTS.getPurchase, async(route) => {
      const response = await route.fetch();
      route.fulfill({
        status: 200,
      });
    })

    await page.getByRole("button",{ name: "Buy"}).click()
    
    await page.waitForTimeout(3000)

    await expect(page).toHaveURL('/pro/dashboard');
    await expect(page.getByText("Your subscriptions")).toBeTruthy()
  })
})