import { data, redirect } from "react-router";
import { z } from "zod";
import { auth, getAuthErrorMessage } from "~/lib/auth/index.server";
import { readFormString } from "~/lib/utils";

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

const emailSchema = z.email();

export async function handleRegisterAction(request: Request) {
  const formData = await request.formData();
  const name = readFormString(formData, "name");
  const email = readFormString(formData, "email");
  const password = readFormString(formData, "password", { trim: false });
  const confirmPassword = readFormString(formData, "confirmPassword", {
    trim: false,
  });
  const errors: NonNullable<RegisterActionData["errors"]> = {};

  if (!name) {
    errors.name = "Name is required";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (!emailSchema.safeParse(email).success) {
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
