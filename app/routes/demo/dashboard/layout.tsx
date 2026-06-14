import {
  ActionIcon,
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
import { Bot, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLoaderData, useNavigate } from "react-router";
import { signOut } from "~/lib/auth";
import { isAdminEmail, requireAuth } from "~/lib/auth/index.server";
import {
  buildChatExpandedCookie,
  buildChatOpenCookie,
  buildSidebarCollapsedCookie,
  getAvatarInitial,
  migrateSidebarCollapsedFromLocalStorage,
  parseChatExpandedCookie,
  parseChatOpenCookie,
  parseSidebarCollapsedCookie,
} from "~/lib/utils";
import { ThemeSelector, TopNav } from "~/ui/components/common";
import { Breadcrumbs, Sidebar } from "~/ui/demo/dashboard";
import { ChatSidebarPanel } from "~/ui/demo/dashboard/chat";
import type { Route } from "./+types/layout";
import classes from "./layout.module.css";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await requireAuth(request);

  return {
    user: {
      email: session.user.email,
      name: session.user.name,
    },
    // Only the boolean crosses to the client; the ADMIN_EMAILS list stays server-side.
    isAdmin: isAdminEmail(session.user.email),
    sidebarCollapsed: parseSidebarCollapsedCookie(
      request.headers.get("cookie"),
    ),
    chatOpen: parseChatOpenCookie(request.headers.get("cookie")),
    chatExpanded: parseChatExpandedCookie(request.headers.get("cookie")),
  };
}

export default function DashboardLayout() {
  const { user, isAdmin, sidebarCollapsed, chatOpen, chatExpanded } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();
  // Initial value comes from the loader (cookie-derived), so the server render
  // and the first client render agree — no expand→collapse flash on refresh.
  const [desktopCollapsed, setDesktopCollapsed] = useState(sidebarCollapsed);
  // Same SSR-safe seeding for the AI chat aside.
  const [chatOpenState, setChatOpenState] = useState(chatOpen);
  const [chatExpandedState, setChatExpandedState] = useState(chatExpanded);

  // Seed the cookie from the legacy localStorage preference once, without
  // touching render state. No-op once the cookie is authoritative.
  useEffect(() => {
    migrateSidebarCollapsedFromLocalStorage();
  }, []);

  const handleToggleDesktopCollapsed = () => {
    setDesktopCollapsed((prev) => {
      const next = !prev;
      document.cookie = buildSidebarCollapsedCookie(next);
      return next;
    });
  };

  const handleToggleChat = () => {
    setChatOpenState((prev) => {
      const next = !prev;
      document.cookie = buildChatOpenCookie(next);
      return next;
    });
  };

  const handleToggleChatExpanded = () => {
    setChatExpandedState((prev) => {
      const next = !prev;
      document.cookie = buildChatExpandedCookie(next);
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
      aside={{
        width: chatExpandedState ? 630 : 420,
        breakpoint: "sm",
        collapsed: { desktop: !chatOpenState, mobile: true },
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
                React Router Template
              </Text>
            </UnstyledButton>
          </Group>

          <TopNav isAdmin={isAdmin} />

          <Group
            gap="sm"
            className="min-w-0 justify-self-end"
            justify="flex-end"
          >
            <ActionIcon
              variant={chatOpenState ? "filled" : "light"}
              size="sm"
              visibleFrom="sm"
              aria-label={chatOpenState ? "Close AI chat" : "Open AI chat"}
              title={chatOpenState ? "Close AI chat" : "Open AI chat"}
              onClick={handleToggleChat}
            >
              <Bot size={16} />
            </ActionIcon>
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
        <Breadcrumbs />
        <Outlet />
      </AppShell.Main>
      <AppShell.Aside p="md">
        {chatOpenState ? (
          <ChatSidebarPanel
            onClose={handleToggleChat}
            onToggleExpanded={handleToggleChatExpanded}
            expanded={chatExpandedState}
          />
        ) : null}
      </AppShell.Aside>
    </AppShell>
  );
}
