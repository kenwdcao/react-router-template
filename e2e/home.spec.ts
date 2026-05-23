import { expect, test } from "@playwright/test";

test("renders the marketing home page and auth links", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: /React Router Template/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "View Dashboard Demo" }).first(),
  ).toHaveAttribute("href", "/dashboard");
  await expect(page.getByRole("link", { name: "Sign in" })).toHaveAttribute(
    "href",
    "/login",
  );
  await expect(page.getByRole("link", { name: "Register" })).toHaveAttribute(
    "href",
    "/register",
  );
});

test("interactive MantineShowcase feedback tab shows notification", async ({
  page,
}) => {
  await page.goto("/");

  const feedbackTab = page
    .locator("main")
    .getByRole("tab", { name: "Feedback" })
    .first();
  await feedbackTab.click();
  const showBtn = page
    .locator("main")
    .getByRole("button", { name: "Show notification" })
    .first();
  await showBtn.waitFor({ state: "visible" });
  await showBtn.click();
  await expect(page.getByText("Notification sent")).toBeVisible();
});
