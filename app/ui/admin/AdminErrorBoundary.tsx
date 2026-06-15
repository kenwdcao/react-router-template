import { Alert, Group, Stack, Text } from "@mantine/core";
import { TriangleAlert } from "lucide-react";
import { Link } from "react-router";

interface AdminErrorBoundaryProps {
  title: string;
  message: string;
  showLoginLink?: boolean;
}

export function AdminErrorBoundary({
  title,
  message,
  showLoginLink = false,
}: AdminErrorBoundaryProps) {
  return (
    <Alert
      icon={<TriangleAlert size={18} />}
      color="red"
      title={title}
      radius="md"
      variant="light"
    >
      <Stack gap={8}>
        <Text size="sm">{message}</Text>
        <Group gap="sm">
          <Text component={Link} to="/" size="sm" c="blue" td="underline">
            Back to Home
          </Text>
          {showLoginLink ? (
            <Text
              component={Link}
              to="/login"
              size="sm"
              c="blue"
              td="underline"
            >
              Go to Login
            </Text>
          ) : null}
        </Group>
      </Stack>
    </Alert>
  );
}
