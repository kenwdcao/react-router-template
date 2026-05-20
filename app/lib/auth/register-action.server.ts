import { data, redirect } from "react-router";
import { getAuthErrorMessage } from "~/lib/auth/errors.server";
import { auth } from "~/lib/auth/server";

export type RegisterActionData = {
  errors?: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
  };
  values?: {
    name: string;
    email: string;
  };
};

export async function handleRegisterAction(request: Request) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const errors: NonNullable<RegisterActionData["errors"]> = {};

  if (!name) {
    errors.name = "Name is required";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (!email.includes("@")) {
    errors.email = "Invalid email";
  }

  if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (Object.keys(errors).length > 0) {
    return data<RegisterActionData>(
      { errors, values: { name, email } },
      { status: 400 },
    );
  }

  try {
    const result = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: request.headers,
      returnHeaders: true,
    });

    return redirect("/dashboard", {
      headers: result.headers ?? undefined,
    });
  } catch (error) {
    return data<RegisterActionData>(
      {
        errors: {
          form: getAuthErrorMessage(error, "Could not create account"),
        },
        values: { name, email },
      },
      { status: 400 },
    );
  }
}
