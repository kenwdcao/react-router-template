import { expect, test, type APIResponse, type Page } from "@playwright/test";

test.describe("Dashboard Chat", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("shows setup help when AI is not configured", async ({ page }) => {
    await page.goto("/dashboard/chat");
    const setupHeading = page.getByRole("heading", {
      name: "Set up AI to enable chat",
    });

    if (!(await setupHeading.isVisible().catch(() => false))) {
      test.skip(true, "AI is configured; setup help is not rendered.");
    }

    await expect(setupHeading).toBeVisible();
    await expect(page.getByText("AI_BASE_URL")).toBeVisible();
    await expect(page.getByText("AI_API_KEY")).toBeVisible();
    await expect(page.getByText("AI_MODEL_ID")).toBeVisible();
  });

  test("returns 400 for malformed chat API requests", async ({ page }) => {
    const badJsonResponse = await page.context().request.post("/api/chat", {
      data: Buffer.from("{not-json"),
      headers: {
        "content-type": "application/json",
      },
    });
    await expectJsonError(
      badJsonResponse,
      400,
      "Request body must be valid JSON.",
    );

    const badShapeResponse = await page.context().request.post("/api/chat", {
      data: {
        messages: [{ role: "user", content: "old message shape" }],
      },
    });
    await expectJsonError(
      badShapeResponse,
      400,
      "Request body must include a valid non-empty AI SDK UI messages array.",
    );

    const emptyMessagesResponse = await page
      .context()
      .request.post("/api/chat", {
        data: {
          messages: [],
        },
      });
    await expectJsonError(
      emptyMessagesResponse,
      400,
      "Request body must include a valid non-empty AI SDK UI messages array.",
    );
  });

  test("returns 503 for chat API requests when AI is not configured", async ({
    page,
  }) => {
    await page.goto("/dashboard/chat");
    const setupHeading = page.getByRole("heading", {
      name: "Set up AI to enable chat",
    });

    if (!(await setupHeading.isVisible().catch(() => false))) {
      test.skip(true, "AI is configured; skipping unconfigured API path.");
    }

    const response = await page.context().request.post("/api/chat", {
      data: {
        messages: [
          {
            id: "message-1",
            role: "user",
            parts: [{ type: "text", text: "What is this template?" }],
          },
        ],
      },
    });

    await expectJsonError(
      response,
      503,
      "AI is not configured. Set AI_BASE_URL, AI_API_KEY, and AI_MODEL_ID in .env",
    );
  });
});

async function expectJsonError(
  response: APIResponse,
  status: number,
  error: string,
) {
  expect(response.status()).toBe(status);
  await expect(response).not.toBeOK();
  expect(response.headers()["content-type"]).toContain("application/json");
  expect(await response.json()).toEqual({ error });
}

async function login(page: Page) {
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  await page.goto("/register");
  await page.getByLabel("Name").fill("Chat Test User");
  await page.getByLabel("Email").fill(`chat-${runId}@example.com`);
  await page.locator('input[name="password"]').fill("password-12345");
  await page.locator('input[name="confirmPassword"]').fill("password-12345");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 20_000 });
}
