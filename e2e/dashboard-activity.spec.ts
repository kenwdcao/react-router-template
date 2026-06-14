import { expect, test, type Page } from "@playwright/test";
import { createProjectViaModal } from "./helpers/projects";

test.describe("Dashboard Activity", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("shows empty state when no projects exist", async ({ page }) => {
    await page.goto("/demo/dashboard/activity");
    await expect(
      page.locator("main").getByText("No activity yet").first(),
    ).toBeVisible();
  });

  test("shows populated timeline after creating a project", async ({
    page,
  }) => {
    // Create a project first
    await page.goto("/demo/dashboard/projects");
    await createProjectViaModal(page, {
      name: "Activity test project",
      description: "Testing activity timeline",
    });

    // Check activity page
    await page.goto("/demo/dashboard/activity");
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
  // Registration now redirects to the homepage (default post-auth destination).
  await expect(page).toHaveURL(/\/$/, { timeout: 20_000 });
}
