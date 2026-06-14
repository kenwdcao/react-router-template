import { NavLink as MantineNavLink, Stack, Text, Tooltip } from "@mantine/core";
import {
  Activity,
  Component,
  FolderKanban,
  Home,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import classes from "./Sidebar.module.css";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  end?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
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
    ],
  },
  {
    label: "Account",
    items: [{ to: "/dashboard/settings", label: "Settings", icon: Settings }],
  },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const location = useLocation();

  return (
    <Stack gap="xs">
      {groups.map((group) => (
        <div key={group.label}>
          {!collapsed && (
            <Text size="xs" fw={600} c="dimmed" tt="uppercase" pl="sm" mb={4}>
              {group.label}
            </Text>
          )}
          {group.items.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            if (collapsed) {
              return (
                <Tooltip
                  key={item.to}
                  label={item.label}
                  position="right"
                  withArrow
                >
                  <MantineNavLink
                    component={Link}
                    to={item.to}
                    aria-label={item.label}
                    leftSection={<item.icon size={20} />}
                    active={isActive}
                    variant="light"
                    className={classes.railLink}
                  />
                </Tooltip>
              );
            }

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
