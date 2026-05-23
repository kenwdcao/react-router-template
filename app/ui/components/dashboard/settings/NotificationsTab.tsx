import { Stack, Switch, Text } from "@mantine/core";

export function NotificationsTab() {
  return (
    <Stack gap="md" maw={480}>
      <Switch.Group label="Notification preferences" defaultValue={["email"]}>
        <Stack gap="xs" mt="xs">
          <Switch
            value="email"
            label="Email notifications"
            description="Receive email updates about your projects"
          />
          <Switch
            value="push"
            label="Push notifications"
            description="Get browser push notifications for important events"
          />
          <Switch
            value="digest"
            label="Weekly digest"
            description="Receive a weekly summary of activity"
          />
        </Stack>
      </Switch.Group>

      <Text c="dimmed" size="sm" mt="sm">
        Preview only — no email backend is configured yet.
      </Text>
    </Stack>
  );
}
