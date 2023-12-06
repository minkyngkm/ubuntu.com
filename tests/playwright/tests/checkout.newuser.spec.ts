import { test, expect } from "@playwright/test";
import { selectProducts, acceptCookiePolicy, clickRecaptcha, acceptTerms } from "../helplers/commands";
import {customerInfoPost, getPurchaseResponse, paymentMethodResponse, postCalculate, postCalculateWithTax, postEnsureResponse, postInvoiceResponse, postPurchase, postPurchasePreview, subscriptions } from "../helplers/mockData";
import { newUserAuthFile } from "../global-setup";
import * as fs from 'fs';

const ENDPOINTS = {
    calculate: "/account/canonical-ua/purchase/calculate*",
    postPurchase: "/pro/purchase*",
    preview: "/pro/purchase/preview*",
    ensure: "/account/purchase-account*",
    customerInfo: "/account/customer-info*",
    getPurchase: "/account/purchases/*",
    postInvoice: "/account/purchases/*/retry*",
    getsubscription: "/pro/user-subscriptions*",
    marketo: "/marketo/submit",
    stripePaymentMethod : "https://api.stripe.com/v1/payment_methods",
    login: "https://login.ubuntu.com/*/+login"
  };

  test.describe("New User Checkout - Region and taxes", () => {
    test("It should show correct non-VAT price", async ({page}) => {
      const auth = JSON.parse(fs.readFileSync(newUserAuthFile, 'utf-8'));
      const baseURL = "http://0.0.0.0:8001"
      await page.route(ENDPOINTS.login, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
        });
      });
      
      await page.goto("/pro/subscribe")
      await acceptCookiePolicy(page)
      await selectProducts(page);
      await page.getByRole("button", { name: "Buy now" }).click();
      await page.fill('input[name="email"]', "test@canonical.com" as string) ;
      await page.fill('input[name="password"]', "test" as string);
      await page.click('button[type="submit"]')

      await page.waitForTimeout(1000);
      
      await page.context().addCookies(auth.cookies);
      await page.goto(baseURL + '/account/checkout');
      await page.locator('button[type="submit"]').click()

      await page.waitForLoadState('domcontentloaded');

      await expect(page).toHaveURL('/account/checkout');
      await expect(page.getByRole('button', { name: 'Save' })).toHaveClass("p-action-button p-button is-disabled")
      await expect(page.locator('[data-testid="field-org-name"]')).toBeVisible();
      await expect(page.locator('[data-testid="field-address"]')).toBeVisible();
      await expect(page.locator('[data-testid="field-city"]')).toBeVisible();
      await expect(page.locator('[data-testid="field-post-code"]')).toBeVisible();

      await expect(page.getByRole('button', { name: 'Save', exact: true })).toHaveAttribute("disabled")
      await page.getByLabel("Country/Region:").selectOption({ label: 'Japan' })
      await page.route(ENDPOINTS.calculate,  async (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(postCalculate)
        });
      });
      await page.locator(':nth-match(:text("Save"), 1)').click();
    
      await page.waitForTimeout(1000);
      await expect(page.getByRole('button', { name: 'Edit', exact: true })).toBeVisible();
      const country = await page.$('[data-testid="country"]')
      const countryText = await country?.innerText();
      expect(countryText).toBe("Japan")

      await page.waitForTimeout(1000);

      expect(await page.$('[data-testid="total"]')).toBeNull();
      expect(await page.$('[data-testid="tax"]')).toBeNull();
    })

  test("It should show correct VAT price", async ({page}) => {
    const auth = JSON.parse(fs.readFileSync(newUserAuthFile, 'utf-8'));
    const baseURL = "http://0.0.0.0:8001"
    await page.route(ENDPOINTS.login, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
      });
    });
    
    await page.goto("/pro/subscribe")
    await acceptCookiePolicy(page)
    await selectProducts(page);
    await page.getByRole("button", { name: "Buy now" }).click();
    await page.fill('input[name="email"]', "test@canonical.com" as string) ;
    await page.fill('input[name="password"]', "test" as string);
    await page.click('button[type="submit"]')

    await page.waitForTimeout(1000);
    
    await page.context().addCookies(auth.cookies);
    await page.goto(baseURL + '/account/checkout');
    await page.locator('button[type="submit"]').click()

    await page.waitForLoadState('domcontentloaded');
    
    await expect(page).toHaveURL('/account/checkout');
    await expect(page.getByRole('button', { name: 'Save' })).toHaveClass("p-action-button p-button is-disabled")
    await expect(page.locator('[data-testid="field-org-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="field-address"]')).toBeVisible();
    await expect(page.locator('[data-testid="field-city"]')).toBeVisible();
    await expect(page.locator('[data-testid="field-post-code"]')).toBeVisible();

    await expect(page.getByRole('button', { name: 'Save', exact: true })).toHaveAttribute("disabled")
    await page.getByLabel("Country/Region:").selectOption({ label: 'France' })
    await page.route(ENDPOINTS.calculate,  async (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(postCalculateWithTax)
      });
    });
    await page.locator(':nth-match(:text("Save"), 1)').click();
  
    await page.waitForTimeout(1000);
    await expect(page.getByRole('button', { name: 'Edit', exact: true })).toBeVisible();
    const country = await page.$('[data-testid="country"]')
    const countryText = await country?.innerText();

    expect(countryText).toBe("France")

    await expect(page.locator('[data-testid="tax"]')).toBeVisible()
    await expect(page.locator('[data-testid="total"]')).toBeVisible();
  })
})

