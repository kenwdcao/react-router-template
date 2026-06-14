import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useEffect, useRef } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import type { ProjectsActionData } from "~/lib/demo/projects-page.server";

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
  const isBusy = navigation.state !== "idle";
  const wasBusyRef = useRef(false);

  // The route action handles create/update/delete on a shared actionData
  // object. Update responses always carry values.projectId; create responses
  // never do, so its absence identifies data belonging to this form. Without
  // this filter, errors/values from an edit or delete would bleed into the
  // create modal. Mirrors EditProjectDrawer's projectId scoping.
  const createActionData =
    actionData && !actionData.values?.projectId ? actionData : undefined;

  useEffect(() => {
    if (!opened) {
      wasBusyRef.current = false;
      return;
    }

    if (isBusy) {
      wasBusyRef.current = true;
      return;
    }

    if (wasBusyRef.current && !createActionData?.errors) {
      wasBusyRef.current = false;
      onClose();
    }
  }, [opened, isBusy, createActionData, onClose]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={700}>Create project</Text>}
    >
      <Form method="post" replace>
        <input type="hidden" name="_intent" value="create" />
        <Stack gap="md">
          <TextInput
            name="name"
            label="Project name"
            placeholder="Customer portal"
            defaultValue={createActionData?.values?.name}
            error={createActionData?.errors?.name}
            required
          />
          <Textarea
            name="description"
            label="Description"
            placeholder="Internal launch checklist"
            defaultValue={createActionData?.values?.description}
            autosize
            minRows={2}
          />
          {createActionData?.errors?.form ? (
            <Text c="red" size="sm">
              {createActionData.errors.form}
            </Text>
          ) : null}
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
