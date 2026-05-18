import { redirect } from "react-router";
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Title,
  Text,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { auth } from "~/lib/auth/server";
import { authClient } from "~/lib/auth/client";
import type { Route } from "./+types/register";

export function meta() {
  return [{ title: "Create Account" }];
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

export default function Register() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validate: {
      name: (val) => (!val ? "Name is required" : null),
      email: (val) =>
        !val ? "Email is required" : !val.includes("@") ? "Invalid email" : null,
      password: (val) =>
        val.length < 8 ? "Password must be at least 8 characters" : null,
      confirmPassword: (val, values) =>
        val !== values.password ? "Passwords do not match" : null,
    },
  });

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const result = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (result.error) {
      notifications.show({
        title: "Registration failed",
        message: result.error.message || "Could not create account",
        color: "red",
      });
      return;
    }

    notifications.show({
      title: "Account created",
      message: "Please sign in with your new account",
      color: "green",
    });
    window.location.href = "/login";
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Create an account</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" href="/login">
          Sign in
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Your name"
              required
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Email"
              placeholder="you@example.com"
              required
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="At least 8 characters"
              required
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Repeat your password"
              required
              key={form.key("confirmPassword")}
              {...form.getInputProps("confirmPassword")}
            />
          </Stack>
          <Button type="submit" fullWidth mt="xl">
            Create account
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
