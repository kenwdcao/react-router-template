import {
  Avatar,
  Box,
  Group,
  Indicator,
  Menu,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { ChevronDown, LogOut, Settings as SettingsIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { signOut } from "~/lib/auth";
import { getAvatarInitial } from "~/lib/utils";

interface UserMenuProps {
  user: { name: string; email: string };
}

/**
 * Account control rendered in every authenticated header. Replaces the old
 * decorative avatar + standalone "Sign out" button with a single dropdown:
 *
 *   (JW) Jane Worker ▾
 *     ┌──────────────────────┐
 *     │ Jane Worker           │
 *     │ jane@example.com      │
 *     │ ────────────────────  │
 *     │ ⚙  Settings           │  → /settings
 *     │ ⎋  Sign out           │
 *     └──────────────────────┘
 *
 * The target is the avatar + name + chevron; the name is hidden below the `md`
 * breakpoint so the control still fits on mobile headers.
 */
export function UserMenu({ user }: UserMenuProps) {
  const navigate = useNavigate();
  const displayName = user.name || user.email;

  const handleSignOut = async () => {
    await signOut();
    void navigate("/");
  };

  return (
    <Menu position="bottom-end" withinPortal shadow="md" width={240}>
      <Menu.Target>
        <UnstyledButton
          aria-label="Open account menu"
          className="rounded-sm px-2 py-1 hover:bg-(--mantine-color-default-hover)"
        >
          <Group gap="xs">
            <Indicator
              processing
              size={8}
              offset={4}
              color="green"
              position="bottom-end"
            >
              <Avatar size="sm" radius="xl">
                {getAvatarInitial(user.name, user.email)}
              </Avatar>
            </Indicator>
            <Text size="sm" visibleFrom="md">
              {displayName}
            </Text>
            <Box visibleFrom="md" c="dimmed">
              <ChevronDown size={14} />
            </Box>
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Box px="sm" py={6}>
          <Stack gap={2}>
            <Text size="sm" fw={600} lineClamp={1}>
              {displayName}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              {user.email}
            </Text>
          </Stack>
        </Box>

        <Menu.Divider />

        <Menu.Item
          component={Link}
          to="/settings"
          leftSection={<SettingsIcon size={16} />}
        >
          Settings
        </Menu.Item>

        <Menu.Item
          color="red"
          leftSection={<LogOut size={16} />}
          onClick={handleSignOut}
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
