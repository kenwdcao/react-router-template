import {
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "react-router";

export function FinalCTA() {
  return (
    <Container size="md">
      <Paper
        withBorder
        radius="lg"
        p={{ base: "md", sm: "xl" }}
        bg="var(--mantine-primary-color-light)"
      >
        <Stack align="center" gap="md">
          <Title order={2}>Ready to ship?</Title>
          <Text c="dimmed" ta="center">
            Register an account to try the dashboard, or jump straight in.
          </Text>
          <Stack w="100%" maw={400} visibleFrom="sm" aria-hidden="true">
            <Group grow>
              <Button component={Link} to="/register" tabIndex={-1}>
                Get started
              </Button>
              <Button
                variant="default"
                component={Link}
                to="/dashboard"
                tabIndex={-1}
              >
                View dashboard demo
              </Button>
            </Group>
          </Stack>
          <Stack w="100%" hiddenFrom="sm" gap="sm">
            <Button fullWidth component={Link} to="/register">
              Get started
            </Button>
            <Button
              fullWidth
              variant="default"
              component={Link}
              to="/dashboard"
            >
              View dashboard demo
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
