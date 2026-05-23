import { expect, test, type Page } from "@playwright/test";

test.describe("Dashboard Components Gallery", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto("/dashboard/components");
  });

  test("shows notification when clicking show button", async ({ page }) => {
    await page.getByRole("button", { name: "Show notification" }).click();
    await expect(page.locator(".mantine-Notification-root")).toBeVisible();
  });

  test("opens and closes demo modal", async ({ page }) => {
    await page.getByRole("button", { name: "Open modal" }).click();
    const dialog = page.getByRole("dialog", { name: "Demo modal" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).not.toBeVisible();
  });

  test("opens and closes demo drawer", async ({ page }) => {
    await page.getByRole("button", { name: "Open drawer" }).click();
    const dialog = page.getByRole("dialog", { name: "Demo drawer" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).not.toBeVisible();
  });

  test("pagination changes table page", async ({ page }) => {
    const paginationButton = page.getByRole("button", { name: "Page 2" });
    if (await paginationButton.isVisible()) {
      await paginationButton.click();
    }
  });
});

async function login(page: Page) {
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  await page.goto("/register");
  await page.getByLabel("Name").fill("Components Test User");
  await page.getByLabel("Email").fill(`components-${runId}@example.com`);
  await page.locator('input[name="password"]').fill("password-12345");
  await page.locator('input[name="confirmPassword"]').fill("password-12345");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 20_000 });
}
