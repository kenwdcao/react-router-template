import {
  Button,
  Drawer,
  Group,
  HoverCard,
  Menu,
  Modal,
  Paper,
  Popover,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export function OverlayDemo() {
  const [modalOpened, modalHandlers] = useDisclosure(false);
  const [drawerOpened, drawerHandlers] = useDisclosure(false);

  return (
    <Paper withBorder p="md" radius="sm">
      <Title order={3} mb="md">
        Overlays
      </Title>

      <Group gap="xs" wrap="wrap">
        <Button variant="light" onClick={modalHandlers.open}>
          Open modal
        </Button>
        <Button variant="light" onClick={drawerHandlers.open}>
          Open drawer
        </Button>

        <Popover width={200} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <Button variant="light">Open popover</Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="sm">
              This is a popover with some content inside. Use it for contextual
              information.
            </Text>
          </Popover.Dropdown>
        </Popover>

        <HoverCard width={280} shadow="md">
          <HoverCard.Target>
            <Button variant="light">Hover card</Button>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Text size="sm" fw={500} mb="xs">
              Extra information
            </Text>
            <Text size="xs" c="dimmed">
              Hover cards are great for showing additional context without
              requiring a click.
            </Text>
          </HoverCard.Dropdown>
        </HoverCard>

        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button variant="light">Menu</Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item>View details</Menu.Item>
            <Menu.Item>Edit item</Menu.Item>
            <Menu.Item color="red">Delete item</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Modal
        opened={modalOpened}
        onClose={modalHandlers.close}
        title={<Text fw={700}>Demo modal</Text>}
        closeButtonProps={{ "aria-label": "Close demo modal" }}
      >
        <Text>
          This is a Mantine Modal. Use it for forms, confirmations, or focused
          interactions that block the rest of the page.
        </Text>
      </Modal>

      <Drawer
        opened={drawerOpened}
        onClose={drawerHandlers.close}
        title={<Text fw={700}>Demo drawer</Text>}
        closeButtonProps={{ "aria-label": "Close demo drawer" }}
      >
        <Stack gap="md">
          <Text>
            This is a Mantine Drawer. It slides in from the side and is useful
            for panels, filters, or detail views.
          </Text>
        </Stack>
      </Drawer>
    </Paper>
  );
}
