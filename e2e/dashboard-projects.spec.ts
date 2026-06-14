import { expect, test, type Page } from "@playwright/test";
import { createProjectViaModal } from "./helpers/projects";

const ACTION_TIMEOUT = 20_000;

test("redirects anonymous project access to sign in", async ({ page }) => {
  await page.goto("/demo/dashboard/projects");

  await expect(page).toHaveURL(
    /\/login\?redirectTo=%2Fdemo%2Fdashboard%2Fprojects$/,
  );
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
});

test("registers users and manages owner-scoped projects", async ({ page }) => {
  test.setTimeout(60_000);

  const runId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const ownerProjectName = `Owner project ${runId}`;
  const projectName = `Project ${runId}`;
  const updatedProjectName = `Updated project ${runId}`;

  await registerUser(page, {
    email: `owner-${runId}@example.com`,
    name: "Owner User",
    password: "password-12345",
  });
  await page.goto("/demo/dashboard/projects");

  await createProjectViaModal(page, {
    name: ownerProjectName,
    description: "Only visible to owner one",
  });

  await page.context().clearCookies();

  await registerUser(page, {
    email: `member-${runId}@example.com`,
    name: "Member User",
    password: "password-12345",
  });
  await page.goto("/demo/dashboard/projects");
  await expect(page.getByText(ownerProjectName, { exact: true })).toHaveCount(
    0,
  );
  await expect(
    page.locator("main").getByText("No projects").first(),
  ).toBeVisible();

  // Create project via modal
  await createProjectViaModal(page, {
    name: projectName,
    description: "Initial description",
  });
  await expect(page.locator("main").getByText("1 total").first()).toBeVisible();

  // Edit project via drawer
  await page
    .getByRole("table")
    .getByRole("button", { name: `Edit ${projectName}` })
    .click();
  const editDialog = page.getByRole("dialog", { name: /Edit/ });
  await expect(editDialog).toBeVisible();
  await editDialog.getByLabel("Name").fill(updatedProjectName);
  await editDialog.getByLabel("Description").fill("Updated description");
  await editDialog.getByRole("button", { name: "Save changes" }).click();
  await expect(
    page.getByRole("table").getByText(updatedProjectName),
  ).toBeVisible({ timeout: ACTION_TIMEOUT });
  await expect(editDialog).not.toBeVisible();
  await expect(page.getByText(projectName, { exact: true })).toHaveCount(0);

  // Delete project via confirm modal
  await page
    .getByRole("table")
    .getByRole("button", { name: `Delete ${updatedProjectName}` })
    .click();
  const deleteDialog = page.getByRole("dialog", { name: /Delete project/ });
  await expect(deleteDialog).toBeVisible();
  await deleteDialog.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText(updatedProjectName, { exact: true })).toHaveCount(
    0,
  );
  await expect(
    page.locator("main").getByText("No projects").first(),
  ).toBeVisible();
});

async function registerUser(
  page: Page,
  user: { email: string; name: string; password: string },
) {
  await page.goto("/register");
  await page.getByLabel("Name").fill(user.name);
  await page.getByLabel("Email").fill(user.email);
  await page.locator('input[name="password"]').fill(user.password);
  await page.locator('input[name="confirmPassword"]').fill(user.password);
  await page.getByRole("button", { name: "Create account" }).click();
  // Registration now redirects to the homepage (default post-auth destination).
  await expect(page).toHaveURL(/\/$/, { timeout: 20_000 });
}