test.describe("New User - Checkout purchase", ()=>{
  test("New User should purchase", async ({page}) => {
    const auth = JSON.parse(fs.readFileSync(newUserAuthFile, 'utf-8'));
    const baseURL = "http://0.0.0.0:8001"
    await page.route('https://login.ubuntu.com/*/+login', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
      });
    });
    
    await page.goto("/pro/subscribe")
    await acceptCookiePolicy(page)
    await selectProducts(page);
    await page.getByRole("button", { name: "Buy now" }).click();
    await page.fill('input[name="email"]', "username@canonical.com" as string) ;
    await page.fill('input[name="password"]', "password" as string);
    await page.click('button[type="submit"]')

    await page.waitForTimeout(1000);
    
    await page.context().addCookies(auth.cookies);
    await page.goto(baseURL + '/account/checkout');
    await page.locator('button[type="submit"]').click();

    await page.waitForLoadState('domcontentloaded');
    
    await expect(page).toHaveURL('/account/checkout');
    await page.getByLabel("Country/Region:").selectOption({ label: 'France' })
    await page.route(ENDPOINTS.calculate,  async (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(postCalculateWithTax)
      });
    });
    await page.locator(':nth-match(:text("Save"), 1)').click();
  
    await expect(page.locator('[data-testid="tax"]')).toBeVisible()
    await expect(page.locator('[data-testid="total"]')).toBeVisible();

    const stripeFrame = page.frameLocator('iframe').first();
    await stripeFrame.locator('[placeholder="Card number"]').fill('4242424242424242');
    await stripeFrame.locator('[placeholder="MM / YY"]').fill('42/42');
    await stripeFrame.locator('[placeholder="CVC"]').fill('424');
    await stripeFrame.locator('[placeholder="ZIP"]').fill('42424');
    await page.getByLabel("Name:").fill("Abcd")
    await page.getByLabel("Organisation:").fill("Abcde");
    await page.getByLabel("Address:").fill("Abcd");
    await page.getByLabel("City:").fill("Abcd");
    await page.getByLabel("Postal code:").fill("Abcd");
    await page.getByText("Pay now").click();
  
    await acceptTerms(page)
    await clickRecaptcha(page)

    await page.waitForTimeout(1000);

    await page.route(ENDPOINTS.ensure, async (route)=>{
      route.fulfill({
        status: 200,
        body: JSON.stringify(postEnsureResponse)
      });
    })
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
        body: JSON.stringify(getPurchaseResponse)
      })
    })
    await page.route(ENDPOINTS.customerInfo, async(route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(customerInfoPost)
      })
    })
    await page.route(ENDPOINTS.postInvoice, async(route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(postInvoiceResponse)
      })
    })
    await page.route(ENDPOINTS.stripePaymentMethod, async(route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(paymentMethodResponse)
      })
    })
    await page.route(ENDPOINTS.marketo, async(route) => {
      route.fulfill({
        status: 200,
      })
    });

    await page.route(ENDPOINTS.getsubscription, async(route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(subscriptions)
      })
    })
    
    await page.getByRole("button",{ name: "Buy"}).click()
    
    await page.evaluate(() => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', ENDPOINTS.marketo);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          window.location.href = "/pro/dashboard";
        }
      };
      xhr.send();
    });
    await expect(page).toHaveURL('/pro/dashboard')
    await page.waitForLoadState("domcontentloaded")
    expect(page.locator('h5').filter({ hasText: 'Ubuntu Pro (Infra-only)' })).toBeVisible();
    });
  })