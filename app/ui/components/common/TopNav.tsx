import { Button, Group } from "@mantine/core";
import { LayoutDashboard, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "react-router";

interface TopNavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const items: TopNavItem[] = [
  { to: "/demo/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin", label: "Admin", icon: ShieldCheck },
];

interface TopNavProps {
  /** Whether the current user is an admin. Non-admins never see the Admin link. */
  isAdmin?: boolean;
}

/**
 * Centered primary navigation: Dashboard is always shown to authenticated users;
 * Admin is gated by `isAdmin`. The active item is highlighted based on the
 * current URL via prefix match (the dashboard `/demo/dashboard` prefix and the
 * `/admin` prefix), mirroring the active-state logic in the sidebar components.
 */
export function TopNav({ isAdmin = false }: TopNavProps) {
  const { pathname } = useLocation();
  const visible = isAdmin ? items : items.slice(0, 1);

  return (
    <Group gap="xs" className="justify-self-center">
      {visible.map((item) => {
        const active = pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Button
            key={item.to}
            component={Link}
            to={item.to}
            variant={active ? "light" : "subtle"}
            leftSection={<Icon size={16} />}
            aria-current={active ? "page" : undefined}
            visibleFrom="sm"
          >
            {item.label}
          </Button>
        );
      })}
    </Group>
  );
}
