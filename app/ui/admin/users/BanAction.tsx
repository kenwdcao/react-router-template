import { Button, Group, Popover, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { UserLockButton } from "./UserLockButton";

interface BanActionProps {
  user: { id: string; name: string; banned: boolean };
}

export function BanAction({ user }: BanActionProps) {
  const [opened, setOpened] = useState(false);
  const fetcher = useFetcher<{ success: boolean }>();
  const isBanning = !user.banned;
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
    <Popover
      opened={opened}
      onChange={setOpened}
      position="top"
      withArrow
      shadow="md"
      transitionProps={{ transition: "slide-up", duration: 200 }}
    >
      <Popover.Target>
        <span>
          <UserLockButton
            locked={user.banned}
            onClick={() => setOpened(true)}
          />
        </span>
      </Popover.Target>
      <Popover.Dropdown p="md">
        <Stack gap="sm">
          <Text size="sm" fw={500}>
            {isBanning
              ? `Are you sure you want to ban "${user.name}"?`
              : `Are you sure you want to unban "${user.name}"?`}
          </Text>
          <Text size="xs" c="dimmed">
            {isBanning
              ? "This user will no longer be able to log in."
              : "This user will be able to log in again."}
          </Text>
          <fetcher.Form method="POST">
            <Group justify="flex-end" gap="xs">
              <Button
                variant="default"
                size="xs"
                type="button"
                onClick={() => setOpened(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <input type="hidden" name="userId" value={user.id} />
              <input
                type="hidden"
                name="_intent"
                value={user.banned ? "unban" : "ban"}
              />
              <Button
                type="submit"
                variant="outline"
                color={isBanning ? "red" : "green"}
                size="xs"
                loading={submitting}
              >
                {isBanning ? "Ban" : "Unban"}
              </Button>
            </Group>
          </fetcher.Form>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
