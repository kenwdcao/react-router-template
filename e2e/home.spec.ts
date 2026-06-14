import { expect, test } from "@playwright/test";

test("renders the marketing home page and auth links", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: /React Router Template/i }),
  ).toBeVisible();
  const header = page.locator("header");

  await expect(header.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
    "href",
    "/demo/dashboard",
  );
  await expect(header.getByRole("link", { name: "Sign in" })).toHaveAttribute(
    "href",
    "/login",
  );
  await expect(header.getByRole("link", { name: "Register" })).toHaveAttribute(
    "href",
    "/register",
  );
});
