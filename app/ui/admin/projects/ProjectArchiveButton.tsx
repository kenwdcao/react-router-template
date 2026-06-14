import {
  ActionIcon,
  Button,
  Group,
  Popover,
  Text,
  Tooltip,
} from "@mantine/core";
import { Archive } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";

interface ProjectArchiveButtonProps {
  projectId: string;
  projectName: string;
  archived: boolean;
}

export function ProjectArchiveButton({
  projectId,
  projectName,
  archived,
}: ProjectArchiveButtonProps) {
  const [opened, setOpened] = useState(false);
  const fetcher = useFetcher<{ success: boolean }>();
  const submitting = fetcher.state !== "idle";

  // Close the popover only after a successful submission; keep it open during
  // submission so the inline loading state is visible (per AGENTS.md overlay rules).
  useEffect(() => {
    if (fetcher.data?.success && fetcher.state === "idle") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpened(false);
    }
  }, [fetcher.data, fetcher.state]);

  return (
    <Tooltip
      label={archived ? "Unarchive project" : "Archive project"}
      position="top"
      disabled={opened}
    >
      <Popover
        opened={opened}
        onChange={setOpened}
        position="top"
        withArrow
        shadow="md"
      >
        <Popover.Target>
          <ActionIcon
            variant="light"
            color={archived ? "gray" : "red"}
            size="compact-xs"
            aria-label={archived ? "Unarchive project" : "Archive project"}
            onClick={() => setOpened(true)}
          >
            <Archive size={12} />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="xs" mb="xs">
            {archived
              ? `Unarchive "${projectName}"?`
              : `Archive "${projectName}"?`}
          </Text>
          <Group gap="xs">
            <Button
              variant="default"
              size="xs"
              onClick={() => setOpened(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <fetcher.Form method="POST">
              <input type="hidden" name="projectId" value={projectId} />
              <input
                type="hidden"
                name="_intent"
                value={archived ? "unarchiveProject" : "archiveProject"}
              />
              <Button type="submit" color="red" size="xs" loading={submitting}>
                {archived ? "Unarchive" : "Archive"}
              </Button>
            </fetcher.Form>
          </Group>
        </Popover.Dropdown>
      </Popover>
    </Tooltip>
  );
}
