import { expect, test, type Page } from "@playwright/test";

test.describe("Dashboard Activity", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("shows empty state when no projects exist", async ({ page }) => {
    await page.goto("/dashboard/activity");
    await expect(page.getByText("No activity yet")).toBeVisible();
  });

  test("shows populated timeline after creating a project", async ({ page }) => {
    // Create a project first
    await page.goto("/dashboard/projects");
    await page.getByRole("button", { name: "Create project" }).click();
    const createDialog = page.getByRole("dialog", { name: "Create project" });
    await expect(createDialog).toBeVisible();
    await createDialog.getByLabel("Project name").fill("Activity test project");
    await createDialog.getByLabel("Description").fill("Testing activity timeline");
    await createDialog.getByRole("button", { name: "Create project" }).click();
    await expect(createDialog).not.toBeVisible();

    // Check activity page
    await page.goto("/dashboard/activity");
    await expect(page.getByText("Activity test project")).toBeVisible();
  });
});

async function login(page: Page) {
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  await page.goto("/register");
  await page.getByLabel("Name").fill("Activity Test User");
  await page.getByLabel("Email").fill(`activity-${runId}@example.com`);
  await page.locator('input[name="password"]').fill("password-12345");
  await page.locator('input[name="confirmPassword"]').fill("password-12345");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 20_000 });
}
