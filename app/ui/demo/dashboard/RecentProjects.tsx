import {
  Badge,
  Group,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { FolderKanban } from "lucide-react";
import { Link } from "react-router";

interface RecentProject {
  id: string;
  name: string;
  status: string;
  updatedAt: string | Date;
}

interface RecentProjectsProps {
  projects: RecentProject[];
}

function formatRelativeDate(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

function statusColor(status: string): string {
  if (status === "active") return "green";
  if (status === "archived") return "gray";
  return "blue";
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  if (projects.length === 0) {
    return (
      <Paper withBorder p="xl" radius="sm">
        <Stack align="center" gap="xs">
          <FolderKanban size={32} />
          <Text c="dimmed">No projects yet</Text>
          <Text size="sm" c="dimmed">
            Create your first project to get started.
          </Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Stack gap="sm">
      {projects.map((project) => (
        <Paper key={project.id} withBorder p="sm" radius="sm">
          <Group justify="space-between">
            <Group gap="sm">
              <Text fw={500}>{project.name}</Text>
              <Badge
                variant="light"
                color={statusColor(project.status)}
                size="sm"
              >
                {project.status}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              {formatRelativeDate(project.updatedAt)}
            </Text>
          </Group>
        </Paper>
      ))}
      {projects.length >= 5 ? (
        <UnstyledButton
          component={Link}
          to="/demo/dashboard/projects"
          aria-label="View all projects"
        >
          <Text size="sm" c="blue" fw={500}>
            View all projects
          </Text>
        </UnstyledButton>
      ) : null}
    </Stack>
  );
}
