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
