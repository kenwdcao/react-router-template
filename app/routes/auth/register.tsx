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
} from "react-router";
import {
  handleRegisterAction,
  isMicrosoftSSOConfigured,
} from "~/lib/auth/index.server";
import { startMicrosoftSignIn } from "~/lib/auth/microsoft-sign-in";
import { MicrosoftSignInButton } from "~/ui/components/auth/microsoft-sign-in";
import type { Route } from "./+types/register";

export function meta() {
  return [{ title: "Create Account" }];
}

export function loader() {
  return { microsoftSSO: isMicrosoftSSOConfigured };
}

export async function action({ request }: Route.ActionArgs) {
  return handleRegisterAction(request);
}

export default function Register() {
  const { microsoftSSO } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [microsoftLoading, setMicrosoftLoading] = useState(false);
  const [microsoftError, setMicrosoftError] = useState<string | null>(null);
  const isSubmitting = navigation.state === "submitting" || microsoftLoading;

  async function handleMicrosoftSignIn() {
    setMicrosoftError(null);
    await startMicrosoftSignIn({
      errorRoute: "/register",
      onError: setMicrosoftError,
      onSubmittingChange: setMicrosoftLoading,
      redirectTo: "/",
    });
  }

  return (
    <Stack gap="lg" mt="xl">
      <Title ta="center">Create an account</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" component={Link} to="/login">
          Sign in
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
            {actionData?.errors?.form ? (
              <Text c="red" size="sm">
                {actionData.errors.form}
              </Text>
            ) : null}
          </Stack>
          <Button type="submit" fullWidth mt="xl" loading={isSubmitting}>
            Create account
          </Button>
        </Form>
      </Paper>
    </Stack>
  );
}
