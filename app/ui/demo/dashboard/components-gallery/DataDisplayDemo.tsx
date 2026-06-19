import {
  Accordion,
  Avatar,
  Badge,
  Card,
  Group,
  Indicator,
  Paper,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  Timeline,
  Title,
  Tooltip,
} from "@mantine/core";
import { GitBranch, GitCommit, MessageSquare, Plus } from "lucide-react";

export function DataDisplayDemo() {
  return (
    <Paper withBorder p="md" radius="sm">
      <Title order={3} mb="md">
        Data Display
      </Title>

      <Stack gap="md">
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Card withBorder shadow="sm" padding="lg">
            <Text fw={500} size="lg" mb="xs">
              Project Alpha
            </Text>
            <Text size="sm" c="dimmed">
              A sample project card with some descriptive text.
            </Text>
            <Group mt="md">
              <Badge color="green">Active</Badge>
              <Badge variant="outline">v1.0</Badge>
            </Group>
          </Card>

          <Card withBorder shadow="sm" padding="lg">
            <Text fw={500} size="lg" mb="xs">
              Project Beta
            </Text>
            <Text size="sm" c="dimmed">
              Another project using the same card layout.
            </Text>
            <Group mt="md">
              <Badge color="yellow">Pending</Badge>
              <Badge variant="outline">v0.5</Badge>
            </Group>
          </Card>

          <Card withBorder shadow="sm" padding="lg">
            <Text fw={500} size="lg" mb="xs">
              Project Gamma
            </Text>
            <Text size="sm" c="dimmed">
              A third card to demonstrate the grid.
            </Text>
            <Group mt="md">
              <Badge color="gray">Archived</Badge>
              <Badge variant="outline">v2.1</Badge>
            </Group>
          </Card>
        </SimpleGrid>

        <Group gap="xs">
          <Badge>Default</Badge>
          <Badge color="green">Success</Badge>
          <Badge color="yellow">Warning</Badge>
          <Badge color="red">Error</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="dot">Dot</Badge>
          <Badge size="lg" variant="filled" color="violet">
            Large
          </Badge>
        </Group>

        <Group>
          <Tooltip label="Online">
            <Indicator processing size={12} color="green" offset={4}>
              <Avatar radius="xl">JD</Avatar>
            </Indicator>
          </Tooltip>
          <Tooltip label="Away">
            <Indicator processing size={12} color="yellow" offset={4}>
              <Avatar radius="xl">AB</Avatar>
            </Indicator>
          </Tooltip>
          <Tooltip label="Busy">
            <Indicator processing size={12} color="red" offset={4}>
              <Avatar radius="xl" color="red">
                CD
              </Avatar>
            </Indicator>
          </Tooltip>
          <Avatar.Group>
            <Avatar radius="xl">JD</Avatar>
            <Avatar radius="xl">AB</Avatar>
            <Avatar radius="xl">+3</Avatar>
          </Avatar.Group>
        </Group>

        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="details">Details</Tabs.Tab>
            <Tabs.Tab value="settings">Settings</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview" pt="xs">
            <Text size="sm" c="dimmed">
              The overview tab shows general information about the selected
              item.
            </Text>
          </Tabs.Panel>
          <Tabs.Panel value="details" pt="xs">
            <Text size="sm" c="dimmed">
              Detailed metrics and data are displayed here.
            </Text>
          </Tabs.Panel>
          <Tabs.Panel value="settings" pt="xs">
            <Text size="sm" c="dimmed">
              Configuration options live in the settings tab.
            </Text>
          </Tabs.Panel>
        </Tabs>

        <Accordion>
          <Accordion.Item value="what">
            <Accordion.Control>What is this template?</Accordion.Control>
            <Accordion.Panel>
              A production-grade full-stack React Router v8 starter with
              TypeScript, Mantine, and more.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="stack">
            <Accordion.Control>What stack does it use?</Accordion.Control>
            <Accordion.Panel>
              React Router v8, React 19, TypeScript, Mantine v9, Tailwind CSS
              v4, Kysely, Prisma, and better-auth.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="deploy">
            <Accordion.Control>How do I deploy?</Accordion.Control>
            <Accordion.Panel>
              Build with pnpm build, then deploy the server build to any Node.js
              host. Set environment variables for database, auth, and AI.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Timeline active={1} bulletSize={24} lineWidth={2}>
          <Timeline.Item bullet={<Plus size={14} />} title="Project created">
            <Text c="dimmed" size="sm">
              Initial project setup completed
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              2 hours ago
            </Text>
          </Timeline.Item>
          <Timeline.Item
            bullet={<GitBranch size={14} />}
            title="Branch created"
          >
            <Text c="dimmed" size="sm">
              Feature branch for new functionality
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              5 hours ago
            </Text>
          </Timeline.Item>
          <Timeline.Item
            bullet={<GitCommit size={14} />}
            title="Committed changes"
          >
            <Text c="dimmed" size="sm">
              Added new components and tests
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              1 day ago
            </Text>
          </Timeline.Item>
          <Timeline.Item
            bullet={<MessageSquare size={14} />}
            title="Code review"
          >
            <Text c="dimmed" size="sm">
              Waiting for review feedback
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              1 day ago
            </Text>
          </Timeline.Item>
        </Timeline>
      </Stack>
    </Paper>
  );
}
