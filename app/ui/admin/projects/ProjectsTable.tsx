import { Avatar, Badge, Group, Table, Text, Tooltip } from "@mantine/core";
import { Folder } from "lucide-react";
import { useState } from "react";
import type {
  ProjectManagerOption,
  ProjectWithManagers,
} from "~/lib/admin/types";
import { getAvatarInitial } from "~/lib/utils";
import { EditProjectDrawer } from "./EditProjectDrawer";
import { EditProjectDrawerButton } from "./EditProjectDrawerButton";
import { ProjectArchiveButton } from "./ProjectArchiveButton";
import { ViewProjectButton } from "./ViewProjectButton";

interface ProjectsTableProps {
  projects: ProjectWithManagers[];
  formatDate: (date: Date) => string;
  clients: string[];
  availableManagers: ProjectManagerOption[];
}

export function ProjectsTable({
  projects,
  formatDate,
  clients,
  availableManagers,
}: ProjectsTableProps) {
  const [editingProject, setEditingProject] =
    useState<ProjectWithManagers | null>(null);

  const getClientDisplay = (project: ProjectWithManagers) =>
    project.metadata.client || "Not Set";
  const getPhaseDisplay = (project: ProjectWithManagers) =>
    project.metadata.phase || "Not Set";

  const renderManagers = (managers: ProjectWithManagers["managers"]) => {
    if (managers.length === 0) {
      return (
        <Text c="dimmed" size="xs">
          -
        </Text>
      );
    }
    const displayManagers = managers.slice(0, 2);
    const remainingCount = managers.length - 2;
    return (
      <Group gap="xs">
        {displayManagers.map((manager) => (
          <Tooltip key={manager.id} label={manager.name}>
            <Avatar size="sm" radius="xl" src={manager.image ?? undefined}>
              {getAvatarInitial(manager.name)}
            </Avatar>
          </Tooltip>
        ))}
        {remainingCount > 0 && (
          <Tooltip
            label={managers
              .slice(2)
              .map((m) => m.name)
              .join(", ")}
          >
            <Avatar size="sm" radius="xl" color="gray">
              +{remainingCount}
            </Avatar>
          </Tooltip>
        )}
      </Group>
    );
  };

  return (
    <>
      <Table
        striped
        highlightOnHover
        withTableBorder
        horizontalSpacing="xs"
        verticalSpacing={4}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th className="hidden md:table-cell">Description</Table.Th>
            <Table.Th className="hidden sm:table-cell">Client</Table.Th>
            <Table.Th className="hidden lg:table-cell">Phase</Table.Th>
            <Table.Th className="hidden sm:table-cell">
              Project Managers
            </Table.Th>
            <Table.Th className="hidden lg:table-cell">Created</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {projects.map((project) => (
            <Table.Tr key={project.id}>
              <Table.Td>
                <Group gap="xs" className="text-nowrap">
                  <Folder size={18} />
                  <Text size="xs">{project.name}</Text>
                  {project.archived ? (
                    <Badge size="xs" variant="light" color="gray">
                      Archived
                    </Badge>
                  ) : null}
                </Group>
              </Table.Td>
              <Table.Td className="hidden md:table-cell max-w-64">
                <Text lineClamp={1} size="xs" c="dimmed">
                  {project.description || "-"}
                </Text>
              </Table.Td>
              <Table.Td className="hidden sm:table-cell">
                <Text size="xs">{getClientDisplay(project)}</Text>
              </Table.Td>
              <Table.Td className="hidden lg:table-cell">
                <Text size="xs">{getPhaseDisplay(project)}</Text>
              </Table.Td>
              <Table.Td className="hidden sm:table-cell">
                {renderManagers(project.managers)}
              </Table.Td>
              <Table.Td className="hidden lg:table-cell">
                <Text size="xs">{formatDate(project.createdAt)}</Text>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ViewProjectButton />
                  <EditProjectDrawerButton
                    onClick={() => setEditingProject(project)}
                  />
                  <ProjectArchiveButton
                    projectId={project.id}
                    projectName={project.name}
                    archived={project.archived}
                  />
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
          {projects.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text size="xs" c="dimmed" ta="center" py="lg">
                  No projects found.
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      <EditProjectDrawer
        opened={editingProject !== null}
        onClose={() => setEditingProject(null)}
        project={editingProject}
        clients={clients}
        availableManagers={availableManagers}
      />
    </>
  );
}
