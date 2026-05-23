import {
  AppShell,
  Avatar,
  Burger,
  Button,
  Group,
  Indicator,
  ScrollArea,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { LogOut } from "lucide-react";
import {
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
} from "react-router";
import { signOut } from "~/lib/auth";
import { requireAuth } from "~/lib/auth/index.server";
import { getAvatarInitial } from "~/lib/utils";
import { ThemeSelector } from "~/ui/components/common";
import { Breadcrumbs } from "~/ui/components/dashboard";
import { Sidebar } from "~/ui/components/dashboard";
import type { Route } from "./+types/layout";

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
              to="/"
              aria-label="Home"
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
          <Sidebar />
        </ScrollArea>
      </AppShell.Navbar>
      <AppShell.Main>
        <Breadcrumbs />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
