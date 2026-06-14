import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Button,
  Container,
  Group,
  Indicator,
  ScrollArea,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLoaderData, useNavigate } from "react-router";
import { signOut } from "~/lib/auth";
import { requireAdmin } from "~/lib/auth/index.server";
import {
  buildAdminSidebarCollapsedCookie,
  getAvatarInitial,
  parseAdminSidebarCollapsedCookie,
} from "~/lib/utils";
import { Sidebar } from "~/ui/admin";
import { ThemeSelector, TopNav } from "~/ui/components/common";
import type { Route } from "./+types/layout";
import classes from "./layout.module.css";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await requireAdmin(request);
  return {
    user: { email: session.user.email, name: session.user.name },
    sidebarCollapsed: parseAdminSidebarCollapsedCookie(
      request.headers.get("cookie"),
    ),
  };
}

export function meta() {
  return [{ title: "Admin" }];
}

export default function AdminLayout() {
  const { user, sidebarCollapsed } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();
  // Initial value comes from the loader (cookie-derived), so the server render
  // and the first client render agree — no expand→collapse flash on refresh.
  const [desktopCollapsed, setDesktopCollapsed] = useState(sidebarCollapsed);

  const handleToggleDesktopCollapsed = () => {
    setDesktopCollapsed((prev) => {
      const next = !prev;
      document.cookie = buildAdminSidebarCollapsedCookie(next);
      return next;
    });
  };

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{
        width: desktopCollapsed ? 56 : 260,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
      transitionDuration={200}
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
            <UnstyledButton component={Link} to="/" aria-label="Home">
              <Text fw={700} visibleFrom="sm">
                Admin
              </Text>
            </UnstyledButton>
          </Group>

          <TopNav isAdmin />

          <Group
            gap="sm"
            className="min-w-0 justify-self-end"
            justify="flex-end"
          >
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
        </div>
      </AppShell.Header>
      <AppShell.Navbar p={desktopCollapsed ? 8 : "md"}>
        <ScrollArea>
          <Sidebar collapsed={desktopCollapsed} />
        </ScrollArea>
        <ActionIcon
          variant="default"
          size="sm"
          radius="xl"
          className={classes.sidebarToggleButton}
          aria-label={
            desktopCollapsed
              ? "Expand app navigation"
              : "Collapse app navigation"
          }
          title={
            desktopCollapsed
              ? "Expand app navigation"
              : "Collapse app navigation"
          }
          onClick={handleToggleDesktopCollapsed}
          visibleFrom="sm"
        >
          {desktopCollapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </ActionIcon>
      </AppShell.Navbar>
      <AppShell.Main>
        <Container size="xl" className="mx-auto w-full px-0">
          <div className="pt-4">
            <Outlet />
          </div>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
