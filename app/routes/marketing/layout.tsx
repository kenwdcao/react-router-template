import {
  AppShell,
  Avatar,
  Button,
  Group,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { LogOut } from "lucide-react";
import { Link, Outlet, useLoaderData, useNavigate } from "react-router";
import { signOut } from "~/lib/auth";
import { getSession } from "~/lib/auth/index.server";
import { getAvatarInitial } from "~/lib/utils";
import { ThemeSelector } from "~/ui/components/common";
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
  };
}

export default function MarketingLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <div className="grid h-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4">
          <div className="min-w-0 justify-self-start">
            <UnstyledButton component={Link} to="/" aria-label="Home">
              <Text fw={700} size="lg" className="truncate">
                React Router Template
              </Text>
            </UnstyledButton>
          </div>

          <Group justify="center" className="justify-self-center">
            {user && (
              <Button variant="subtle" component={Link} to="/dashboard">
                Dashboard
              </Button>
            )}
          </Group>

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
