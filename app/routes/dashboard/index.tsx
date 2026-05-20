import {
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "react-router";

export function meta() {
  return [{ title: "Dashboard" }];
}

export default function DashboardIndex() {
  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={1}>Dashboard</Title>
          <Text c="dimmed">
            Protected layout route with shared navigation and session context.
          </Text>
        </div>
        <Button component={Link} to="/dashboard/projects">
          Open CRUD example
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Paper withBorder p="md" radius="sm">
          <Text size="sm" c="dimmed">
            Guard
          </Text>
          <Text fw={700}>requireAuth loader</Text>
        </Paper>
        <Paper withBorder p="md" radius="sm">
          <Text size="sm" c="dimmed">
            Data
          </Text>
          <Text fw={700}>Kysely queries</Text>
        </Paper>
        <Paper withBorder p="md" radius="sm">
          <Text size="sm" c="dimmed">
            Mutations
          </Text>
          <Text fw={700}>React Router actions</Text>
        </Paper>
      </SimpleGrid>
    </Stack>
  );
}
