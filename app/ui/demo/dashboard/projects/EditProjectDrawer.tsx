import {
  Button,
  Drawer,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useEffect, useRef } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { PROJECT_STATUS } from "~/lib/demo/projects";
import type { ProjectsActionData } from "~/lib/demo/projects-page.server";
import type { ProjectSummary } from "~/lib/demo/projects.server";

interface EditProjectDrawerProps {
  opened: boolean;
  onClose: () => void;
  project: ProjectSummary | null;
}

const statusOptions = [
  { value: PROJECT_STATUS.active, label: "Active" },
  { value: PROJECT_STATUS.archived, label: "Archived" },
];

export function EditProjectDrawer({
  opened,
  onClose,
  project,
}: EditProjectDrawerProps) {
  const actionData = useActionData<ProjectsActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isBusy = navigation.state !== "idle";
  const wasBusyRef = useRef(false);

  useEffect(() => {
    if (!opened) {
      wasBusyRef.current = false;
      return;
    }

    if (isBusy) {
      wasBusyRef.current = true;
      return;
    }

    if (wasBusyRef.current && !actionData?.errors) {
      wasBusyRef.current = false;
      onClose();
    }
  }, [opened, isBusy, actionData, onClose]);

  if (!project) {
    return null;
  }

  const hasProjectError = actionData?.values?.projectId === project.id;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Edit project"
      position="right"
    >
      <Form method="post" replace>
        <input
          type="hidden"
          name="_intent"
          value="update"
          aria-label="Update project intent"
        />
        <input
          type="hidden"
          name="projectId"
          value={project.id}
          aria-label="Project id"
        />
        <Stack gap="md">
          <TextInput
            name="name"
            label="Project name"
            placeholder="Customer portal"
            defaultValue={
              hasProjectError ? actionData?.values?.name : project.name
            }
            error={hasProjectError ? actionData?.errors?.name : undefined}
            required
          />
          <Textarea
            name="description"
            label="Description"
            placeholder="No description"
            defaultValue={
              hasProjectError
                ? actionData?.values?.description
                : (project.description ?? "")
            }
            autosize
            minRows={2}
          />
          <Select
            name="status"
            label="Status"
            aria-label="Project status"
            defaultValue={
              hasProjectError
                ? (actionData?.values?.status ?? project.status)
                : project.status
            }
            data={statusOptions}
            error={hasProjectError ? actionData?.errors?.status : undefined}
            allowDeselect={false}
          />
          {actionData?.errors?.form ? (
            <Text c="red" size="sm">
              {actionData.errors.form}
            </Text>
          ) : null}
          <Group justify="flex-end">
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Save changes
            </Button>
          </Group>
        </Stack>
      </Form>
    </Drawer>
  );
}
