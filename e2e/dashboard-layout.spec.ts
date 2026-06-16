import { expect, test, type Page } from "@playwright/test";

test.describe("Dashboard Layout", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto("/demo/dashboard");
  });

  test("sidebar groups are visible", async ({ page }) => {
    await expect(page.getByText("Workspace")).toBeVisible();
    await expect(page.getByText("Demos")).toBeVisible();
  });

  test("sidebar navigation items are present", async ({ page }) => {
    const navigation = page.getByRole("navigation");
    await expect(
      navigation.getByRole("link", { name: "Overview" }),
    ).toBeVisible();
    await expect(
      navigation.getByRole("link", { name: "Projects", exact: true }),
    ).toBeVisible();
    await expect(
      navigation.getByRole("link", { name: "Activity", exact: true }),
    ).toBeVisible();
    await expect(
      navigation.getByRole("link", { name: "Components", exact: true }),
    ).toBeVisible();
  });

  test("breadcrumbs reflect current route", async ({ page }) => {
    await page.goto("/demo/dashboard/projects");
    const main = page.getByRole("main");
    await expect(main.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(main.getByRole("heading", { name: "Projects" })).toBeVisible();
  });

  test("active nav link is highlighted", async ({ page }) => {
    await page.goto("/demo/dashboard/projects");
    const projectsLink = page.getByRole("link", {
      name: "Projects",
      exact: true,
    });
    await expect(projectsLink).toHaveAttribute("data-active", /.*/);
  });

  test("user avatar shows online indicator", async ({ page }) => {
    await expect(page.locator(".mantine-Indicator-indicator")).toBeVisible();
  });
});

async function login(page: Page) {
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  await page.goto("/register");
  await page.getByLabel("Name").fill("Layout Test User");
  await page.getByLabel("Email").fill(`layout-${runId}@example.com`);
  await page.locator('input[name="password"]').fill("password-12345");
  await page.locator('input[name="confirmPassword"]').fill("password-12345");
  await page.getByRole("button", { name: "Create account" }).click();
  // Registration now redirects to the homepage (default post-auth destination).
  await expect(page).toHaveURL(/\/$/, { timeout: 20_000 });
}
