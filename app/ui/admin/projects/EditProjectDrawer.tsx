import {
  Button,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Pencil } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type {
  ProjectManagerOption,
  ProjectWithManagers,
} from "~/lib/admin/types";
import { UnsavedChangesModal } from "../UnsavedChangesModal";
import { ClientCombobox } from "./ClientCombobox";
import { ProjectManagerSelect } from "./ProjectManagerSelect";
import { ProjectSlugInput } from "./ProjectSlugInput";

interface EditProjectDrawerProps {
  opened: boolean;
  onClose: () => void;
  project: ProjectWithManagers | null;
  clients: string[];
  availableManagers: ProjectManagerOption[];
}

export function EditProjectDrawer({
  opened,
  onClose,
  project,
  clients,
  availableManagers,
}: EditProjectDrawerProps) {
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  const getInitialValues = useCallback(
    () => ({
      name: project?.name ?? "",
      slug: project?.slug ?? "",
      client: project?.metadata.client ?? "",
      managerIds: (project?.managers.map((m) => m.id) ?? []).sort(),
    }),
    [project],
  );

  const form = useForm({
    initialValues: {
      name: "",
      slug: "",
      client: "",
      managerIds: [] as string[],
    },
    validateInputOnChange: true,
    validate: {
      name: (value) => (value.trim() ? null : "Project name is required"),
      managerIds: (value) =>
        value.length === 0 ? "At least one project manager is required" : null,
    },
  });

  const fetcher = useFetcher<{ success: boolean }>();

  // Re-seed the form whenever a different project is opened.
  useEffect(() => {
    if (opened && project?.id) {
      form.setValues(getInitialValues());
      form.resetDirty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, project?.id, getInitialValues]);

  useEffect(() => {
    if (fetcher.data?.success && fetcher.state === "idle") {
      onClose();
    }
  }, [fetcher.data, fetcher.state, onClose]);

  const hasUnsavedChanges = () => {
    const initial = getInitialValues();
    const current = form.values;
    return (
      initial.name !== current.name ||
      initial.slug !== current.slug ||
      initial.client !== current.client ||
      JSON.stringify(initial.managerIds) !==
        JSON.stringify([...current.managerIds].sort())
    );
  };

  const handleClose = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedModal(true);
    } else {
      onClose();
    }
  };

  const isDirty = hasUnsavedChanges();

  return (
    <>
      <Drawer
        opened={opened}
        onClose={handleClose}
        title={
          <Group gap="xs">
            <Pencil size={18} />
            <Text fw={700}>Update Project Information</Text>
          </Group>
        }
        position="right"
        size="md"
        closeOnClickOutside={false}
      >
        <fetcher.Form
          method="POST"
          onSubmit={(e) => {
            const validation = form.validate();
            if (validation.hasErrors) {
              e.preventDefault();
            }
          }}
        >
          <Stack gap="lg">
            <input type="hidden" name="projectId" value={project?.id ?? ""} />
            <input type="hidden" name="_intent" value="updateProject" />

            <TextInput
              label="Project Name"
              placeholder="Enter project name"
              required
              value={form.values.name}
              onChange={(e) =>
                form.setFieldValue("name", e.currentTarget.value)
              }
            />
            <input type="hidden" name="name" value={form.values.name} />

            <ProjectSlugInput
              name={form.values.name}
              slug={form.values.slug}
              onSlugChange={(slug) => form.setFieldValue("slug", slug)}
            />

            <ClientCombobox
              clients={clients}
              value={form.values.client}
              onChange={(val) => form.setFieldValue("client", val)}
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
            />

            <Divider />

            <Group gap="sm">
              <Button variant="default" onClick={handleClose} className="w-36!">
                Cancel
              </Button>
              <Button
                type="submit"
                leftSection={<Pencil size={16} />}
                className="w-36!"
                disabled={!isDirty}
              >
                Save Changes
              </Button>
            </Group>
          </Stack>
        </fetcher.Form>
      </Drawer>

      <UnsavedChangesModal
        opened={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        onConfirm={() => {
          setShowUnsavedModal(false);
          onClose();
        }}
      />
    </>
  );
}
