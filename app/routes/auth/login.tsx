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
  useSearchParams,
} from "react-router";
import { getSafeRedirectTo } from "~/lib/auth/redirects";
import { auth } from "~/lib/auth/server";
import type { Route } from "./+types/login";

type LoginActionData = {
  errors?: {
    email?: string;
    password?: string;
    form?: string;
  };
  values?: {
    email: string;
  };
};

export function meta() {
  return [{ title: "Sign In" }];
}

export async function action({ request }: Route.ActionArgs) {
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

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const redirectTo = getSafeRedirectTo(searchParams.get("redirectTo"));
  const isSubmitting = navigation.state === "submitting";

  return (
    <Stack gap="lg" mt="xl">
      <Title ta="center">Welcome back</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don&apos;t have an account?{" "}
        <Anchor size="sm" component={Link} to="/register">
          Register
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md">
        <Form method="post" replace>
          <input
            type="hidden"
            name="redirectTo"
            value={redirectTo}
            aria-label="Redirect destination"
          />
          <Stack>
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
              placeholder="Your password"
              error={actionData?.errors?.password}
              required
            />
            {actionData?.errors?.form && (
              <Text c="red" size="sm">
                {actionData.errors.form}
              </Text>
            )}
          </Stack>
          <Button type="submit" fullWidth mt="xl" loading={isSubmitting}>
            Sign in
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
