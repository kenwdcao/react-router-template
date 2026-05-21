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
  await createProject(page, ownerProjectName, "Only visible to owner one");
  await expect(projectNameInput(page, ownerProjectName)).toBeVisible();

  await page.context().clearCookies();

  await registerUser(page, {
    email: `member-${runId}@example.com`,
    name: "Member User",
    password: "password-12345",
  });
  await page.goto("/dashboard/projects");
  await expect(projectNameInput(page, ownerProjectName)).not.toBeVisible();
  await expect(page.getByText("No projects yet.")).toBeVisible();

  await createProject(page, projectName, "Initial description");
  await expect(projectNameInput(page, projectName)).toBeVisible();
  await expect(page.getByText("1 total")).toBeVisible();

  const projectForm = page.locator("form").filter({
    has: projectNameInput(page, projectName),
  });
  await projectForm.getByLabel("Name").fill(updatedProjectName);
  await projectForm.getByLabel("Description").fill("Updated description");
  await projectForm.getByRole("button", { name: "Save" }).click();
  await expect(projectNameInput(page, updatedProjectName)).toBeVisible();
  await expect(projectNameInput(page, projectName)).not.toBeVisible();

  const updatedProjectForm = page.locator("form").filter({
    has: projectNameInput(page, updatedProjectName),
  });
  await updatedProjectForm.getByRole("button", { name: "Delete" }).click();
  await expect(projectNameInput(page, updatedProjectName)).not.toBeVisible();
  await expect(page.getByText("No projects yet.")).toBeVisible();
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

async function createProject(page: Page, name: string, description: string) {
  await page.getByLabel("Project name").fill(name);
  await page.getByLabel("Description").first().fill(description);
  await page.getByRole("button", { name: "Create project" }).click();
  await expect(projectNameInput(page, name)).toBeVisible();
}

function projectNameInput(page: Page, name: string) {
  return page.locator(`input[name="name"][value="${cssAttributeValue(name)}"]`);
}

function cssAttributeValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
