import { Paper, SimpleGrid, Stack, Text, UnstyledButton } from "@mantine/core";
import { Component, FolderKanban } from "lucide-react";
import { Link } from "react-router";

interface QuickAction {
  to: string;
  icon: typeof FolderKanban;
  title: string;
  description: string;
}

const actions: QuickAction[] = [
  {
    to: "/demo/dashboard/projects",
    icon: FolderKanban,
    title: "Manage projects",
    description: "Create, edit, and organize your projects.",
  },
  {
    to: "/demo/dashboard/components",
    icon: Component,
    title: "Component library",
    description: "Browse available UI components and patterns.",
  },
];

export function QuickActions() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
      {actions.map((action) => (
        <UnstyledButton
          key={action.to}
          component={Link}
          to={action.to}
          aria-label={action.title}
        >
          <Paper withBorder p="lg" radius="md">
            <Stack gap="xs">
              <action.icon size={24} />
              <Text fw={600}>{action.title}</Text>
              <Text size="sm" c="dimmed">
                {action.description}
              </Text>
            </Stack>
          </Paper>
        </UnstyledButton>
      ))}
    </SimpleGrid>
  );
}
