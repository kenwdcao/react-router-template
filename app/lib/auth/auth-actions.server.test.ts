import { describe, expect, it, vi } from "vitest";
import { handleLoginAction } from "~/lib/auth/login-action.server";
import { handleRegisterAction } from "~/lib/auth/register-action.server";
import { auth } from "~/lib/auth/server";

vi.mock("~/lib/auth/server", () => ({
  auth: {
    api: {
      signInEmail: vi.fn(),
      signUpEmail: vi.fn(),
    },
  },
}));

const signInEmail = vi.mocked(auth.api.signInEmail);
const signUpEmail = vi.mocked(auth.api.signUpEmail);

describe("handleLoginAction", () => {
  it("returns validation errors before calling better-auth", async () => {
    const response = await handleLoginAction(
      new Request("http://localhost:5173/login", {
        method: "POST",
        body: new URLSearchParams({ email: "", password: "" }),
      }),
    );

    expect(signInEmail).not.toHaveBeenCalled();
    expect(response).not.toBeInstanceOf(Response);
    if (response instanceof Response) {
      throw new Error("Expected validation data");
    }
    expect(response.init?.status).toBe(400);
    expect(response.data.errors).toMatchObject({
      email: "Email is required",
      password: "Password is required",
    });
  });
});

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
