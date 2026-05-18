import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { redirect } from "react-router";
import { authClient } from "~/lib/auth/client";
import { auth } from "~/lib/auth/server";
import type { Route } from "./+types/login";

export function meta() {
  return [{ title: "Sign In" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  if (session) {
    return redirect("/");
  }
  return {};
}

export default function Login() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "", password: "" },
    validate: {
      email: (val) => (!val ? "Email is required" : null),
      password: (val) => (!val ? "Password is required" : null),
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    const result = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (result.error) {
      notifications.show({
        title: "Sign in failed",
        message: result.error.message || "Invalid credentials",
        color: "red",
      });
      return;
    }

    // eslint-disable-next-line react-hooks/immutability
    window.location.href = "/";
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Welcome back</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don&apos;t have an account?{" "}
        <Anchor size="sm" href="/register">
          Register
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="you@example.com"
              required
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
          </Stack>
          <Button type="submit" fullWidth mt="xl">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
