import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { Pencil } from "lucide-react";
import type { ProjectSummary } from "~/lib/projects.server";
import { DeleteProjectButton } from "./DeleteProjectButton";

interface ProjectsTableProps {
  projects: ProjectSummary[];
  onEdit: (project: ProjectSummary) => void;
}

function formatDate(dateInput: string | Date) {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusBadgeColor(status: string): string {
  if (status === "active") return "green";
  if (status === "archived") return "gray";
  return "gray";
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="light" color={getStatusBadgeColor(status)}>
      {status}
    </Badge>
  );
}

function ProjectRow({
  project,
  onEdit,
}: {
  project: ProjectSummary;
  onEdit: (project: ProjectSummary) => void;
}) {
  return (
    <Table.Tr>
      <Table.Td>
        <Stack gap={0}>
          <Text fw={500}>{project.name}</Text>
          {project.description && (
            <Text c="dimmed" size="sm" lineClamp={1}>
              {project.description}
            </Text>
          )}
        </Stack>
      </Table.Td>
      <Table.Td>
        <StatusBadge status={project.status} />
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">
          {formatDate(project.updatedAt)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" wrap="nowrap">
          <ActionIcon
            variant="subtle"
            onClick={() => onEdit(project)}
            aria-label={`Edit ${project.name}`}
          >
            <Pencil size={16} />
          </ActionIcon>
          <DeleteProjectButton project={project} />
        </Group>
      </Table.Td>
    </Table.Tr>
  );
}

function ProjectCard({
  project,
  onEdit,
}: {
  project: ProjectSummary;
  onEdit: (project: ProjectSummary) => void;
}) {
  return (
    <Card withBorder padding="md" radius="sm">
      <Group justify="space-between" wrap="nowrap">
        <Stack gap={4} miw={0}>
          <Group gap="sm" wrap="nowrap">
            <Text fw={500} truncate>
              {project.name}
            </Text>
            <StatusBadge status={project.status} />
          </Group>
          {project.description && (
            <Text c="dimmed" size="sm" lineClamp={2}>
              {project.description}
            </Text>
          )}
          <Text size="xs" c="dimmed">
            Updated {formatDate(project.updatedAt)}
          </Text>
        </Stack>
        <Group gap="xs" wrap="nowrap">
          <ActionIcon
            variant="subtle"
            onClick={() => onEdit(project)}
            aria-label={`Edit ${project.name}`}
          >
            <Pencil size={16} />
          </ActionIcon>
          <DeleteProjectButton project={project} />
        </Group>
      </Group>
    </Card>
  );
}

export function ProjectsTable({ projects, onEdit }: ProjectsTableProps) {
  if (projects.length === 0) {
    return (
      <Card withBorder padding="xl" radius="sm">
        <Text c="dimmed" ta="center">
          No projects found.
        </Text>
      </Card>
    );
  }

  return (
    <>
      <Box visibleFrom="sm">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Updated</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {projects.map((project) => (
              <ProjectRow key={project.id} project={project} onEdit={onEdit} />
            ))}
          </Table.Tbody>
        </Table>
      </Box>

      <Box hiddenFrom="sm">
        <SimpleGrid cols={1} spacing="sm">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onEdit={onEdit} />
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
}
