import {
  Badge,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "react-router";
import {
  handleProjectsAction,
  loadProjectsPage,
} from "~/lib/projects-page.server";
import type { ProjectSummary } from "~/lib/projects.server";
import {
  CreateProjectModal,
  EditProjectDrawer,
  ProjectsTable,
  ProjectsToolbar,
} from "~/ui/components/dashboard/projects";
import type { Route } from "./+types/projects";

export function meta() {
  return [{ title: "Projects" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  return loadProjectsPage(request);
}

export async function action({ request }: Route.ActionArgs) {
  return handleProjectsAction(request);
}

export default function ProjectsRoute() {
  const { projects } = useLoaderData<typeof loader>();
  const [createOpened, createHandlers] = useDisclosure(false);
  const [editOpened, editHandlers] = useDisclosure(false);
  const [editingProject, setEditingProject] =
    useState<ProjectSummary | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (project: ProjectSummary) => {
    setEditingProject(project);
    editHandlers.open();
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={1}>Projects</Title>
          <Text c="dimmed">
            Loader, action, protected route, and Kysely query example.
          </Text>
        </div>
        <Badge size="lg" variant="light">
          {projects.length} total
        </Badge>
      </Group>

      <ProjectsToolbar
        onCreateClick={createHandlers.open}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
      />

      <ProjectsTable
        projects={filteredProjects}
        onEdit={handleEdit}
      />

      <CreateProjectModal
        opened={createOpened}
        onClose={createHandlers.close}
      />

      <EditProjectDrawer
        opened={editOpened}
        onClose={() => {
          editHandlers.close();
          setEditingProject(null);
        }}
        project={editingProject}
      />
    </Stack>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <Stack p="xl">
        <Title order={2}>Project not found</Title>
        <Text c="dimmed">
          The project was deleted or you do not have access.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack p="xl">
      <Title order={2}>Projects failed to load</Title>
      <Text c="dimmed">
        Check the database connection and project table migration.
      </Text>
    </Stack>
  );
}
