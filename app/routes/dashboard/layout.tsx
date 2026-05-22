import {
  AppShell,
  Avatar,
  Burger,
  Button,
  Group,
  ScrollArea,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Home, LogOut, PanelsTopLeft } from "lucide-react";
import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigate,
} from "react-router";
import { signOut } from "~/lib/auth/client";
import { requireAuth } from "~/lib/auth/require-auth.server";
import { ThemeSelector } from "~/ui/components/common/ThemeSelector";
import type { Route } from "./+types/layout";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: Home, end: true },
  { to: "/dashboard/projects", label: "Projects", icon: PanelsTopLeft },
];

export async function loader({ request }: Route.LoaderArgs) {
  const session = await requireAuth(request);

  return {
    user: {
      email: session.user.email,
      name: session.user.name,
    },
  };
}

export default function DashboardLayout() {
  const { user } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <div className="grid h-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4">
          <Group gap="sm" className="min-w-0 justify-self-start">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              aria-label="Toggle navigation"
            />
            <UnstyledButton
              component={Link}
              to="/dashboard"
              aria-label="Dashboard home"
            >
              <Text fw={700}>React Router Template</Text>
            </UnstyledButton>
          </Group>

          <Button
            variant="subtle"
            component={Link}
            to="/dashboard"
            className="justify-self-center"
          >
            Dashboard
          </Button>

          <Group gap="sm" className="min-w-0 justify-self-end">
            <ThemeSelector />
            <Avatar size="sm" radius="xl">
              {getAvatarInitial(user.name, user.email)}
            </Avatar>
            <Text size="sm" visibleFrom="md">
              {user.name || user.email}
            </Text>
            <Button
              variant="subtle"
              size="compact-sm"
              leftSection={<LogOut size={16} />}
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              Sign out
            </Button>
          </Group>
        </div>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <ScrollArea>
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <DashboardNavLink key={item.to} {...item} />
            ))}
          </nav>
        </ScrollArea>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

function DashboardNavLink({
  to,
  label,
  icon: Icon,
  end,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
          isActive
            ? "text-[var(--mantine-primary-color-filled)] hover:bg-[var(--mantine-color-default-hover)]"
            : "text-[var(--mantine-color-dimmed)] hover:bg-[var(--mantine-color-default-hover)] hover:text-[var(--mantine-color-text)]",
        ].join(" ")
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
}

function getAvatarInitial(name?: string | null, email?: string | null): string {
  const source = (name ?? "").trim() || (email ?? "").trim() || "?";
  return source.charAt(0).toUpperCase();
}
