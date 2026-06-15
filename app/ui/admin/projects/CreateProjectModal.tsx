import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import type { ProjectManagerOption } from "~/lib/admin/types";
import { slugify } from "~/lib/admin/types";
import { UnsavedChangesModal } from "../UnsavedChangesModal";
import { ClientCombobox } from "./ClientCombobox";
import { ProjectManagerSelect } from "./ProjectManagerSelect";
import { ProjectSlugInput } from "./ProjectSlugInput";

interface CreateProjectModalProps {
  opened: boolean;
  onClose: () => void;
  clients: string[];
  availableManagers: ProjectManagerOption[];
}

export function CreateProjectModal({
  opened,
  onClose,
  clients,
  availableManagers,
}: CreateProjectModalProps) {
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      slug: "",
      client: "",
      managerIds: [] as string[],
      description: "",
    },
    validateInputOnChange: true,
    validate: {
      name: (value) => (value.trim() ? null : "Project name is required"),
      client: (value) => (value.trim() ? null : "Client is required"),
      managerIds: (value) =>
        value.length === 0 ? "At least one project manager is required" : null,
    },
  });

  const fetcher = useFetcher<{ success: boolean; error?: string }>();
  // Track whether the current fetcher submission belongs to *this* open of the
  // modal. Without this, a successful create leaves `fetcher.data.success` true
  // after the modal closes, so reopening it would trip the close-effect again
  // and immediately bounce shut.
  const submissionId = useRef<string | null>(null);
  const lastHandled = useRef<string | null>(null);

  // Auto-generate slug from name unless the user has manually edited it.
  const handleNameChange = (value: string) => {
    form.setFieldValue("name", value);
    const autoSlug = slugify(value);
    const currentSlug = form.values.slug;
    const expectedSlug = slugify(form.values.name);
    if (!currentSlug || currentSlug === expectedSlug) {
      form.setFieldValue("slug", autoSlug);
    }
  };

  const hasUnsavedChanges = useCallback(() => {
    return (
      form.values.name.trim() !== "" ||
      form.values.slug.trim() !== "" ||
      form.values.client.trim() !== "" ||
      form.values.managerIds.length > 0 ||
      form.values.description.trim() !== ""
    );
  }, [form.values]);

  const resetAndClose = () => {
    form.reset();
    onClose();
  };

  const handleClose = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedModal(true);
    } else {
      resetAndClose();
    }
  };

  useEffect(() => {
    if (
      !submissionId.current ||
      submissionId.current === lastHandled.current ||
      fetcher.state !== "idle"
    ) {
      return;
    }
    lastHandled.current = submissionId.current;
    if (fetcher.data?.success) {
      form.reset();
      onClose();
    } else if (fetcher.data && !fetcher.data.success) {
      // Surface server-side validation / DB failures instead of silently
      // resetting the submit button. The modal stays open so the admin can
      // correct and retry.
      notifications.show({
        color: "red",
        title: "Failed to create project",
        message: fetcher.data.error ?? "An unexpected error occurred.",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data, fetcher.state, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    const validation = form.validate();
    if (validation.hasErrors) {
      e.preventDefault();
      return;
    }
    // Tag this submission so the close-effect only reacts to a result from the
    // current open, not a stale success left over from a previous one.
    submissionId.current = crypto.randomUUID();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleClose}
        title={
          <Group gap="xs">
            <Plus size={18} />
            <Text fw={700}>Create New Project</Text>
          </Group>
        }
        size="lg"
        closeOnClickOutside={false}
        padding="lg"
      >
        <fetcher.Form method="POST" onSubmit={handleSubmit}>
          <Stack gap="lg">
            <input type="hidden" name="_intent" value="createProject" />

            <ClientCombobox
              clients={clients}
              value={form.values.client}
              onChange={(val) => form.setFieldValue("client", val)}
              required
              error={
                typeof form.errors.client === "string"
                  ? form.errors.client
                  : null
              }
            />

            <TextInput
              label="Project Name"
              placeholder="Enter project name"
              required
              value={form.values.name}
              onChange={(e) => handleNameChange(e.currentTarget.value)}
              error={form.errors.name}
            />
            <input type="hidden" name="name" value={form.values.name} />

            <ProjectSlugInput
              name={form.values.name}
              slug={form.values.slug}
              onSlugChange={(slug) => form.setFieldValue("slug", slug)}
            />

            <ProjectManagerSelect
              availableManagers={availableManagers}
              selectedIds={form.values.managerIds}
              onChange={(ids) => form.setFieldValue("managerIds", ids)}
              error={
                typeof form.errors.managerIds === "string"
                  ? form.errors.managerIds
                  : null
              }
              required
            />

            <Textarea
              label="Project Description"
              placeholder="Enter project description (optional)"
              value={form.values.description}
              onChange={(e) =>
                form.setFieldValue("description", e.currentTarget.value)
              }
              minRows={6}
              maxRows={12}
            />
            <input
              type="hidden"
              name="description"
              value={form.values.description}
            />

            <Group gap="sm" justify="flex-end">
              <Button variant="default" onClick={handleClose} className="w-36!">
                Cancel
              </Button>
              <Button
                type="submit"
                leftSection={<Plus size={16} />}
                className="w-36!"
                loading={fetcher.state !== "idle"}
                disabled={!form.isValid()}
              >
                Create Project
              </Button>
            </Group>
          </Stack>
        </fetcher.Form>
      </Modal>

      <UnsavedChangesModal
        opened={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        onConfirm={() => {
          setShowUnsavedModal(false);
          resetAndClose();
        }}
      />
    </>
  );
}
