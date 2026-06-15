import { NavLink as MantineNavLink, Stack, Text, Tooltip } from "@mantine/core";
import { FolderOpenDot, Users } from "lucide-react";
import { Link, useLocation } from "react-router";
import classes from "./Sidebar.module.css";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Users;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const groups: NavGroup[] = [
  {
    label: "Management",
    items: [
      { to: "/admin/users", label: "Users", icon: Users },
      { to: "/admin/projects", label: "Projects", icon: FolderOpenDot },
    ],
  },
];

interface SidebarProps {
  collapsed?: boolean;
}

/**
 * Admin section sidebar. Mirrors the dashboard `Sidebar` (active-state
 * matching, collapsed→icon-only `Tooltip` mode, expanded→labeled `NavLink`).
 */
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
            // Match on path boundaries so /admin/users doesn't also highlight
            // for a hypothetical /admin/users-archive route.
            const isActive =
              location.pathname === item.to ||
              location.pathname.startsWith(`${item.to}/`);

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
