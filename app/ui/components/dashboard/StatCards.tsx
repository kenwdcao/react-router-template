import {
  Badge,
  Group,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { Clock, FolderKanban, Globe, Sparkles } from "lucide-react";

interface StatCardsProps {
  projectCount: number;
  lastLogin: string | null;
  environment: string;
  aiReady: boolean;
}

const statItems = [
  {
    key: "projects" as const,
    icon: FolderKanban,
    label: "Projects",
    color: "blue",
  },
  {
    key: "lastLogin" as const,
    icon: Clock,
    label: "Last login",
    color: "violet",
  },
  {
    key: "environment" as const,
    icon: Globe,
    label: "Environment",
    color: "teal",
  },
  {
    key: "aiReady" as const,
    icon: Sparkles,
    label: "AI Status",
    color: "grape",
  },
];

export function StatCards({
  projectCount,
  lastLogin,
  environment,
  aiReady,
}: StatCardsProps) {
  const values: Record<string, React.ReactNode> = {
    projects: projectCount,
    lastLogin: lastLogin ?? "Never",
    environment,
    aiReady: (
      <Badge color={aiReady ? "green" : "gray"} variant="light" size="sm">
        {aiReady ? "Ready" : "Not configured"}
      </Badge>
    ),
  };

  return (
    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
      {statItems.map((item) => (
        <Paper key={item.key} withBorder p="md" radius="sm">
          <Group gap="sm" mb="xs">
            <ThemeIcon variant="light" color={item.color} size="lg">
              <item.icon size={18} />
            </ThemeIcon>
            <Text size="sm" c="dimmed">
              {item.label}
            </Text>
          </Group>
          <Text component="div" fw={700} size="lg">
            {values[item.key]}
          </Text>
        </Paper>
      ))}
    </SimpleGrid>
  );
}
