import { describe, expect, it, vi } from "vitest";
import { handleRegisterAction } from "~/lib/auth/register-action.server";
import { auth } from "~/lib/auth/server";

vi.mock("~/lib/auth/server", () => ({
  auth: {
    api: {
      signUpEmail: vi.fn(),
    },
  },
}));

const signUpEmail = vi.mocked(auth.api.signUpEmail);

describe("handleRegisterAction", () => {
  it("returns validation errors before calling better-auth", async () => {
    const response = await handleRegisterAction(
      new Request("http://localhost:5173/register", {
        method: "POST",
        body: new URLSearchParams({
          name: "",
          email: "invalid",
          password: "short",
          confirmPassword: "different",
        }),
      }),
    );

    expect(signUpEmail).not.toHaveBeenCalled();
    expect(response).not.toBeInstanceOf(Response);
    if (response instanceof Response) {
      throw new Error("Expected validation data");
    }
    expect(response.init?.status).toBe(400);
    expect(response.data.errors).toMatchObject({
      name: "Name is required",
      email: "Invalid email",
      password: "Password must be at least 8 characters",
      confirmPassword: "Passwords do not match",
    });
  });
});
