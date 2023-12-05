import { test, expect, } from "@playwright/test";
import { selectProducts, acceptCookiePolicy, clickRecaptcha, acceptTerms } from "../helplers/commands";
import { customerInfoResponse, getPurchase, postPurchase, postPurchasePreview, previewResponse, previewWithTaxResponse } from "../helplers/mockData";
  
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
    test("It should show correct non-VAT price", async ({page}) => {
      await page.goto("/pro/subscribe")
      await acceptCookiePolicy(page)
      await selectProducts(page);
      await page.getByRole("button", { name: "Buy now" }).click();

      await page.locator('button[type="submit"]').click()
      await expect(page).toHaveURL('/account/checkout');

      await page.route(ENDPOINTS.customerInfo,  async (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({...customerInfoResponse, "customerInfo": {...customerInfoResponse.customerInfo, "address": {...customerInfoResponse.customerInfo.address, "country": "JP" }}})
        });
      });

      await page.route(ENDPOINTS.preview,  async (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(previewResponse)
        });
      });
      
      await page.locator(':nth-match(:text("Edit"), 1)').click();
      await page.getByLabel("Country/Region:").selectOption({ label: 'Japan' })
      await page.locator(':nth-match(:text("Save"), 1)').click();

      await page.waitForTimeout(1000);

      const country = await page.$('[data-testid="country"]')
      const countryText = await country?.innerText();

      expect(countryText).toBe("Japan")
      expect(await page.$('[data-testid="total"]')).toBeNull();
      expect(await page.$('[data-testid="tax"]')).toBeNull();
    })

  test("It should show correct VAT price", async ({page}) => {
    await page.goto("/pro/subscribe")
    await acceptCookiePolicy(page)
    await selectProducts(page);
    await page.getByRole("button", { name: "Buy now" }).click();
    
    await page.locator('button[type="submit"]').click()
    await expect(page).toHaveURL('/account/checkout');
    
    await page.route(ENDPOINTS.customerInfo,  async (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({...customerInfoResponse, "customerInfo": {...customerInfoResponse.customerInfo, "address": {...customerInfoResponse.customerInfo.address, "country": "FR" }}})
      });
    });
    await page.route(ENDPOINTS.preview,  async (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(previewWithTaxResponse)
      });
    });
    await page.locator(':nth-match(:text("Edit"), 1)').click();
    await page.getByLabel("Country/Region:").selectOption({ label: 'France' })
    await page.locator(':nth-match(:text("Save"), 1)').click();
    
    await page.waitForTimeout(1000);

    const country = await page.$('[data-testid="country"]')
    const countryText = await country?.innerText();

    expect(countryText).toBe("France")

    await expect(page.locator('[data-testid="tax"]')).toBeVisible()
    await expect(page.locator('[data-testid="total"]')).toBeVisible();
  })
})

test.describe("Checkout - Your inforamtion", ()=>{
  test("Click cancel should reset field", async ({page}) => {
    await page.goto("/pro/subscribe")
    await acceptCookiePolicy(page)
    await selectProducts(page);
    await page.getByRole("button", { name: "Buy now" }).click();
    
    await page.locator('button[type="submit"]').click()
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
  test("It should purchase", async ({page}) => {
      await page.goto("/pro/subscribe")
      await acceptCookiePolicy(page)
      await selectProducts(page);
      await page.getByRole("button", { name: "Buy now" }).click();
      
      await page.click('button[type="submit"]')
      await expect(page).toHaveURL('/account/checkout');
      
      await acceptTerms(page)
      await clickRecaptcha(page)
  
      await page.waitForTimeout(1000);

      await page.route(ENDPOINTS.preview, async (route) => {
        route.fulfill({
          status: 200,
          body: JSON.stringify(postPurchasePreview)
        });
      })
      await page.route(ENDPOINTS.postPurchase, async (route) => {
        route.fulfill({
          status: 200,
          body: JSON.stringify(postPurchase)
        });
      })
      await page.route(ENDPOINTS.getPurchase, async(route) => {
        route.fulfill({
          status: 200,
          body: JSON.stringify(getPurchase)
        })
      })

      await page.getByRole("button",{ name: "Buy"}).click({force :true})
      
      await page.waitForTimeout(1000);

      await page.evaluate(() => {
        window.location.href = '/pro/dashboard';
      });

      await page.waitForTimeout(1000);

      await expect(page).toHaveURL('/pro/dashboard')

    });
  })