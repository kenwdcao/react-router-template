import { Button, Center, Stack, Text, ThemeIcon } from "@mantine/core";
import { Activity } from "lucide-react";
import { Link } from "react-router";

export function EmptyActivity() {
  return (
    <Center py="xl">
      <Stack align="center" gap="md">
        <ThemeIcon size={48} radius="xl" variant="light">
          <Activity size={24} />
        </ThemeIcon>
        <Text c="dimmed" size="lg">
          No activity yet
        </Text>
        <Button component={Link} to="/demo/dashboard/projects" variant="light">
          View projects
        </Button>
      </Stack>
    </Center>
  );
}
