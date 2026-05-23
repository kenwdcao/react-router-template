import {
  Accordion,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Container,
  Drawer,
  Group,
  HoverCard,
  Loader,
  Modal,
  Paper,
  Popover,
  Progress,
  Select,
  Slider,
  Stack,
  Switch,
  Tabs,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Info, Mail } from "lucide-react";
import { ThemeSelector } from "~/ui/components/common";
import classes from "./MantineShowcase.module.css";

export function MantineShowcase() {
  return (
    <Container size="lg">
      <Title order={2} ta="center">
        Mantine in action
      </Title>
      <Text c="dimmed" ta="center" mb="lg">
        Interactive components you get out of the box.
      </Text>

      <Tabs variant="pills" defaultValue="forms">
        <Tabs.List justify="center" mb="lg">
          <Tabs.Tab value="forms">Forms</Tabs.Tab>
          <Tabs.Tab value="feedback">Feedback</Tabs.Tab>
          <Tabs.Tab value="layout">Layout</Tabs.Tab>
          <Tabs.Tab value="overlays">Overlays</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="forms" className={classes.tabPanel}>
          <FormsPanel />
        </Tabs.Panel>
        <Tabs.Panel value="feedback" className={classes.tabPanel}>
          <FeedbackPanel />
        </Tabs.Panel>
        <Tabs.Panel value="layout" className={classes.tabPanel}>
          <LayoutPanel />
        </Tabs.Panel>
        <Tabs.Panel value="overlays" className={classes.tabPanel}>
          <OverlaysPanel />
        </Tabs.Panel>
      </Tabs>

      <Paper withBorder p="md" mt="xl">
        <Text size="sm" c="dimmed" mb="sm">
          Switch color scheme and primary color below. Your choice is persisted
          via cookies and applies across the entire app.
        </Text>
        <Group>
          <ThemeSelector />
        </Group>
      </Paper>
    </Container>
  );
}

function FormsPanel() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
      favoriteFeature: "",
      notifications: false,
      satisfaction: 50,
      interests: [] as string[],
    },
  });

  return (
    <Paper withBorder p="lg">
      <Stack gap="md">
        <TextInput
          label="Email"
          placeholder="you@example.com"
          leftSection={<Mail size={16} />}
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
        <TextInput
          label="Password"
          type="password"
          placeholder="Your password"
          key={form.key("password")}
          {...form.getInputProps("password")}
        />
        <Select
          label="Favorite feature"
          placeholder="Pick one"
          data={["Authentication", "Database", "SSR", "Theming", "Testing"]}
          key={form.key("favoriteFeature")}
          {...form.getInputProps("favoriteFeature")}
        />
        <Text size="sm" fw={500}>
          Satisfaction
        </Text>
        <Slider
          label="Satisfaction"
          key={form.key("satisfaction")}
          {...form.getInputProps("satisfaction")}
          marks={[
            { value: 20, label: "20%" },
            { value: 50, label: "50%" },
            { value: 80, label: "80%" },
          ]}
        />
        <Switch
          label="Enable notifications"
          key={form.key("notifications")}
          {...form.getInputProps("notifications", { type: "checkbox" })}
        />
        <Checkbox.Group
          label="Interests"
          key={form.key("interests")}
          {...form.getInputProps("interests")}
        >
          <Group mt="xs">
            <Checkbox label="Frontend" value="frontend" />
            <Checkbox label="Backend" value="backend" />
          </Group>
        </Checkbox.Group>
      </Stack>
    </Paper>
  );
}

function FeedbackPanel() {
  return (
    <Stack gap="md">
      <Group>
        <Button
          onClick={() =>
            notifications.show({
              title: "Notification sent",
              message: "This is a Mantine notification toast.",
              color: "teal",
            })
          }
        >
          Show notification
        </Button>
        <ModalDemo />
        <Tooltip label="Tooltips appear on hover">
          <Button variant="default" aria-label="More info">
            <Info size={16} />
          </Button>
        </Tooltip>
      </Group>
      <Group>
        <Badge color="green" variant="dot">
          Live
        </Badge>
        <Progress value={66} animated w={200} />
        <Loader type="dots" />
      </Group>
    </Stack>
  );
}

function ModalDemo() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Button onClick={open}>Open modal</Button>
      <Modal opened={opened} onClose={close} title="Hello from Mantine">
        <Text>This is a Mantine modal with accessible title.</Text>
      </Modal>
    </>
  );
}

function LayoutPanel() {
  return (
    <Stack gap="md">
      <Accordion variant="separated">
        <Accordion.Item value="what">
          <Accordion.Control>What is Mantine?</Accordion.Control>
          <Accordion.Panel>
            Mantine is a React component library with 100+ hooks and components
            for building modern web applications.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="why-tailwind">
          <Accordion.Control>Why Tailwind too?</Accordion.Control>
          <Accordion.Panel>
            Tailwind complements Mantine for page-level layout utilities while
            Mantine handles component-level styling with its own design system.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="theming">
          <Accordion.Control>How theming works</Accordion.Control>
          <Accordion.Panel>
            Mantine uses CSS custom properties. You can switch primary colors
            and color schemes at runtime — try the ThemeSelector below!
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Group>
        <Avatar.Group>
          <Avatar color="blue">RR</Avatar>
          <Avatar color="violet">MT</Avatar>
          <Avatar color="teal">PK</Avatar>
          <Avatar color="pink">AB</Avatar>
          <Avatar>+3</Avatar>
        </Avatar.Group>
      </Group>
      <Card withBorder p="md">
        <Text size="sm" c="dimmed">
          Cards, Accordions, and Avatar groups are layout primitives that
          compose freely.
        </Text>
      </Card>
    </Stack>
  );
}

function OverlaysPanel() {
  return (
    <Group>
      <OverlayModalButton />
      <OverlayDrawerButton />
      <OverlayPopoverButton />
      <OverlayHoverCardButton />
    </Group>
  );
}

function OverlayModalButton() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Button variant="outline" onClick={open}>
        Modal
      </Button>
      <Modal opened={opened} onClose={close} title="Overlay Modal">
        <Text>Modal content rendered via portal.</Text>
      </Modal>
    </>
  );
}

function OverlayDrawerButton() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Button variant="outline" onClick={open}>
        Drawer
      </Button>
      <Drawer
        opened={opened}
        onClose={close}
        title="Side Drawer"
        position="right"
      >
        <Text>Drawer slides in from the right.</Text>
      </Drawer>
    </>
  );
}

function OverlayPopoverButton() {
  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button variant="outline">Popover</Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="sm">Popover content with arrow.</Text>
      </Popover.Dropdown>
    </Popover>
  );
}

function OverlayHoverCardButton() {
  return (
    <HoverCard width={280} shadow="md">
      <HoverCard.Target>
        <Button variant="outline">Hover Card</Button>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Group gap="xs" mb="xs">
          <Avatar color="blue">RR</Avatar>
          <Text size="sm" fw={500}>
            React Router Template
          </Text>
        </Group>
        <Text size="xs" c="dimmed">
          Hover cards are great for profile previews and contextual info.
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
