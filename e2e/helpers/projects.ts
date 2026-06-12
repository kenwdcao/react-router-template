import { expect, type Page } from "@playwright/test";

const ACTION_TIMEOUT = 20_000;

export async function createProjectViaModal(
  page: Page,
  { name, description }: { name: string; description: string },
) {
  await page.getByRole("button", { name: "Create project" }).click();
  const dialog = page.getByRole("dialog", { name: "Create project" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Project name").fill(name);
  await dialog.getByLabel("Description").fill(description);
  await dialog.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("table").getByText(name)).toBeVisible({
    timeout: ACTION_TIMEOUT,
  });
  await expect(dialog).not.toBeVisible();
}
