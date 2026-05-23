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
        p="xl"
        bg="var(--mantine-primary-color-light)"
      >
        <Stack align="center" gap="md">
          <Title order={2}>Ready to ship?</Title>
          <Text c="dimmed" ta="center">
            Register an account to try the dashboard, or jump straight in.
          </Text>
          <Group grow>
            <Button component={Link} to="/register">
              Get started
            </Button>
            <Button variant="default" component={Link} to="/dashboard">
              View dashboard demo
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
