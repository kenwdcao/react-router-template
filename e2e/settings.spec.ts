import { expect, test, type Page } from "@playwright/test";

test.describe("Settings", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto("/settings");
  });

  test("renders all setting tabs", async ({ page }) => {
    await expect(page.getByRole("tab", { name: "Profile" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Appearance" })).toBeVisible();
    await expect(
      page.getByRole("tab", { name: "Notifications" }),
    ).toBeVisible();
  });

  test("profile tab shows user info", async ({ page }) => {
    await expect(page.locator("main").getByLabel("Name").first()).toBeVisible();
    await expect(
      page.locator("main").getByLabel("Email").first(),
    ).toBeVisible();
  });

  test("appearance tab shows color options", async ({ page }) => {
    await page.getByRole("tab", { name: "Appearance" }).click();
    await expect(page.getByText("Color scheme")).toBeVisible();
  });

  test("notifications tab shows preview notice", async ({ page }) => {
    await page.getByRole("tab", { name: "Notifications" }).click();
    await expect(page.getByText("Preview only")).toBeVisible();
  });
});

async function login(page: Page) {
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  await page.goto("/register");
  await page.getByLabel("Name").fill("Settings Test User");
  await page.getByLabel("Email").fill(`settings-${runId}@example.com`);
  await page.locator('input[name="password"]').fill("password-12345");
  await page.locator('input[name="confirmPassword"]').fill("password-12345");
  await page.getByRole("button", { name: "Create account" }).click();
  // Registration now redirects to the homepage (default post-auth destination).
  await expect(page).toHaveURL(/\/$/, { timeout: 20_000 });
}
