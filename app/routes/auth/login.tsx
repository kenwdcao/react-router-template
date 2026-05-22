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
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { getSafeRedirectTo } from "~/lib/auth";
import { handleLoginAction } from "~/lib/auth/index.server";
import type { Route } from "./+types/login";

export function meta() {
  return [{ title: "Sign In" }];
}

export async function action({ request }: Route.ActionArgs) {
  return handleLoginAction(request);
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
