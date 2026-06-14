import {
  ActionIcon,
  Button,
  Group,
  Popover,
  Text,
  Tooltip,
} from "@mantine/core";
import { Archive } from "lucide-react";
import { useState } from "react";
import { Form } from "react-router";

interface ProjectArchiveButtonProps {
  projectId: string;
  archived: boolean;
}

export function ProjectArchiveButton({
  projectId,
  archived,
}: ProjectArchiveButtonProps) {
  const [opened, setOpened] = useState(false);

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
            aria-label={archived ? "Unarchive project" : "Archive project"}
            onClick={() => setOpened(true)}
          >
            <Archive size={16} />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="sm" mb="xs">
            {archived ? "Unarchive this project?" : "Archive this project?"}
          </Text>
          <Group gap="xs">
            <Button
              variant="default"
              size="xs"
              onClick={() => setOpened(false)}
            >
              Cancel
            </Button>
            <Form method="POST">
              <input type="hidden" name="projectId" value={projectId} />
              <input
                type="hidden"
                name="_intent"
                value={archived ? "unarchiveProject" : "archiveProject"}
              />
              <Button
                type="submit"
                color="red"
                size="xs"
                onClick={() => setOpened(false)}
              >
                {archived ? "Unarchive" : "Archive"}
              </Button>
            </Form>
          </Group>
        </Popover.Dropdown>
      </Popover>
    </Tooltip>
  );
}
