import { expect, test, type APIResponse, type Page } from "@playwright/test";

test.describe("Dashboard Chat", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("opens the AI chat sidebar from the header button", async ({ page }) => {
    await page.goto("/dashboard");

    // The header button reveals the aside on first paint.
    await page.getByRole("button", { name: "Open AI chat" }).first().click();

    // The aside renders with a region landmark.
    await expect(
      page.getByRole("region", { name: "AI chat panel" }),
    ).toBeVisible();
    // Empty-state prompt surfaces inside the aside.
    await expect(
      page.getByText("Ask anything about this template"),
    ).toBeVisible();
  });

  test("persists the chat sidebar open state across reloads", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Open AI chat" }).first().click();

    // After reload the aside must still be open (cookie-fed SSR, no flash).
    await page.reload();
    await expect(
      page.getByRole("region", { name: "AI chat panel" }),
    ).toBeVisible();
  });

  test("expands and shrinks the chat sidebar", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Open AI chat" }).first().click();

    const expand = page.getByRole("button", { name: "Expand panel" });
    await expand.click();

    await expect(
      page.getByRole("button", { name: "Shrink panel" }),
    ).toBeVisible();
  });

  test("lists preset questions in the FAQ dropdown", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Open AI chat" }).first().click();

    await page
      .getByRole("button", { name: "Frequently asked questions" })
      .click();

    await expect(
      page.getByRole("menuitem", { name: "How do I add a new route?" }),
    ).toBeVisible();
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
    // Probe the API directly to decide whether AI is configured. A valid request
    // returns 503 only when the provider is unavailable; otherwise the 503 path
    // is not exercised in this environment.
    const probe = await page.context().request.post("/api/chat", {
      data: {
        messages: [
          {
            id: "probe-1",
            role: "user",
            parts: [{ type: "text", text: "probe" }],
          },
        ],
      },
    });
    if (probe.status() !== 503) {
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
