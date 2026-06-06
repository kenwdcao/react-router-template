import {
  Anchor,
  Button,
  Divider,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useState } from "react";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { getSafeRedirectTo } from "~/lib/auth";
import {
  handleLoginAction,
  isMicrosoftSSOConfigured,
} from "~/lib/auth/index.server";
import { startMicrosoftSignIn } from "~/lib/auth/microsoft-sign-in";
import { MicrosoftSignInButton } from "~/ui/components/auth/microsoft-sign-in";
import type { Route } from "./+types/login";

export function meta() {
  return [{ title: "Sign In" }];
}

export function loader() {
  return { microsoftSSO: isMicrosoftSSOConfigured };
}

export async function action({ request }: Route.ActionArgs) {
  return handleLoginAction(request);
}

export default function Login() {
  const { microsoftSSO } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const redirectTo = getSafeRedirectTo(searchParams.get("redirectTo"));
  const [microsoftLoading, setMicrosoftLoading] = useState(false);
  const [microsoftError, setMicrosoftError] = useState<string | null>(null);
  const isSubmitting = navigation.state === "submitting" || microsoftLoading;

  async function handleMicrosoftSignIn() {
    setMicrosoftError(null);
    await startMicrosoftSignIn({
      errorRoute: "/login",
      onError: setMicrosoftError,
      onSubmittingChange: setMicrosoftLoading,
      redirectTo,
    });
  }

  return (
    <Stack gap="lg" mt="xl">
      <Title ta="center">Welcome back</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don&apos;t have an account?{" "}
        <Anchor size="sm" component={Link} to="/register">
          Register
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={{ base: "md", sm: 30 }} radius="md">
        {microsoftSSO ? (
          <>
            <MicrosoftSignInButton
              loading={isSubmitting}
              onClick={handleMicrosoftSignIn}
            />
            {microsoftError ? (
              <Text c="red" size="sm" mt="xs">
                {microsoftError}
              </Text>
            ) : null}
            <Divider label="or" labelPosition="center" my="md" />
          </>
        ) : null}
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
            {actionData?.errors?.form ? (
              <Text c="red" size="sm">
                {actionData.errors.form}
              </Text>
            ) : null}
          </Stack>
          <Button type="submit" fullWidth mt="xl" loading={isSubmitting}>
            Sign in
          </Button>
        </Form>
      </Paper>
    </Stack>
  );
}
