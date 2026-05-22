import { data, redirect } from "react-router";
import { getSafeRedirectTo } from "~/lib/auth";
import { auth, getAuthErrorMessage } from "~/lib/auth/index.server";

export type LoginActionData = {
  errors?: {
    email?: string;
    password?: string;
    form?: string;
  };
  values?: {
    email: string;
  };
};

export async function handleLoginAction(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = getSafeRedirectTo(formData.get("redirectTo"));
  const errors: NonNullable<LoginActionData["errors"]> = {};

  if (!email) {
    errors.email = "Email is required";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    return data<LoginActionData>(
      { errors, values: { email } },
      { status: 400 },
    );
  }

  try {
    const result = await auth.api.signInEmail({
      body: { email, password },
      headers: request.headers,
      returnHeaders: true,
    });

    return redirect(redirectTo, {
      headers: result.headers ?? undefined,
    });
  } catch (error) {
    return data<LoginActionData>(
      {
        errors: { form: getAuthErrorMessage(error, "Invalid credentials") },
        values: { email },
      },
      { status: 400 },
    );
  }
}
