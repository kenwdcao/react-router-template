import {
  Anchor,
  Button,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  Form,
  Link,
  data,
  redirect,
  useActionData,
  useNavigation,
} from "react-router";
import { auth } from "~/lib/auth/server";
import type { Route } from "./+types/register";

type RegisterActionData = {
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

export function meta() {
  return [{ title: "Create Account" }];
}

export async function action({ request }: Route.ActionArgs) {
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

export default function Register() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Stack gap="lg" mt="xl">
      <Title ta="center">Create an account</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" component={Link} to="/login">
          Sign in
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md">
        <Form method="post" replace>
          <Stack>
            <TextInput
              label="Name"
              name="name"
              placeholder="Your name"
              defaultValue={actionData?.values?.name}
              error={actionData?.errors?.name}
              required
            />
            <TextInput
              label="Email"
              name="email"
              placeholder="you@example.com"
              defaultValue={actionData?.values?.email}
              error={actionData?.errors?.email}
              required
            />
            <PasswordInput
              label="Password"
              name="password"
              placeholder="At least 8 characters"
              error={actionData?.errors?.password}
              required
            />
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Repeat your password"
              error={actionData?.errors?.confirmPassword}
              required
            />
            {actionData?.errors?.form && (
              <Text c="red" size="sm">
                {actionData.errors.form}
              </Text>
            )}
          </Stack>
          <Button type="submit" fullWidth mt="xl" loading={isSubmitting}>
            Create account
          </Button>
        </Form>
      </Paper>
    </Stack>
  );
}

function getAuthErrorMessage(error: unknown, fallback: string) {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
}
