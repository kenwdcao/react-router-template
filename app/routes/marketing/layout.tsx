import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Button,
  Drawer,
  Group,
  NavLink,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { Link, Outlet, useLoaderData, useNavigate } from "react-router";
import { signOut } from "~/lib/auth";
import { getSession, isAdminEmail } from "~/lib/auth/index.server";
import { getAvatarInitial } from "~/lib/utils";
import { ThemeSelector, TopNav } from "~/ui/components/common";
import type { Route } from "./+types/layout";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);

  return {
    user: session
      ? {
          email: session.user.email,
          name: session.user.name,
        }
      : null,
    // Only the boolean crosses to the client; the ADMIN_EMAILS list stays server-side.
    isAdmin: session ? isAdminEmail(session.user.email) : false,
  };
}

export default function MarketingLayout() {
  const { user, isAdmin } = useLoaderData<typeof loader>();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure();

  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <div className="grid h-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4">
          <Group gap="sm" className="min-w-0 justify-self-start">
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="sm"
              size="sm"
              aria-label="Toggle navigation"
            />
            <UnstyledButton component={Link} to="/" aria-label="Home">
              <Text fw={700} size="lg" className="truncate">
                React Router Template
              </Text>
            </UnstyledButton>
          </Group>

          <TopNav isAdmin={isAdmin} />

          <Group
            gap="sm"
            justify="flex-end"
            className="min-w-0 justify-self-end"
          >
            <ThemeSelector />
            <MarketingAuthActions user={user} />
          </Group>
        </div>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title="Navigation"
        size="xs"
        hiddenFrom="sm"
      >
        <Stack gap="sm">
          <NavLink
            component={Link}
            to="/demo/dashboard"
            label="Dashboard"
            leftSection={<LayoutDashboard size={18} />}
            onClick={closeDrawer}
          />
          {isAdmin ? (
            <NavLink
              component={Link}
              to="/admin"
              label="Admin"
              leftSection={<ShieldCheck size={18} />}
              onClick={closeDrawer}
            />
          ) : null}
        </Stack>
      </Drawer>
    </AppShell>
  );
}

function MarketingAuthActions({
  user,
}: {
  user: {
    email: string;
    name: string;
  } | null;
}) {
  const navigate = useNavigate();

  if (user) {
    const displayName = user.name || user.email;

    return (
      <Group gap="sm">
        <Avatar size="sm" radius="xl">
          {getAvatarInitial(user.name, user.email)}
        </Avatar>
        <Text size="sm" visibleFrom="md">
          {displayName}
        </Text>
        <ActionIcon
          variant="subtle"
          size="sm"
          hiddenFrom="sm"
          aria-label="Sign out"
          onClick={async () => {
            await signOut();
            void navigate("/");
          }}
        >
          <LogOut size={16} />
        </ActionIcon>
        <Button
          variant="subtle"
          size="compact-sm"
          leftSection={<LogOut size={16} />}
          visibleFrom="sm"
          onClick={async () => {
            await signOut();
            void navigate("/");
          }}
        >
          Sign out
        </Button>
      </Group>
    );
  }

  return (
    <Group gap="xs">
      <Button variant="subtle" component={Link} to="/login">
        Sign in
      </Button>
      <Button component={Link} to="/register">
        Register
      </Button>
    </Group>
  );
}
