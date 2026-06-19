import {
  ActionIcon,
  AppShell,
  Burger,
  Container,
  Group,
  ScrollArea,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLoaderData } from "react-router";
import { requireAdmin } from "~/lib/auth/index.server";
import {
  buildAdminSidebarCollapsedCookie,
  parseAdminSidebarCollapsedCookie,
} from "~/lib/utils";
import { Sidebar } from "~/ui/admin";
import { ThemeSelector, TopNav, UserMenu } from "~/ui/components/common";
import type { Route } from "./+types/layout";
import classes from "./layout.module.css";

export async function loader({ request, url }: Route.LoaderArgs) {
  const session = await requireAdmin(request, url.pathname);
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
      padding="xs"
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
            <UserMenu user={user} />
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
        <Container fluid className="mx-auto w-full px-0">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
