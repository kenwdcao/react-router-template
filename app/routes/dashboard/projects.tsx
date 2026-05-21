import {
  Badge,
  Button,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { Check, Plus, Trash2 } from "lucide-react";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "react-router";
import { PROJECT_STATUS } from "~/lib/projects";
import {
  handleProjectsAction,
  loadProjectsPage,
  type ProjectsActionData,
} from "~/lib/projects-page.server";
import type { ProjectSummary } from "~/lib/projects.server";
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
  const actionData = useActionData<ProjectsActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

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

      <Paper withBorder p="md" radius="sm">
        <Form method="post" replace>
          <input
            type="hidden"
            name="_intent"
            value="create"
            aria-label="Project action"
          />
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
            <TextInput
              name="name"
              label="Project name"
              placeholder="Customer portal"
              defaultValue={actionData?.values?.name}
              error={actionData?.errors?.name}
              required
            />
            <Textarea
              name="description"
              label="Description"
              placeholder="Internal launch checklist"
              defaultValue={actionData?.values?.description}
              autosize
              minRows={1}
            />
            <Group align="flex-end">
              <Button
                type="submit"
                leftSection={<Plus size={16} />}
                loading={isSubmitting}
              >
                Create project
              </Button>
            </Group>
          </SimpleGrid>
          {actionData?.errors?.form && (
            <Text c="red" size="sm" mt="sm">
              {actionData.errors.form}
            </Text>
          )}
        </Form>
      </Paper>

      {projects.length === 0 ? (
        <Paper withBorder p="xl" radius="sm">
          <Text c="dimmed">No projects yet.</Text>
        </Paper>
      ) : (
        <Stack gap="sm">
          {projects.map((project) => (
            <ProjectEditor
              key={project.id}
              project={project}
              isSubmitting={isSubmitting}
              actionData={actionData}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

function ProjectEditor({
  project,
  isSubmitting,
  actionData,
}: {
  project: ProjectSummary;
  isSubmitting: boolean;
  actionData?: ProjectsActionData;
}) {
  const hasProjectError = actionData?.values?.projectId === project.id;

  return (
    <Paper withBorder p="md" radius="sm">
      <Form method="post" replace>
        <input
          type="hidden"
          name="projectId"
          value={project.id}
          aria-label="Project id"
        />
        <SimpleGrid cols={{ base: 1, md: 4 }} spacing="md">
          <TextInput
            name="name"
            label="Name"
            placeholder="Project name"
            defaultValue={project.name}
            error={hasProjectError ? actionData?.errors?.name : undefined}
            required
          />
          <Textarea
            name="description"
            label="Description"
            placeholder="No description"
            defaultValue={project.description ?? ""}
            autosize
            minRows={1}
          />
          <Select
            name="status"
            label="Status"
            aria-label="Project status"
            defaultValue={project.status}
            data={[
              { value: PROJECT_STATUS.active, label: "Active" },
              { value: PROJECT_STATUS.archived, label: "Archived" },
            ]}
            error={hasProjectError ? actionData?.errors?.status : undefined}
            allowDeselect={false}
          />
          <Group align="flex-end" gap="xs">
            <Button
              type="submit"
              name="_intent"
              value="update"
              variant="light"
              leftSection={<Check size={16} />}
              loading={isSubmitting}
            >
              Save
            </Button>
            <Button
              type="submit"
              name="_intent"
              value="delete"
              variant="subtle"
              color="red"
              leftSection={<Trash2 size={16} />}
              loading={isSubmitting}
            >
              Delete
            </Button>
          </Group>
        </SimpleGrid>
      </Form>
    </Paper>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <Paper withBorder p="xl" radius="sm">
        <Title order={2}>Project not found</Title>
        <Text c="dimmed">
          The project was deleted or you do not have access.
        </Text>
      </Paper>
    );
  }

  return (
    <Paper withBorder p="xl" radius="sm">
      <Title order={2}>Projects failed to load</Title>
      <Text c="dimmed">
        Check the database connection and project table migration.
      </Text>
    </Paper>
  );
}
