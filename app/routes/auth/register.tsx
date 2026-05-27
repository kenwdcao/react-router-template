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
import { Form, Link, useActionData, useNavigation } from "react-router";
import { handleRegisterAction } from "~/lib/auth/index.server";
import type { Route } from "./+types/register";

export function meta() {
  return [{ title: "Create Account" }];
}

export async function action({ request }: Route.ActionArgs) {
  return handleRegisterAction(request);
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

      <Paper withBorder shadow="md" p={{ base: "md", sm: 30 }} radius="md">
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
