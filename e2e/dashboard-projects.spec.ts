import { expect, test, type Page } from "@playwright/test";

test("redirects anonymous project access to sign in", async ({ page }) => {
  await page.goto("/dashboard/projects");

  await expect(page).toHaveURL(/\/login\?redirectTo=%2Fdashboard%2Fprojects$/);
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
  await page.goto("/dashboard/projects");

  // Create project via modal
  await page.getByRole("button", { name: "Create project" }).click();
  const createDialog = page.getByRole("dialog", { name: "Create project" });
  await expect(createDialog).toBeVisible();
  await createDialog.getByLabel("Project name").fill(ownerProjectName);
  await createDialog.getByLabel("Description").fill("Only visible to owner one");
  await createDialog.getByRole("button", { name: "Create project" }).click();
  await expect(createDialog).not.toBeVisible();
  await expect(page.getByText(ownerProjectName)).toBeVisible();

  await page.context().clearCookies();

  await registerUser(page, {
    email: `member-${runId}@example.com`,
    name: "Member User",
    password: "password-12345",
  });
  await page.goto("/dashboard/projects");
  await expect(page.getByText(ownerProjectName)).not.toBeVisible();
  await expect(page.getByText("No projects")).toBeVisible();

  // Create project via modal
  await page.getByRole("button", { name: "Create project" }).click();
  const createDialog2 = page.getByRole("dialog", { name: "Create project" });
  await expect(createDialog2).toBeVisible();
  await createDialog2.getByLabel("Project name").fill(projectName);
  await createDialog2.getByLabel("Description").fill("Initial description");
  await createDialog2.getByRole("button", { name: "Create project" }).click();
  await expect(createDialog2).not.toBeVisible();
  await expect(page.getByText(projectName)).toBeVisible();
  await expect(page.getByText("1 total")).toBeVisible();

  // Edit project via drawer
  await page.getByRole("button", { name: `Edit ${projectName}` }).click();
  const editDialog = page.getByRole("dialog", { name: /Edit/ });
  await expect(editDialog).toBeVisible();
  await editDialog.getByLabel("Name").fill(updatedProjectName);
  await editDialog.getByLabel("Description").fill("Updated description");
  await editDialog.getByRole("button", { name: "Save" }).click();
  await expect(editDialog).not.toBeVisible();
  await expect(page.getByText(updatedProjectName)).toBeVisible();
  await expect(page.getByText(projectName)).not.toBeVisible();

  // Delete project via confirm modal
  await page.getByRole("button", { name: `Delete ${updatedProjectName}` }).click();
  const deleteDialog = page.getByRole("dialog", { name: "Delete project" });
  await expect(deleteDialog).toBeVisible();
  await deleteDialog.getByRole("button", { name: "Confirm" }).click();
  await expect(page.getByText(updatedProjectName)).not.toBeVisible();
  await expect(page.getByText("No projects")).toBeVisible();
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
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 20_000 });
}
