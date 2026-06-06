import { describe, expect, it } from "vitest";
import { parseEnv } from "~/lib/env.server";

describe("parseEnv", () => {
  it("parses required server environment variables", () => {
    expect(
      parseEnv({
        DATABASE_URL: "postgresql://app:password@localhost:5432/app_test",
        BETTER_AUTH_SECRET: "secret-at-least-thirty-two-characters",
        BETTER_AUTH_URL: "http://localhost:5173",
        BETTER_AUTH_TRUSTED_ORIGINS:
          "http://localhost:5173, https://example.com",
      }),
    ).toEqual({
      DATABASE_URL: "postgresql://app:password@localhost:5432/app_test",
      BETTER_AUTH_SECRET: "secret-at-least-thirty-two-characters",
      BETTER_AUTH_URL: "http://localhost:5173",
      BETTER_AUTH_TRUSTED_ORIGINS: [
        "http://localhost:5173",
        "https://example.com",
      ],
      MICROSOFT_CLIENT_ID: undefined,
      MICROSOFT_CLIENT_SECRET: undefined,
      MICROSOFT_TENANT_ID: undefined,
    });
  });

  it("treats blank optional AI variables as unconfigured", () => {
    expect(
      parseEnv({
        DATABASE_URL: "postgresql://app:password@localhost:5432/app_test",
        BETTER_AUTH_SECRET: "secret-at-least-thirty-two-characters",
        AI_BASE_URL: "",
        AI_API_KEY: "   ",
        AI_MODEL_ID: "",
      }),
    ).toMatchObject({
      AI_BASE_URL: undefined,
      AI_API_KEY: undefined,
      AI_MODEL_ID: undefined,
    });
  });

  it("treats blank Microsoft variables as unconfigured", () => {
    expect(
      parseEnv({
        DATABASE_URL: "postgresql://app:password@localhost:5432/app_test",
        BETTER_AUTH_SECRET: "secret-at-least-thirty-two-characters",
        MICROSOFT_CLIENT_ID: "",
        MICROSOFT_CLIENT_SECRET: "   ",
      }),
    ).toMatchObject({
      MICROSOFT_CLIENT_ID: undefined,
      MICROSOFT_CLIENT_SECRET: undefined,
    });
  });

  it("parses Microsoft variables when provided", () => {
    expect(
      parseEnv({
        DATABASE_URL: "postgresql://app:password@localhost:5432/app_test",
        BETTER_AUTH_SECRET: "secret-at-least-thirty-two-characters",
        MICROSOFT_CLIENT_ID: "client-id-value",
        MICROSOFT_CLIENT_SECRET: "client-secret-value",
        MICROSOFT_TENANT_ID: "tenant-guid",
      }),
    ).toMatchObject({
      MICROSOFT_CLIENT_ID: "client-id-value",
      MICROSOFT_CLIENT_SECRET: "client-secret-value",
      MICROSOFT_TENANT_ID: "tenant-guid",
    });
  });

  it("rejects a missing auth secret", () => {
    expect(() =>
      parseEnv({
        DATABASE_URL: "postgresql://app:password@localhost:5432/app_test",
        BETTER_AUTH_SECRET: "",
      }),
    ).toThrow(/BETTER_AUTH_SECRET/);
  });
});
