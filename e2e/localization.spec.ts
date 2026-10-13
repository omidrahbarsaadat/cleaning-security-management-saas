import { expect, test } from "@playwright/test";

test("root route redirects to German with the regional document language", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/de$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "de-DE");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("Persian route renders right-to-left and switches to English", async ({ page }) => {
  await page.goto("/fa");

  await expect(page.locator("html")).toHaveAttribute("lang", "fa-IR");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.getByRole("link", { name: "English" }).click();

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
});

test("English route is available and exposes German language switching", async ({ page }) => {
  await page.goto("/en");

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("link", { name: "Deutsch" })).toBeVisible();
});
