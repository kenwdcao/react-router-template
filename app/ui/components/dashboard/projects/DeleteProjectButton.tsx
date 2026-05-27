import { ActionIcon, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Trash2 } from "lucide-react";
import { useSubmit } from "react-router";
import type { ProjectSummary } from "~/lib/projects.server";

interface DeleteProjectButtonProps {
  project: ProjectSummary;
}

export function DeleteProjectButton({ project }: DeleteProjectButtonProps) {
  const submit = useSubmit();

  const handleDelete = () => {
    modals.openConfirmModal({
      title: "Delete project?",
      children: (
        <Stack gap="xs">
          <Text size="sm">
            Are you sure you want to delete{" "}
            <Text component="span" fw={600}>
              {project.name}
            </Text>
            ? This action cannot be undone.
          </Text>
        </Stack>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        void submit(
          { _intent: "delete", projectId: project.id },
          { method: "post", replace: true },
        );
      },
    });
  };

  return (
    <ActionIcon
      variant="subtle"
      color="red"
      onClick={handleDelete}
      aria-label={`Delete ${project.name}`}
    >
      <Trash2 size={16} />
    </ActionIcon>
  );
}
