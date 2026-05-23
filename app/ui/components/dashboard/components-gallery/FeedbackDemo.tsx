import {
  Button,
  Group,
  Loader,
  Paper,
  Progress,
  RingProgress,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

export function FeedbackDemo() {
  return (
    <Paper withBorder p="md" radius="sm">
      <Title order={3} mb="md">
        Feedback
      </Title>

      <Stack gap="md">
        <Group gap="xs">
          <Button
            variant="light"
            onClick={() =>
              notifications.show({
                title: "Success",
                message: "Operation completed successfully.",
                color: "green",
              })
            }
          >
            Show notification
          </Button>
          <Button
            variant="light"
            color="yellow"
            onClick={() =>
              notifications.show({
                title: "Warning",
                message: "Something needs your attention.",
                color: "yellow",
              })
            }
          >
            Show warning
          </Button>
          <Button
            variant="light"
            color="red"
            onClick={() =>
              notifications.show({
                title: "Error",
                message: "Something went wrong.",
                color: "red",
              })
            }
          >
            Show error
          </Button>
        </Group>

        <div>
          <Text size="sm" fw={500} mb="xs">
            Progress
          </Text>
          <Progress value={65} size="lg" radius="xl" />
        </div>

        <Group align="flex-start">
          <RingProgress
            size={120}
            thickness={12}
            roundCaps
            sections={[{ value: 75, color: "blue" }]}
            label={
              <Text ta="center" size="lg" fw={700}>
                75%
              </Text>
            }
          />
          <Group gap="xs">
            <Loader size="sm" />
            <Text size="sm" c="dimmed">
              Loading data...
            </Text>
          </Group>
        </Group>
      </Stack>
    </Paper>
  );
}
