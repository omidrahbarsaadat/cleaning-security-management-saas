import { expect, test } from "@playwright/test";

// Requires DATABASE_URL for the dev server. Uses unique fictional addresses.
const uniqueEmail = () => `e2e-${Date.now()}-${Math.random().toString(36).slice(2)}@example.test`;

test("protected organization route redirects anonymous users to sign-in", async ({ page }) => {
  await page.goto("/de/org/muster-dienste");
  await expect(page).toHaveURL(/\/de\/sign-in\?next=%2Fde%2Forg%2Fmuster-dienste$/);
  await expect(page.getByRole("heading", { name: "Anmelden" })).toBeVisible();
});

test("sign-up asks for email confirmation and blocks unverified sign-in", async ({ page }) => {
  const email = uniqueEmail();
  await page.goto("/de/sign-in");
  await page.getByRole("button", { name: "Noch kein Konto? Registrieren" }).click();
  await page.getByLabel("Name").fill("E2E Testperson");
  await page.getByLabel("E-Mail").fill(email);
  await page.getByLabel("Passwort").fill("Sicheres-Passwort-123");
  await page.getByRole("button", { name: "Registrieren" }).click();
  await expect(page.getByRole("status")).toHaveText(/bestätigen Sie Ihre E-Mail-Adresse/, {
    timeout: 30_000, // first request compiles the auth route in dev mode
  });

  await page.getByRole("button", { name: "Bereits registriert? Anmelden" }).click();
  await page.getByLabel("E-Mail").fill(email);
  await page.getByLabel("Passwort").fill("Sicheres-Passwort-123");
  await page.getByRole("button", { name: "Anmelden", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse.");
});

test("sign-in ignores external redirect targets", async ({ page }) => {
  await page.goto("/en/sign-in?next=https://evil.example");
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  const response = await page.request.get("/en/sign-in?next=//evil.example");
  expect(response.ok()).toBe(true);
});
