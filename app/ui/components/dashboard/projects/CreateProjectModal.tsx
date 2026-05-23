import { Button, Group, Modal, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { useEffect, useRef } from "react";
import {
  Form,
  useActionData,
  useNavigation,
} from "react-router";
import type { ProjectsActionData } from "~/lib/projects-page.server";

interface CreateProjectModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateProjectModal({
  opened,
  onClose,
}: CreateProjectModalProps) {
  const actionData = useActionData<ProjectsActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const wasSubmittingRef = useRef(false);

  useEffect(() => {
    if (wasSubmittingRef.current && navigation.state === "idle") {
      if (!actionData?.errors) {
        onClose();
      }
    }
    wasSubmittingRef.current = isSubmitting;
  }, [navigation.state, actionData, onClose, isSubmitting]);

  return (
    <Modal opened={opened} onClose={onClose} title="Create project">
      <Form method="post" replace>
        <input type="hidden" name="_intent" value="create" aria-label="Create project intent" />
        <Stack gap="md">
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
            minRows={2}
          />
          {actionData?.errors?.form && (
            <Text c="red" size="sm">
              {actionData.errors.form}
            </Text>
          )}
          <Group justify="flex-end">
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Create
            </Button>
          </Group>
        </Stack>
      </Form>
    </Modal>
  );
}
