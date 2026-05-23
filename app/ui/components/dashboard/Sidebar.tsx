import { NavLink as MantineNavLink, Stack, Text } from "@mantine/core";
import {
  Activity,
  Bot,
  Component,
  FolderKanban,
  Home,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router";

interface NavGroup {
  label: string;
  items: Array<{
    to: string;
    label: string;
    icon: typeof Home;
    end?: boolean;
  }>;
}

const groups: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { to: "/dashboard", label: "Overview", icon: Home, end: true },
      { to: "/dashboard/projects", label: "Projects", icon: FolderKanban },
      { to: "/dashboard/activity", label: "Activity", icon: Activity },
    ],
  },
  {
    label: "Demos",
    items: [
      { to: "/dashboard/components", label: "Components", icon: Component },
      { to: "/dashboard/chat", label: "AI Chat", icon: Bot },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <Stack gap="xs">
      {groups.map((group) => (
        <div key={group.label}>
          <Text size="xs" fw={600} c="dimmed" tt="uppercase" pl="sm" mb={4}>
            {group.label}
          </Text>
          {group.items.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <MantineNavLink
                key={item.to}
                component={Link}
                to={item.to}
                label={item.label}
                leftSection={<item.icon size={18} />}
                active={isActive}
                variant="light"
              />
            );
          })}
        </div>
      ))}
    </Stack>
  );
}
