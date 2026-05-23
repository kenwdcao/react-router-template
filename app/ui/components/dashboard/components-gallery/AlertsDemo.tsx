import {
  Alert,
  Blockquote,
  Group,
  Highlight,
  Kbd,
  Paper,
  Spoiler,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { AlertCircle, Bell, Info, CheckCircle } from "lucide-react";

export function AlertsDemo() {
  return (
    <Paper withBorder p="md" radius="sm">
      <Title order={3} mb="md">
        Alerts & Content
      </Title>

      <Stack gap="md">
        <Alert
          variant="light"
          color="blue"
          title="Information"
          icon={<Info size={18} />}
        >
          This template uses React Router v7 framework mode with TypeScript
          for full-stack development.
        </Alert>

        <Alert
          variant="light"
          color="green"
          title="Success"
          icon={<CheckCircle size={18} />}
        >
          Your project has been created successfully. You can now start
          building your application.
        </Alert>

        <Alert
          variant="light"
          color="yellow"
          title="Warning"
          icon={<AlertCircle size={18} />}
        >
          Make sure to configure your environment variables before deploying
          to production.
        </Alert>

        <Alert
          variant="light"
          color="red"
          title="Error"
          icon={<AlertCircle size={18} />}
        >
          Database connection failed. Please check your DATABASE_URL
          environment variable.
        </Alert>

        <Alert
          variant="filled"
          color="violet"
          title="Pro Tip"
          icon={<Bell size={18} />}
        >
          Use the AI chatbot on the Chat page to ask questions about this
          template.
        </Alert>

        <Blockquote
          color="blue"
          cite="– Mantine documentation"
          iconSize={40}
        >
          Mantine is a fully featured React components library that provides
          more than 100 components and 50 hooks.
        </Blockquote>

        <Spoiler maxHeight={60} showLabel="Show more" hideLabel="Hide">
          <Text size="sm" c="dimmed">
            This is a longer piece of text that gets truncated by default. When
            you click the spoiler button, it expands to reveal the full
            content. This is useful for displaying long descriptions or
            documentation excerpts without taking up too much space initially.
            The component handles the expand/collapse animation automatically.
          </Text>
        </Spoiler>

        <div>
          <Text size="sm" fw={500} mb="xs">
            Highlight
          </Text>
          <Highlight
            highlight="React Router"
            size="sm"
            c="dimmed"
          >
            React Router is a full-stack framework for building modern web
            applications with React Router v7.
          </Highlight>
        </div>

        <div>
          <Text size="sm" fw={500} mb="xs">
            Keyboard shortcuts
          </Text>
          <Group gap="xs">
            <Group gap={4}>
              <Kbd>Ctrl</Kbd>
              <Text size="sm">+</Text>
              <Kbd>C</Kbd>
            </Group>
            <Group gap={4}>
              <Kbd>Ctrl</Kbd>
              <Text size="sm">+</Text>
              <Kbd>V</Kbd>
            </Group>
            <Group gap={4}>
              <Kbd>Enter</Kbd>
            </Group>
            <Group gap={4}>
              <Kbd>Shift</Kbd>
              <Text size="sm">+</Text>
              <Kbd>Enter</Kbd>
            </Group>
          </Group>
        </div>
      </Stack>
    </Paper>
  );
}
