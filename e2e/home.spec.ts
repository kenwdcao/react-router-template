import { expect, test } from "@playwright/test";

test("renders the marketing home page and auth links", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("React Router Template").first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: "React Router Docs" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign in" })).toHaveAttribute(
    "href",
    "/login",
  );
  await expect(page.getByRole("link", { name: "Register" })).toHaveAttribute(
    "href",
    "/register",
  );
});
