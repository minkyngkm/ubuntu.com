import { expect, Page } from "@playwright/test";

export const mockChangeCountry = async (page:Page, url: string, country:string) => {
    await page.route(url, async (route) => {
    const request = route.request();
    const postData = await request.postDataJSON();
    expect(request.method()).toBe("POST");
    expect(await request.postDataJSON()).toEqual(
      expect.objectContaining({
      ...postData, 
        address: {
          ...postData.address,
          "country" : country
        }
      })
    )
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(postData),
    });
  });
};

export const mockPreview = async (page:Page, url: string, payload:any) => {
  await page.route(url, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(payload)
    });
  });
};

export const mockPostCustomerInfo = async (page:Page, url: string, payload) => {
  await page.route(url, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(payload)
    });
  });
};